"""Integration and route tests for FastAPI application (app.main)."""

from io import BytesIO
from pathlib import Path
from fastapi.testclient import TestClient
import pytest
from app.main import app
from tests.test_extract import generate_minimal_valid_pdf, generate_sample_docx

client = TestClient(app)


def test_health_check():
    """Verifies that the GET / endpoint returns online health status."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["version"] == "1.0.0"


def test_analyze_with_text_payload():
    """Verifies that POST /analyze processes raw resume_text and jd_text."""
    payload = {
        "resume_text": "Vikas | B.Tech CSE\nSkilled in Python, FastAPI, React, PostgreSQL.",
        "jd_text": "Seeking a Backend Engineer proficient in Python, FastAPI, Docker, and Kubernetes.",
    }
    response = client.post("/analyze", data=payload)
    assert response.status_code == 200
    data = response.json()

    assert "score" in data
    assert isinstance(data["score"], float)
    assert 10.0 <= data["score"] <= 100.0
    assert "Docker" in data["missing_keywords"]
    assert "Kubernetes" in data["missing_keywords"]
    assert "Python" not in data["missing_keywords"]
    assert data["extracted_skills_count"] >= 3
    assert data["jd_skills_count"] >= 3


def test_analyze_with_pdf_upload(tmp_path: Path):
    """Verifies that POST /analyze extracts and processes uploaded PDF documents."""
    pdf_file = tmp_path / "resume.pdf"
    generate_minimal_valid_pdf(pdf_file, "Vikas Python FastAPI PostgreSQL Developer")

    with open(pdf_file, "rb") as f:
        files = {"resume_file": ("resume.pdf", f, "application/pdf")}
        data = {"jd_text": "Looking for a Python and Docker developer."}
        response = client.post("/analyze", data=data, files=files)

    assert response.status_code == 200
    result = response.json()
    assert result["score"] > 0.0
    assert "Docker" in result["missing_keywords"]


def test_analyze_with_docx_upload(tmp_path: Path):
    """Verifies that POST /analyze extracts and processes uploaded DOCX documents."""
    docx_file = tmp_path / "resume.docx"
    generate_sample_docx(docx_file)

    with open(docx_file, "rb") as f:
        files = {
            "resume_file": (
                "resume.docx",
                f,
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            )
        }
        data = {"jd_text": "Looking for FastAPI, Python, and AWS expertise."}
        response = client.post("/analyze", data=data, files=files)

    assert response.status_code == 200
    result = response.json()
    assert result["score"] > 0.0
    assert "AWS" in result["missing_keywords"]


def test_analyze_missing_resume():
    """Verifies that submitting without resume_text or resume_file returns 400 Bad Request."""
    response = client.post("/analyze", data={"jd_text": "Looking for Python developer."})
    assert response.status_code == 400
    assert "Either a resume_file" in response.json()["detail"]


def test_analyze_empty_jd():
    """Verifies that submitting with empty jd_text returns 400 Bad Request."""
    response = client.post("/analyze", data={"resume_text": "Python developer", "jd_text": "   "})
    assert response.status_code == 400
    assert "cannot be empty" in response.json()["detail"]


def test_analyze_unsupported_file_format():
    """Verifies that uploading an unsupported file type (e.g. .txt) returns 400 Bad Request."""
    files = {"resume_file": ("resume.txt", BytesIO(b"Plain text"), "text/plain")}
    response = client.post("/analyze", data={"jd_text": "Python developer"}, files=files)
    assert response.status_code == 400
    assert "Unsupported file format" in response.json()["detail"]

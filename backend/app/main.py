"""FastAPI REST API layer for Resume-JD Matcher.

Provides endpoints for document ingestion, NLP similarity matching,
and keyword gap analysis.
"""

from pathlib import Path
import tempfile
from typing import List, Optional
from fastapi import FastAPI, File, Form, HTTPException, UploadFile, status
from pydantic import BaseModel, Field
from app.extract import extract_text
from app.match import compute_score, extract_skills_from_text, missing_keywords

app = FastAPI(
    title="Resume-JD Matcher Intelligence API",
    description="ATS resume optimization and keyword matching API powered by FastAPI and spaCy.",
    version="1.0.0",
)


class AnalysisResponse(BaseModel):
    """Structured response schema for match analysis."""

    score: float = Field(..., description="Match percentage score between 0.0 and 100.0")
    missing_keywords: List[str] = Field(
        ..., description="List of technical skills present in the JD but absent from the resume"
    )
    extracted_skills_count: int = Field(
        ..., description="Total unique technical skills detected in the candidate's resume"
    )
    jd_skills_count: int = Field(
        ..., description="Total unique technical skills detected in the job description"
    )


class HealthResponse(BaseModel):
    """Health check response schema."""

    status: str = "online"
    message: str = "Resume-JD Matcher API is running"
    version: str = "1.0.0"


@app.get("/", response_model=HealthResponse, tags=["Health"])
def health_check() -> HealthResponse:
    """Returns the operational status and version of the API."""
    return HealthResponse()


@app.post("/analyze", response_model=AnalysisResponse, tags=["Matching"])
async def analyze_match(
    resume_file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None),
    jd_text: str = Form(...),
) -> AnalysisResponse:
    """Analyzes resume and job description to return similarity score and missing skills.

    Accepts resume either as a binary file (.pdf / .docx) or as raw text.

    Args:
        resume_file (Optional[UploadFile]): Uploaded resume document (.pdf or .docx).
        resume_text (Optional[str]): Pasted resume text (if not uploading a file).
        jd_text (str): Job description text (required).

    Returns:
        AnalysisResponse: Scored similarity metrics, missing skills, and ontology counts.

    Raises:
        HTTPException: 400 if inputs are missing, empty, or unparseable.
    """
    if not jd_text or not jd_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description (jd_text) cannot be empty.",
        )

    resolved_resume_text = ""

    # Ingest from uploaded file if present
    if resume_file and resume_file.filename:
        filename = resume_file.filename
        extension = Path(filename).suffix.lower()

        if extension not in [".pdf", ".docx"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file format '{extension}'. Only .pdf and .docx are supported.",
            )

        # Write to temporary file for parsing
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as tmp:
                content = await resume_file.read()
                if not content:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="The uploaded resume file is empty.",
                    )
                tmp.write(content)
                tmp_path = Path(tmp.name)

            try:
                resolved_resume_text = extract_text(tmp_path)
            finally:
                if tmp_path.exists():
                    tmp_path.unlink()
        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to process resume file: {exc}",
            ) from exc

    elif resume_text and resume_text.strip():
        resolved_resume_text = resume_text.strip()
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either a resume_file (.pdf/.docx) or resume_text must be provided.",
        )

    # Execute matching algorithms
    score = compute_score(resolved_resume_text, jd_text)
    missing = missing_keywords(resolved_resume_text, jd_text)
    resume_skills = extract_skills_from_text(resolved_resume_text)
    jd_skills = extract_skills_from_text(jd_text)

    return AnalysisResponse(
        score=score,
        missing_keywords=missing,
        extracted_skills_count=len(resume_skills),
        jd_skills_count=len(jd_skills),
    )

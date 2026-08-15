"""Unit tests for algorithmic matching and similarity scoring module (app.match)."""

import pytest
from app.match import compute_score, extract_skills_from_text, missing_keywords


def test_compute_score_identical_texts():
    """Verifies that identical textual content results in a 100.0% match score."""
    sample_text = (
        "Seeking a Senior Python Engineer skilled in FastAPI, Docker, and PostgreSQL "
        "to design high-throughput microservices."
    )
    score = compute_score(sample_text, sample_text)
    assert score == 100.0


def test_compute_score_completely_disjoint_texts():
    """Verifies that texts with zero vocabulary overlap score 0.0%."""
    resume_text = "Experienced chef specializing in Italian pastry baking, sourdough bread, and desserts."
    jd_text = "Looking for a quantum physics researcher with expertise in superconducting circuits and cryogenics."

    score = compute_score(resume_text, jd_text)
    assert score == 0.0


def test_compute_score_partial_software_engineering_match():
    """Verifies realistic match scoring for a candidate with overlapping competencies."""
    resume_text = (
        "Vikas - Software Engineer\n"
        "Proficient in Python, FastAPI, REST APIs, Git, and PostgreSQL.\n"
        "Built web applications and machine learning prototypes with scikit-learn."
    )
    jd_text = (
        "Job Description: Backend Python Developer\n"
        "Requirements:\n"
        "- Strong proficiency in Python and FastAPI\n"
        "- Experience with PostgreSQL database and REST API design\n"
        "- Familiarity with Docker, Kubernetes, and AWS cloud deployment"
    )

    score = compute_score(resume_text, jd_text)

    # Partial overlap on Python, FastAPI, PostgreSQL, REST API yields non-zero realistic score
    assert 10.0 <= score <= 90.0
    assert isinstance(score, float)


def test_compute_score_ranking_monotonicity():
    """Verifies that a more relevant resume receives a strictly higher score than a less relevant one."""
    jd_text = "Senior Backend Engineer with Python, FastAPI, Docker, PostgreSQL, and Redis experience."

    high_match_resume = "Senior Engineer skilled in Python, FastAPI, Docker, and PostgreSQL backend architecture."
    low_match_resume = "Junior Graphic Designer experienced in Adobe Photoshop, Figma, and Canva."

    high_score = compute_score(high_match_resume, jd_text)
    low_score = compute_score(low_match_resume, jd_text)

    assert high_score > low_score
    assert high_score >= 40.0
    assert low_score <= 10.0


def test_compute_score_empty_or_falsy_inputs():
    """Verifies that empty strings, whitespace, or None safely return 0.0."""
    assert compute_score("", "Python developer") == 0.0
    assert compute_score("Python developer", "") == 0.0
    assert compute_score("", "") == 0.0
    assert compute_score("   ", "   ") == 0.0


def test_extract_skills_from_text_special_characters():
    """Verifies extraction of single-word, multi-word, and special-character skills."""
    text = "Core stack includes C++, Node.js, Next.js, REST API, and Machine Learning."
    skills = extract_skills_from_text(text)

    assert "c++" in skills
    assert "node.js" in skills
    assert "next.js" in skills
    assert "rest api" in skills
    assert "machine learning" in skills


def test_missing_keywords_detection_and_formatting():
    """Verifies detection of single-word and compound missing skills in proper display casing."""
    resume_text = (
        "Vikas | B.Tech CSE\n"
        "Skills: Python, FastAPI, PostgreSQL, Git, React."
    )
    jd_text = (
        "Looking for a Full Stack Developer.\n"
        "Must have: Python, FastAPI, React, PostgreSQL.\n"
        "Required Cloud/DevOps: Docker, Kubernetes, AWS, and CI/CD pipeline experience."
    )

    missing = missing_keywords(resume_text, jd_text)

    # Missing from resume: AWS, CI/CD, Docker, Kubernetes
    assert "Docker" in missing
    assert "Kubernetes" in missing
    assert "AWS" in missing
    assert "CI/CD" in missing

    # Present in resume: should NOT be in missing
    assert "Python" not in missing
    assert "FastAPI" not in missing
    assert "React" not in missing
    assert "PostgreSQL" not in missing


def test_missing_keywords_empty_when_all_skills_covered():
    """Verifies that an empty list is returned when the resume contains all required skills."""
    jd_text = "Requirements: Python, FastAPI, Docker, Redis."
    resume_text = "Proficient in Python, FastAPI, Redis, and Docker deployment."

    missing = missing_keywords(resume_text, jd_text)
    assert missing == []


def test_missing_keywords_empty_or_falsy_inputs():
    """Verifies safe handling of empty inputs in missing_keywords."""
    assert missing_keywords("Python Developer", "") == []
    assert missing_keywords("", "Requirements: Docker, Kubernetes") == ["Docker", "Kubernetes"]
    assert missing_keywords("", "") == []

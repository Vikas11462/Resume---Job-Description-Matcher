"""Unit tests for skills taxonomy and dictionary module (app.skills_dict)."""

import pytest
from app.skills_dict import TECH_SKILLS_TAXONOMY, get_all_skills_list, get_skills_set


def test_skills_taxonomy_categories():
    """Verifies that all major technology pillars are represented in the taxonomy."""
    expected_categories = [
        "Programming Languages",
        "Frontend Frameworks & Libraries",
        "Backend Frameworks & Runtimes",
        "Databases & Caching",
        "Cloud & DevOps",
        "Machine Learning, NLP & Data",
        "Architecture, Security & Methodologies",
    ]

    for category in expected_categories:
        assert category in TECH_SKILLS_TAXONOMY
        assert len(TECH_SKILLS_TAXONOMY[category]) > 0


def test_skills_count_and_uniqueness():
    """Verifies that the taxonomy contains a rich set (>100) of unique skills."""
    all_skills = get_all_skills_list()
    skills_set = get_skills_set()

    assert len(all_skills) >= 100
    assert len(skills_set) >= 100
    # Confirm no blank or empty strings
    assert all(len(s.strip()) > 0 for s in all_skills)


def test_skills_set_canonical_lowercasing():
    """Verifies that get_skills_set() contains normalized lowercase terms."""
    skills_set = get_skills_set()

    core_skills_to_check = [
        "python",
        "fastapi",
        "react",
        "next.js",
        "typescript",
        "docker",
        "kubernetes",
        "postgresql",
        "machine learning",
        "rest api",
        "git",
    ]

    for skill in core_skills_to_check:
        assert skill in skills_set, f"Expected skill '{skill}' to be present in lowercased skills set"


def test_all_elements_are_lowercase_in_set():
    """Verifies that every element in get_skills_set() is strictly lowercase."""
    skills_set = get_skills_set()
    for skill in skills_set:
        assert skill == skill.lower(), f"Skill '{skill}' is not lowercased"

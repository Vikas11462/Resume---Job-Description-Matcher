"""Algorithmic Matching Engine for Resume-JD Matcher.

Implements TF-IDF vectorization, Cosine Similarity, and taxonomy-based
skill extraction to identify missing keywords between resumes and job descriptions.
"""

import re
from typing import Dict, List, Set
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.clean import clean_text
from app.skills_dict import get_all_skills_list, get_skills_set


def _get_skill_display_map() -> Dict[str, str]:
    """Builds a mapping from lowercase canonical skill terms to human-readable display names."""
    return {skill.lower(): skill for skill in get_all_skills_list()}


def extract_skills_from_text(text: str) -> Set[str]:
    """Extracts all recognized technical skills present in the text.

    Supports both single-word terms (e.g. 'Docker', 'Python') and
    multi-word compound phrases (e.g. 'REST API', 'Machine Learning', 'Next.js').

    Args:
        text (str): Raw or extracted textual content.

    Returns:
        Set[str]: Set of lowercased canonical skill terms found in the text.
    """
    if not text or not isinstance(text, str):
        return set()

    lowered_text = f" {text.lower()} "
    found_skills: Set[str] = set()

    for skill in get_all_skills_list():
        skill_lower = skill.lower()
        # Use boundary check that safely handles special chars (C++, C#, .NET, Node.js)
        pattern = r"(?<![a-zA-Z0-9_])" + re.escape(skill_lower) + r"(?![a-zA-Z0-9_])"
        if re.search(pattern, lowered_text):
            found_skills.add(skill_lower)

    return found_skills


def missing_keywords(resume_text: str, jd_text: str) -> List[str]:
    """Identifies technical skills mentioned in the JD that are absent from the resume.

    Pipeline:
    1. Extracts domain skills from JD text using the curated taxonomy.
    2. Extracts domain skills from Resume text.
    3. Calculates set difference: (JD_skills - Resume_skills).
    4. Formats output list in original human-readable display casing.

    Args:
        resume_text (str): Extracted resume textual content.
        jd_text (str): Target job description text.

    Returns:
        List[str]: Alphabetically sorted list of missing skill strings in display casing.
    """
    if not jd_text or not isinstance(jd_text, str):
        return []

    jd_skills = extract_skills_from_text(jd_text)
    if not jd_skills:
        return []

    resume_skills = extract_skills_from_text(resume_text) if resume_text else set()

    missing_set = jd_skills - resume_skills
    display_map = _get_skill_display_map()

    # Map back to display casing and sort alphabetically
    formatted_missing = [display_map.get(s, s.title()) for s in missing_set]
    return sorted(formatted_missing)


def compute_score(resume_text: str, jd_text: str) -> float:
    """Calculates the match score (0.0% to 100.0%) between a resume and a JD.

    Pipeline:
    1. Preprocesses both texts via clean_text() (lemmatization, stopword removal).
    2. Constructs a 2-document corpus [cleaned_resume, cleaned_jd].
    3. Transforms documents into Term Frequency-Inverse Document Frequency (TF-IDF) feature vectors.
    4. Computes cosine angle between vectors: cos(theta) = (A . B) / (||A|| * ||B||).
    5. Converts cosine similarity [0.0, 1.0] to percentage [0.0, 100.0].

    Args:
        resume_text (str): Raw or extracted textual content of candidate resume.
        jd_text (str): Raw textual content of target job description.

    Returns:
        float: Match score rounded to 2 decimal places (0.0 to 100.0).
    """
    if not resume_text or not jd_text:
        return 0.0

    resume_tokens: List[str] = clean_text(resume_text)
    jd_tokens: List[str] = clean_text(jd_text)

    if not resume_tokens or not jd_tokens:
        return 0.0

    cleaned_resume: str = " ".join(resume_tokens)
    cleaned_jd: str = " ".join(jd_tokens)

    # Perfect identical match shortcut
    if cleaned_resume == cleaned_jd:
        return 100.0

    # Vectorize corpus using unigram term frequencies
    vectorizer = TfidfVectorizer()
    try:
        tfidf_matrix = vectorizer.fit_transform([cleaned_resume, cleaned_jd])
    except ValueError:
        return 0.0

    # Compute cosine similarity between resume vector (row 0) and JD vector (row 1)
    sim_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    raw_similarity = float(sim_matrix[0][0])

    # Clamp bounds and format as percentage
    percentage_score = round(raw_similarity * 100.0, 2)
    return max(0.0, min(100.0, percentage_score))

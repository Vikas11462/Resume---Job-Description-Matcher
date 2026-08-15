"""Algorithmic Matching Engine for Resume-JD Matcher.

Implements TF-IDF vectorization and Cosine Similarity to calculate
an explainable relevance score between candidate resumes and job descriptions.
"""

from typing import List, Set
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.clean import clean_text


def compute_score(resume_text: str, jd_text: str) -> float:
    """Calculates the match score (0.0% to 100.0%) between a resume and a JD.

    Pipeline:
    1. Preprocesses and normalizes both texts via clean_text() (lemmatization, stopword removal).
    2. Constructs a 2-document corpus [cleaned_resume, cleaned_jd].
    3. Transforms documents into Term Frequency-Inverse Document Frequency (TF-IDF) feature vectors,
       evaluating unigrams and bigrams (ngram_range=(1, 2)).
    4. Computes the cosine angle between vectors:
       cos(theta) = (A . B) / (||A|| * ||B||)
    5. Converts cosine similarity [0.0, 1.0] to an explainable percentage [0.0, 100.0].

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
        # Occurs if vocabulary contains only empty/ignored tokens
        return 0.0

    # Compute cosine similarity between resume vector (row 0) and JD vector (row 1)
    sim_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    raw_similarity = float(sim_matrix[0][0])

    # Clamp bounds and format as percentage
    percentage_score = round(raw_similarity * 100.0, 2)
    return max(0.0, min(100.0, percentage_score))

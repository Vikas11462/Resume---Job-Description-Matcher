"""Unit tests for text cleaning and lemmatization module (app.clean)."""

import pytest
from app.clean import clean_text


def test_clean_text_lemmatization():
    """Verifies that words are correctly reduced to their canonical dictionary root (lemma)."""
    input_text = "The engineer developed scalable services while collaborating with developers."
    tokens = clean_text(input_text)

    # Assert lemmatization: 'developed' -> 'develop', 'services' -> 'service', 'collaborating' -> 'collaborate', 'developers' -> 'developer'
    assert "develop" in tokens
    assert "service" in tokens
    assert "collaborate" in tokens
    assert "engineer" in tokens


def test_clean_text_removes_stopwords_and_punctuation():
    """Verifies that common English stopwords and punctuation marks are discarded."""
    input_text = "This is a great application with Python, FastAPI, and Next.js!"
    tokens = clean_text(input_text)

    # Stopwords to be omitted
    assert "this" not in tokens
    assert "is" not in tokens
    assert "a" not in tokens
    assert "with" not in tokens
    assert "and" not in tokens

    # Meaningful keywords retained
    assert "python" in tokens
    assert "fastapi" in tokens
    assert "application" in tokens


def test_clean_text_empty_and_whitespace_inputs():
    """Verifies that empty strings, whitespace, and non-string inputs safely return empty lists."""
    assert clean_text("") == []
    assert clean_text("   \n\t  ") == []
    assert clean_text(None) == []  # type: ignore


def test_clean_text_only_stopwords_and_punctuation():
    """Verifies that strings consisting solely of stopwords and punctuation return an empty list."""
    assert clean_text("that was it and this is so!") == []
    assert clean_text("... ,,, !!! ??? ;;;") == []


def test_clean_text_casing_and_number_filtering():
    """Verifies case folding and filtering of pure numeric strings."""
    input_text = "PYTHON 12345 999 Docker TYPESCRIPT"
    tokens = clean_text(input_text)

    assert "python" in tokens
    assert "docker" in tokens
    assert "typescript" in tokens
    assert "12345" not in tokens
    assert "999" not in tokens

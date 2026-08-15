"""NLP text normalization and preprocessing module for Resume-JD Matcher.

Uses spaCy (en_core_web_sm) to tokenize, filter stopwords/punctuation,
and lemmatize text into canonical root forms for matching.
"""

from functools import lru_cache
from typing import List
import spacy
from spacy.language import Language


@lru_cache(maxsize=1)
def get_spacy_nlp() -> Language:
    """Loads and caches the spaCy English NLP pipeline.

    Disables unneeded pipeline components (parser, ner) to optimize
    memory usage and processing speed during text normalization.

    Returns:
        Language: The loaded spaCy Language model.
    """
    return spacy.load("en_core_web_sm", disable=["parser", "ner"])


def clean_text(text: str) -> List[str]:
    """Normalizes raw input text into a list of lemmatized, lowercase tokens.

    Pipeline operations:
    1. Case folding (converts text to lowercase).
    2. Tokenization via spaCy.
    3. Filtering out punctuation, whitespace, pure symbols, and stopwords.
    4. Morphological lemmatization (e.g., 'developing' -> 'develop').

    Args:
        text (str): Raw string content from a resume or job description.

    Returns:
        List[str]: List of cleaned, lemmatized keyword tokens.
    """
    if not text or not isinstance(text, str):
        return []

    nlp = get_spacy_nlp()
    doc = nlp(text.lower())

    cleaned_tokens: List[str] = []
    for token in doc:
        # Filter out stopwords, punctuation, whitespace, and brackets
        if (
            token.is_stop
            or token.is_punct
            or token.is_space
            or token.is_bracket
            or token.is_quote
        ):
            continue

        lemma = token.lemma_.strip().lower()

        # Retain tokens that have substantive alphabetical or alphanumeric content
        if lemma and len(lemma) > 1 and not lemma.isnumeric():
            cleaned_tokens.append(lemma)

    return cleaned_tokens

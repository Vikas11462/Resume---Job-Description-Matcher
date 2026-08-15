# Backend Intelligence Engine (FastAPI + NLP)

This directory contains the Python backend service responsible for resume document parsing, text preprocessing, and NLP similarity scoring.

---

## 📁 Directory Layout

- `app/main.py`: FastAPI entry point and route definitions (`POST /analyze`).
- `app/extract.py`: Pure extraction logic for PDF and DOCX documents.
- `app/clean.py`: spaCy-driven text normalization and lemmatization pipeline.
- `app/match.py`: Scikit-learn TF-IDF vectorization and cosine similarity calculations.
- `app/skills_dict.py`: Curated technical ontology / skills corpus.
- `tests/`: Automated unit and integration test suite with `pytest`.

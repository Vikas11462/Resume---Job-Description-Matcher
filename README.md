# Resume–Job Description Matcher (ATS Intelligence Engine)

A production-grade, explainable NLP web application that scores resume relevance against job descriptions, identifies critical keyword gaps, and delivers actionable resume optimization recommendations.

---

## 🏗️ Architecture Blueprint

```text
resume-jd-matcher/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI application & REST routing
│   │   ├── extract.py         # Text extraction engine (PDF / DOCX)
│   │   ├── clean.py           # NLP text normalization, tokenization & lemmatization
│   │   ├── match.py           # TF-IDF vectorization, Cosine Similarity & keyword diffing
│   │   └── skills_dict.py     # Curated technical taxonomy & skill ontology
│   ├── tests/
│   │   ├── test_extract.py    # Unit tests for multi-format text extraction
│   │   ├── test_clean.py      # Unit tests for text normalization & lemmatization
│   │   └── test_match.py      # Algorithmic & similarity score verification tests
│   ├── requirements.txt       # Python dependencies
│   └── README.md              # Backend technical documentation
├── frontend/                  # Next.js (App Router) + Tailwind CSS client
├── TODO.md                    # Technical debt & shortcut ledger
└── README.md                  # Project overview & engineering handbook
```

---

## ⚙️ Core Technical Workflow

1. **Extraction (`extract.py`)**: Ingests `.pdf` (via `pdfplumber`) and `.docx` (via `python-docx`), extracting pristine textual content while handling edge cases.
2. **Normalization (`clean.py`)**: Uses `spaCy` (`en_core_web_sm`) for lowercasing, punctuation stripping, stopword elimination, and linguistic lemmatization.
3. **Taxonomy & Extraction (`skills_dict.py` + `match.py`)**: Extracts high-relevance domain entities and technical keywords across resume and job description.
4. **Scoring Engine (`match.py`)**: Computes Term Frequency-Inverse Document Frequency (TF-IDF) feature vectors and calculates **Cosine Similarity** ($\cos(\theta) = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\| \|\mathbf{B}\|}$) for explainable, deterministic scoring ($0-100\%$).
5. **Gap Analysis & Recommendations**: Performs set-theoretic difference and frequency analysis to pinpoint high-priority missing terms and actionable suggestions.
6. **API Layer (`main.py`)**: FastAPI endpoint `POST /analyze` serving typed JSON payloads with robust error handling and CORS support.
7. **Client UI (`frontend/`)**: Modern Next.js UI with real-time feedback, match score visualizers, and interactive keyword chips.

---

## 🛠️ Tech Stack

- **Backend**: Python 3.10+, FastAPI, Uvicorn
- **NLP / ML**: spaCy, scikit-learn (TF-IDF, Cosine Similarity)
- **Document Parsing**: pdfplumber, python-docx
- **Testing**: pytest
- **Frontend**: Next.js, React, Tailwind CSS
- **Deployment**: Render / Railway (Backend API), Vercel (Frontend Client)

---

## 🚀 Getting Started

*(Will be populated across subsequent phases as services are provisioned)*

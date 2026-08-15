<div align="center">

# 🎯 Resume–Job Description Matcher (ATS Intelligence Engine)

**Production-grade, explainable NLP platform that scores resume relevance against job descriptions, pinpoints exact keyword gaps, and delivers actionable resume optimization recommendations.**

[![Python](https://img.shields.io/badge/Python-3.11%2B-blue.svg?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![spaCy](https://img.shields.io/badge/spaCy-3.8%2B-09A3D5.svg?logo=spacy&logoColor=white)](https://spacy.io)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.4%2B-F7931E.svg?logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![Next.js](https://img.shields.io/badge/Next.js-16%20(App%20Router)-black.svg?logo=next.js&logoColor=white)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Pytest](https://img.shields.io/badge/Tests-34%20Passed-brightgreen.svg?logo=pytest&logoColor=white)](https://pytest.org)

</div>

---

## 📌 1. Project Overview & Motivation

When applying to software engineering internships and junior roles, over **75% of resumes are screened out by Applicant Tracking Systems (ATS)** due to missing exact keyword matches, unstandardized naming, or poor document structuring—even when candidates possess the foundational skills.

This project solves that problem with an **explainable, deterministic NLP engine**:
1. **Zero Black-Box Guesswork**: Instead of relying on unpredictable LLM hallucinations or opaque embeddings, it calculates true **TF-IDF Vector Cosine Similarity**.
2. **Linguistic Normalization**: Uses **spaCy** lemmatization so morphological variations (`developing`, `developed`, `developer`) align semantically.
3. **Ontology Gap Analysis**: Scans against a curated taxonomy of **115+ technical skills** to identify missing requirements.
4. **Actionable Suggestions**: Generates rule-based resume improvements tailored to the target job description.

---

## 🏗️ 2. System Architecture & Data Flow

```text
                                  +---------------------------------------+
                                  |         Next.js 16 Client UI          |
                                  |   (App Router + Tailwind + Lucide)    |
                                  +-------------------+-------------------+
                                                      |
                                     POST /analyze    |  multipart/form-data
                                     (PDF/DOCX/Text)  |
                                                      v
+----------------------------------------------------------------------------------------------------+
|                                    FastAPI REST Service (main.py)                                  |
+----------------------------------------------------------------------------------------------------+
       |                                              |                                   |
       v                                              v                                   v
[1. Document Extraction]                    [2. NLP Preprocessing]              [3. Domain Taxonomy]
       |                                              |                                   |
  pdfplumber (.pdf)                              spaCy Pipeline                      skills_dict.py
  python-docx (.docx)                           (en_core_web_sm)                    (115+ Tech Skills)
  - Layout & Table Parsing                      - Case Folding                      - Languages, Cloud,
  - Malformed Stream Defense                    - Stopword Elimination                Databases, DevOps,
                                                - Punctuation Stripping               AI/ML & Architecture
                                                - Morphological Lemmatization
                                                      |
                                                      v
                                        +----------------------------+
                                        |  Scoring & Diffing Engine  |
                                        |         (match.py)         |
                                        +----------------------------+
                                          /                        \
                                         /                          \
                                        v                            v
                              [TF-IDF Vectorizer]          [Set-Theoretic Diff]
                              - Term Frequency (TF)        - Skills(JD) \ Skills(Resume)
                              - Inverse Doc Freq (IDF)     - Display Casing Recovery
                              - Cosine Similarity Angle    - Contextual Recommendations
                                        \                            /
                                         \                          /
                                          v                        v
+----------------------------------------------------------------------------------------------------+
|       JSON Output: { score: 78.5%, missing_keywords: [...], suggestions: [...], stats: {...} }     |
+----------------------------------------------------------------------------------------------------+
```

---

## 🧠 3. Core Algorithmic Concepts (Interview Deep Dive)

### A. Lemmatization vs. Stemming
- **Stemming (e.g. Porter/Snowball)** uses heuristic suffix chopping, frequently producing non-words (`"univers"` for `"university"`, `"experi"` for `"experience"`).
- **Lemmatization (spaCy)** uses complete morphological dictionaries and part-of-speech context to reduce words to true dictionary root forms (`"collaborated"` $\rightarrow$ `"collaborate"`, `"microservices"` $\rightarrow$ `"microservice"`).

### B. TF-IDF & Cosine Similarity Mathematics

1. **Term Frequency ($\text{TF}$)**:
   $$\text{TF}(t, d) = \frac{f_{t, d}}{\sum_{t' \in d} f_{t', d}}$$
2. **Inverse Document Frequency ($\text{IDF}$)**:
   $$\text{IDF}(t, D) = \ln\left(\frac{1 + |D|}{1 + |\ \{d \in D : t \in d\}\ |}\right) + 1$$
3. **Cosine Similarity**:
   $$\text{Similarity}(\mathbf{A}, \mathbf{B}) = \cos(\theta) = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\| \|\mathbf{B}\|} = \frac{\sum_{i=1}^{n} A_i B_i}{\sqrt{\sum_{i=1}^{n} A_i^2} \sqrt{\sum_{i=1}^{n} B_i^2}}$$

> **Why Cosine Similarity instead of Euclidean Distance?**  
> Cosine similarity measures the **angle** between term frequency vectors rather than absolute distance. This makes the score **length-invariant**—a concise 1-page resume is evaluated on proportional keyword relevance rather than penalized for brevity.

---

## 📁 4. Clean Repository Structure

```text
resume-jd-matcher/
├── backend/
│   ├── app/
│   │   ├── __init__.py        # Package marker
│   │   ├── main.py            # FastAPI entry point, CORS & /analyze routes
│   │   ├── extract.py         # Multi-format document parser (PDF & DOCX)
│   │   ├── clean.py           # spaCy tokenization, stopword removal & lemmatization
│   │   ├── match.py           # TF-IDF vectorization, Cosine similarity & keyword diff
│   │   └── skills_dict.py     # 115+ Curated technical skills taxonomy
│   ├── tests/
│   │   ├── test_extract.py    # Tests for PDF/DOCX ingestion & corrupt file handling
│   │   ├── test_clean.py      # Tests for linguistic lemmatization & stopword stripping
│   │   ├── test_skills_dict.py# Tests for ontology coverage and normalization
│   │   ├── test_match.py      # Tests for scoring bounds, monotonicity & keyword diff
│   │   └── test_main.py       # Integration tests for FastAPI endpoints & CORS
│   ├── Dockerfile             # Multi-stage production container
│   ├── Procfile               # Cloud process command
│   ├── pytest.ini             # Test runner configuration
│   ├── requirements.txt       # Version-locked Python dependencies
│   └── README.md              # Backend technical documentation
├── frontend/
│   ├── app/
│   │   ├── layout.tsx         # Root HTML & typography layout
│   │   ├── page.tsx           # Main Next.js landing page & state orchestrator
│   │   └── globals.css        # Tailwind CSS stylesheet
│   ├── components/
│   │   ├── Header.tsx         # Navigation header & live system badges
│   │   ├── ResumeInputPanel.tsx # Drag-and-drop file upload & paste editor
│   │   ├── JobDescriptionPanel.tsx # JD input editor with sample loader
│   │   └── MatchResultView.tsx# Radial score gauge, keyword chips & suggestions
│   ├── package.json           # Next.js & UI dependencies
│   ├── vercel.json            # Vercel deployment configuration
│   └── .env.example           # Frontend environment template
├── render.yaml                # Infrastructure-as-Code for Render deployment
├── TODO.md                    # Technical debt & shortcut audit ledger
└── README.md                  # Master project documentation
```

---

## 🚀 5. Local Setup & Quickstart Guide

### Prerequisites
- **Python 3.10+** (Tested on Python 3.11 & 3.14)
- **Node.js 18+** & npm

### Step 1: Clone the Repository
```powershell
git clone <your-repo-url>
cd resume-jd-matcher
```

### Step 2: Set Up Backend
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

### Step 3: Run the Automated Test Suite (34 Tests)
```powershell
pytest
```
*Expected output: `34 passed in ~8s`*

### Step 4: Start the Backend Server
```powershell
uvicorn app.main:app --reload --port 8000
```
*Backend API will be live at `http://localhost:8000` (Interactive Swagger Docs at `http://localhost:8000/docs`).*

### Step 5: Start the Frontend Client
In a new terminal window:
```powershell
cd frontend
npm install
npm run dev
```
*Open `http://localhost:3000` in your browser.*

---

## 📡 6. API Reference (`POST /analyze`)

### Request Parameters (`multipart/form-data`)

| Parameter | Type | Required? | Description |
|:---|:---|:---|:---|
| `resume_file` | Binary File | Optional* | PDF (`.pdf`) or Word (`.docx`) document (Max 10MB) |
| `resume_text` | String | Optional* | Plain text resume content (*One of file or text is required*) |
| `jd_text` | String | **Required** | Target Job Description text |

### Example cURL Request
```powershell
curl -X POST "http://localhost:8000/analyze" `
  -F "resume_text=Vikas | B.Tech CSE. Skills: Python, FastAPI, React, PostgreSQL, Git." `
  -F "jd_text=Seeking Backend Engineer with Python, FastAPI, Docker, Kubernetes, AWS, and PostgreSQL."
```

### Example JSON Response
```json
{
  "score": 48.72,
  "missing_keywords": [
    "AWS",
    "Docker",
    "Kubernetes"
  ],
  "suggestions": [
    "Incorporate missing core technologies: AWS, Docker, Kubernetes into your skills section or project descriptions.",
    "Good foundational match. Strengthen relevance by highlighting hands-on project experience with the role's primary stack."
  ],
  "extracted_skills_count": 5,
  "jd_skills_count": 6
}
```

---

## 💼 7. Project Bullet Points for Vikas's Resume / CV

```markdown
**Resume–Job Description Matcher (Full Stack NLP Platform)** | *Python, FastAPI, spaCy, Scikit-learn, Next.js, Tailwind CSS, Docker*
- Engineered an ATS intelligence platform analyzing resume-to-job relevance using TF-IDF vector space modeling and Cosine Similarity.
- Built a multi-format document parser supporting PDF and DOCX file ingestion with robust stream validation and table cell extraction.
- Developed an NLP preprocessing pipeline with spaCy for stopword elimination, tokenization, and morphological lemmatization.
- Designed set-theoretic gap analysis over a 115+ skill domain taxonomy, outputting missing keyword badges and contextual suggestions.
- Authored a comprehensive automated test suite of 34 unit and integration tests with pytest, achieving 100% test pass rate.
```

---

## 📄 License & Attribution
Designed & developed by **Vikas** (B.Tech CSE, Jaypee University) under production-grade software engineering standards.

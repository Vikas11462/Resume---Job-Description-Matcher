"""Curated Technical Skills & Keywords Taxonomy for Resume-JD Matcher.

Provides a structured, high-coverage domain taxonomy across software engineering,
cloud architecture, data science, and web development for ATS keyword extraction.
"""

from typing import Dict, List, Set

# Comprehensive categorised taxonomy of technical domains and skills
TECH_SKILLS_TAXONOMY: Dict[str, List[str]] = {
    "Programming Languages": [
        "Python",
        "JavaScript",
        "TypeScript",
        "Java",
        "C++",
        "C#",
        "C",
        "Go",
        "Golang",
        "Rust",
        "Ruby",
        "PHP",
        "Kotlin",
        "Swift",
        "Scala",
        "R",
        "Dart",
        "SQL",
        "HTML",
        "HTML5",
        "CSS",
        "CSS3",
        "Bash",
        "Shell",
        "PowerShell",
    ],
    "Frontend Frameworks & Libraries": [
        "React",
        "React.js",
        "Next.js",
        "Vue.js",
        "Vue",
        "Angular",
        "Svelte",
        "Redux",
        "Tailwind CSS",
        "TailwindCSS",
        "Bootstrap",
        "Material UI",
        "Chakra UI",
        "Zustand",
        "Sass",
        "SCSS",
        "Webpack",
        "Vite",
    ],
    "Backend Frameworks & Runtimes": [
        "FastAPI",
        "Flask",
        "Django",
        "Node.js",
        "Nodejs",
        "Express.js",
        "Express",
        "NestJS",
        "Spring Boot",
        "Spring",
        "ASP.NET",
        "Ruby on Rails",
        "Laravel",
        "Fastify",
        "Gin",
        "Koa",
    ],
    "Databases & Caching": [
        "PostgreSQL",
        "Postgres",
        "MySQL",
        "MongoDB",
        "Redis",
        "SQLite",
        "DynamoDB",
        "Cassandra",
        "Elasticsearch",
        "Neo4j",
        "Oracle",
        "Microsoft SQL Server",
        "Supabase",
        "Firebase",
        "Firestore",
        "Prisma",
        "SQLAlchemy",
        "Mongoose",
    ],
    "Cloud & DevOps": [
        "Docker",
        "Kubernetes",
        "AWS",
        "Amazon Web Services",
        "GCP",
        "Google Cloud",
        "Azure",
        "Terraform",
        "Ansible",
        "Jenkins",
        "GitHub Actions",
        "GitLab CI",
        "CI/CD",
        "Nginx",
        "Linux",
        "Vercel",
        "Render",
        "Railway",
        "Serverless",
        "Helm",
        "Prometheus",
        "Grafana",
    ],
    "Machine Learning, NLP & Data": [
        "Machine Learning",
        "Deep Learning",
        "NLP",
        "Natural Language Processing",
        "Computer Vision",
        "TensorFlow",
        "PyTorch",
        "Scikit-learn",
        "Keras",
        "spaCy",
        "NLTK",
        "Hugging Face",
        "Pandas",
        "NumPy",
        "SciPy",
        "Matplotlib",
        "Seaborn",
        "LangChain",
        "LlamaIndex",
        "OpenAI",
        "Transformers",
        "TF-IDF",
        "Cosine Similarity",
    ],
    "Architecture, Security & Methodologies": [
        "REST API",
        "RESTful API",
        "GraphQL",
        "gRPC",
        "Microservices",
        "WebSockets",
        "System Design",
        "Object-Oriented Programming",
        "OOP",
        "Data Structures",
        "Algorithms",
        "Design Patterns",
        "Agile",
        "Scrum",
        "Git",
        "GitHub",
        "GitLab",
        "Unit Testing",
        "Integration Testing",
        "Test-Driven Development",
        "TDD",
        "OAuth",
        "JWT",
        "Authentication",
        "Authorization",
    ],
}


def get_all_skills_list() -> List[str]:
    """Returns a flat list of all skill strings in original display format.

    Returns:
        List[str]: Uniquely sorted list of all taxonomy skill names.
    """
    skills: Set[str] = set()
    for category_skills in TECH_SKILLS_TAXONOMY.values():
        skills.update(category_skills)
    return sorted(list(skills))


def get_skills_set() -> Set[str]:
    """Returns a set of lowercased canonical skill strings for fast O(1) matching.

    Returns:
        Set[str]: Lowercased normalized skill terms.
    """
    return {skill.lower() for skill in get_all_skills_list()}

"use client";

import React from "react";
import { Briefcase, Sparkles, Trash2 } from "lucide-react";

interface JobDescriptionPanelProps {
  text: string;
  setText: (text: string) => void;
  disabled?: boolean;
}

export function JobDescriptionPanel({
  text,
  setText,
  disabled = false,
}: JobDescriptionPanelProps) {
  const loadSampleBackendJD = () => {
    setText(
      `Job Title: Full Stack / Backend Software Engineer (Intern / New Grad)
Location: Remote / Hybrid
Company: Tech Innovations

ABOUT THE ROLE:
We are seeking an ambitious Software Engineer to join our core backend and platform engineering team. You will build high-throughput microservices, optimize data pipelines, and design clean RESTful APIs.

KEY RESPONSIBILITIES:
- Architect and maintain backend APIs using Python (FastAPI / Django) and TypeScript (Node.js).
- Design and optimize relational databases (PostgreSQL) and caching layers with Redis.
- Collaborate with frontend engineers developing user interfaces in React and Next.js.
- Containerize services with Docker and deploy resilient microservices on AWS and Kubernetes.
- Implement CI/CD pipelines via GitHub Actions and ensure rigorous unit testing (pytest / Jest).

REQUIRED QUALIFICATIONS:
- Strong foundations in Python, TypeScript, or JavaScript.
- Experience with FastAPI, React, Next.js, and REST API architectural patterns.
- Working knowledge of PostgreSQL, Redis, and database schema design.
- Hands-on experience with Docker, Kubernetes, AWS, and Git version control.
- Familiarity with NLP techniques, Scikit-learn, or machine learning pipelines is a strong plus.`
    );
  };

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col h-full backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-violet-400" />
          </div>
          <h2 className="font-semibold text-zinc-100 text-base">
            2. Job Description (JD)
          </h2>
        </div>

        <button
          type="button"
          onClick={loadSampleBackendJD}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 text-xs font-medium transition"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Load Sample JD
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          placeholder="Paste the target Job Description here... (Role responsibilities, required skills, tools, and tech stack qualifications)"
          className="w-full flex-1 min-h-[260px] bg-zinc-950/60 border border-zinc-800 rounded-xl p-3.5 text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition resize-none font-mono"
        />

        <div className="flex items-center justify-between mt-2 text-xs text-zinc-500">
          <span>
            {text.trim() ? text.trim().split(/\s+/).length : 0} words •{" "}
            {text.length} characters
          </span>
          {text && (
            <button
              type="button"
              onClick={() => setText("")}
              className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear JD
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

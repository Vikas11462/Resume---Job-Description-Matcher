"use client";

import React, { useRef, useState } from "react";
import {
  Upload,
  FileText,
  Trash2,
  FileCheck,
  AlignLeft,
  FileUp,
  AlertCircle,
} from "lucide-react";

interface ResumeInputPanelProps {
  mode: "upload" | "paste";
  setMode: (mode: "upload" | "paste") => void;
  file: File | null;
  setFile: (file: File | null) => void;
  text: string;
  setText: (text: string) => void;
  disabled?: boolean;
}

export function ResumeInputPanel({
  mode,
  setMode,
  file,
  setFile,
  text,
  setText,
  disabled = false,
}: ResumeInputPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndSetFile = (selectedFile: File) => {
    setErrorMessage(null);
    const validExtensions = [".pdf", ".docx"];
    const fileExt = selectedFile.name
      .substring(selectedFile.name.lastIndexOf("."))
      .toLowerCase();

    if (!validExtensions.includes(fileExt)) {
      setErrorMessage("Please upload a valid .pdf or .docx document.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage("File exceeds 10MB limit.");
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const loadSampleResume = () => {
    setText(
      `Vikas | B.Tech Computer Science & Engineering
Jaypee University | Software Development Engineer

TECHNICAL SKILLS:
- Languages: Python, TypeScript, JavaScript, SQL, C++, HTML5, CSS3
- Frameworks & Backend: FastAPI, React, Next.js, Node.js, Express, Tailwind CSS
- Databases & Stores: PostgreSQL, MongoDB, Redis, Supabase, SQLAlchemy
- Cloud & DevOps: Docker, Kubernetes, Git, GitHub Actions, Linux, CI/CD
- Machine Learning & NLP: spaCy, Scikit-learn, TF-IDF, Pandas, NumPy

PROJECT EXPERIENCE:
1. Resume-JD Matcher ATS Intelligence Platform
- Built end-to-end ATS matching platform computing TF-IDF cosine similarity scores.
- Implemented spaCy-driven lemmatization and taxonomy gap analysis across 150+ tech skills.
- Developed asynchronous REST APIs with FastAPI and responsive Next.js frontend.

2. Distributed Cloud Task Queue
- Designed scalable task workers using Redis and PostgreSQL with Docker containerization.`
    );
  };

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col h-full backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <FileText className="h-4 w-4 text-indigo-400" />
          </div>
          <h2 className="font-semibold text-zinc-100 text-base">
            1. Candidate Resume
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              mode === "upload"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode("paste")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              mode === "paste"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Paste Text
          </button>
        </div>
      </div>

      {mode === "upload" ? (
        <div className="flex-1 flex flex-col justify-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled}
          />

          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 min-h-[260px] ${
                isDragging
                  ? "border-indigo-500 bg-indigo-500/10 scale-[0.99]"
                  : "border-zinc-700/80 hover:border-indigo-500/50 hover:bg-zinc-800/40 bg-zinc-950/40"
              }`}
            >
              <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-indigo-400 shadow-inner">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200">
                  Click to browse or drag & drop your resume
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Supports PDF (.pdf) and Microsoft Word (.docx) up to 10MB
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-medium px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                <FileUp className="h-3.5 w-3.5" /> Select Resume Document
              </span>
            </div>
          ) : (
            <div className="border border-indigo-500/30 bg-indigo-950/20 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                    <FileCheck className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-100 truncate max-w-[220px] sm:max-w-xs">
                      {file.name}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {formatFileSize(file.size)} • Ready for NLP analysis
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 transition"
                  title="Remove file"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
                <span>File attached successfully</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-indigo-400 hover:underline font-medium"
                >
                  Change File
                </button>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400">
              Paste your resume content or plain text summary
            </span>
            <button
              type="button"
              onClick={loadSampleResume}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Load Sample Resume
            </button>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={disabled}
            placeholder="Paste raw resume text here... (Experience, Projects, Education, and Skills)"
            className="w-full flex-1 min-h-[220px] bg-zinc-950/60 border border-zinc-800 rounded-xl p-3.5 text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition resize-none font-mono"
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
                className="text-zinc-500 hover:text-zinc-300 transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

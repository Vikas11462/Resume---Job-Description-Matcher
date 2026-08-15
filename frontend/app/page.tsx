"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { ResumeInputPanel } from "@/components/ResumeInputPanel";
import { JobDescriptionPanel } from "@/components/JobDescriptionPanel";
import { MatchResultView, AnalysisData } from "@/components/MatchResultView";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  Loader2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

export default function Home() {
  const [resumeMode, setResumeMode] = useState<"upload" | "paste">("upload");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const [jdText, setJdText] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);

  const canAnalyze =
    (resumeMode === "upload" ? resumeFile !== null : resumeText.trim().length > 0) &&
    jdText.trim().length > 0 &&
    !isLoading;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;

    setIsLoading(true);
    setErrorMessage(null);

    let backendUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "";

    // If running in production on Vercel and no backend URL is set
    if (!backendUrl && typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      setErrorMessage(
        "Backend API URL is not configured on Vercel. Please go to Vercel Project Settings -> Environment Variables, add NEXT_PUBLIC_API_URL with your live Render backend URL (e.g. https://your-backend.onrender.com), and click Redeploy."
      );
      setIsLoading(false);
      return;
    }

    // Default to localhost for local development and strip trailing slashes
    backendUrl = (backendUrl || "http://localhost:8000").replace(/\/+$/, "");

    const formData = new FormData();
    if (resumeMode === "upload" && resumeFile) {
      formData.append("resume_file", resumeFile);
    } else {
      formData.append("resume_text", resumeText);
    }
    formData.append("jd_text", jdText);

    try {
      const response = await fetch(`${backendUrl}/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Analysis request failed.");
      }

      setAnalysisResult(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Unable to connect to the analysis engine.";

      if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
        setErrorMessage(
          `Cannot reach the backend API at ${backendUrl}. Please ensure your FastAPI server is running (e.g. .\\venv\\Scripts\\uvicorn app.main:app --port 8000).`
        );
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
        {/* If result is ready, display Result View */}
        {analysisResult ? (
          <MatchResultView result={analysisResult} onReset={handleReset} />
        ) : (
          <>
            {/* Hero Section */}
            <section className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span>ATS Resume–JD Relevance & Gap Analyzer</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Optimize Your Resume for{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                  Target Tech Roles
                </span>
              </h1>

              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Extract clean text, compute explainable TF-IDF Cosine Similarity, and
                uncover exact missing keywords from our curated taxonomy before applying.
              </p>

              {/* Quick Feature Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-start gap-2.5">
                  <Zap className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-zinc-200">Fast Ingestion</p>
                    <p className="text-[11px] text-zinc-400">PDF & DOCX parsing via pdfplumber</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-start gap-2.5">
                  <Cpu className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-zinc-200">spaCy Lemmatization</p>
                    <p className="text-[11px] text-zinc-400">Morphological normalization</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-zinc-200">Explainable Scores</p>
                    <p className="text-[11px] text-zinc-400">TF-IDF Vector Space Similarity</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Error Banner if any */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-xs sm:text-sm text-red-300">
                <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-red-200">Analysis Error</p>
                  <p className="mt-0.5 text-xs text-red-300/90">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* 2-Panel Input Layout */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <ResumeInputPanel
                mode={resumeMode}
                setMode={setResumeMode}
                file={resumeFile}
                setFile={setResumeFile}
                text={resumeText}
                setText={setResumeText}
                disabled={isLoading}
              />

              <JobDescriptionPanel
                text={jdText}
                setText={setJdText}
                disabled={isLoading}
              />
            </section>

            {/* Action Bar */}
            <section className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="text-xs text-zinc-400 text-center sm:text-left">
                {isLoading ? (
                  <span className="text-indigo-400 font-medium flex items-center gap-2 justify-center sm:justify-start">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Extracting tokens, computing TF-IDF vectors & analyzing taxonomy...
                  </span>
                ) : canAnalyze ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1.5 justify-center sm:justify-start">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Both documents ready for NLP analysis
                  </span>
                ) : (
                  <span>
                    Please provide both a Resume (file or text) and a Job Description
                    to proceed.
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!canAnalyze || isLoading}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${canAnalyze && !isLoading
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/25 cursor-pointer active:scale-[0.98]"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50"
                  }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing Documents...</span>
                  </>
                ) : (
                  <>
                    <span>Run ATS Match Analysis</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </section>
          </>
        )}
      </main>

      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 mt-auto text-center text-xs text-zinc-500">
        <p>
          Resume–JD Matcher • Built for Vikas | B.Tech CSE • Stack: FastAPI, spaCy,
          Scikit-learn, Next.js & Tailwind CSS
        </p>
      </footer>
    </div>
  );
}

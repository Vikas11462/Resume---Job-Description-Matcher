"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Tag,
} from "lucide-react";

export interface AnalysisData {
  score: number;
  missing_keywords: string[];
  suggestions: string[];
  extracted_skills_count: number;
  jd_skills_count: number;
}

interface MatchResultViewProps {
  result: AnalysisData;
  onReset: () => void;
}

export function MatchResultView({ result, onReset }: MatchResultViewProps) {
  const [copied, setCopied] = useState(false);
  const [copiedSkill, setCopiedSkill] = useState<string | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 75) {
      return {
        text: "text-emerald-400",
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/10",
        ring: "stroke-emerald-500",
        badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        label: "Excellent Match",
      };
    }
    if (score >= 50) {
      return {
        text: "text-indigo-400",
        border: "border-indigo-500/30",
        bg: "bg-indigo-500/10",
        ring: "stroke-indigo-500",
        badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
        label: "Moderate Match",
      };
    }
    return {
      text: "text-amber-400",
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
      ring: "stroke-amber-500",
      badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      label: "Needs Optimization",
    };
  };

  const colors = getScoreColor(result.score);
  const circumference = 2 * Math.PI * 46;
  const strokeDashoffset =
    circumference - (Math.min(100, Math.max(0, result.score)) / 100) * circumference;

  const copyFullReport = () => {
    const report = `=== RESUME–JD MATCH REPORT ===
Match Score: ${result.score}% (${colors.label})
Resume Skills Detected: ${result.extracted_skills_count}
JD Skills Demanded: ${result.jd_skills_count}

MISSING KEYWORDS (${result.missing_keywords.length}):
${result.missing_keywords.map((k) => `- ${k}`).join("\n")}

RECOMMENDATIONS:
${result.suggestions.map((s, idx) => `${idx + 1}. ${s}`).join("\n")}
`;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const copySingleSkill = (skill: string) => {
    navigator.clipboard.writeText(skill);
    setCopiedSkill(skill);
    setTimeout(() => setCopiedSkill(null), 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Header Card with Radial Score */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {/* Radial Gauge */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="46"
                  className="stroke-zinc-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="46"
                  className={`${colors.ring} transition-all duration-1000 ease-out`}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-3xl font-extrabold tracking-tight ${colors.text}`}>
                  {result.score}%
                </span>
                <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
                  Similarity
                </span>
              </div>
            </div>

            {/* Score Context */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: "inherit" }}>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors.badge}`}>
                  {colors.label}
                </span>
                <span className="text-zinc-400 text-xs">
                  TF-IDF Vector Space Analysis
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                ATS Document Relevance Analysis
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-xl">
                Calculated by measuring vector cosine similarity between lemmatized resume tokens and target job description requirements.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex sm:flex-col gap-2.5 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={copyFullReport}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold transition shadow-sm active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Report Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-zinc-400" />
                  <span>Copy Report</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onReset}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Analyze Another</span>
            </button>
          </div>
        </div>

        {/* Skill Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-zinc-800/80">
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-400" />
              <span className="text-xs text-zinc-400 font-medium">Resume Skills</span>
            </div>
            <span className="text-sm font-bold text-zinc-200">
              {result.extracted_skills_count} detected
            </span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-violet-400" />
              <span className="text-xs text-zinc-400 font-medium">JD Skill Demand</span>
            </div>
            <span className="text-sm font-bold text-zinc-200">
              {result.jd_skills_count} required
            </span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-amber-400" />
              <span className="text-xs text-zinc-400 font-medium">Missing Gaps</span>
            </div>
            <span className="text-sm font-bold text-amber-400">
              {result.missing_keywords.length} skills
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Breakdown: Missing Keywords vs Actionable Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missing Keywords Section */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100 text-base">
                  Missing Keywords & Skills
                </h3>
                <p className="text-xs text-zinc-400">
                  Required in the JD but absent from your resume
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
              {result.missing_keywords.length} Missing
            </span>
          </div>

          {result.missing_keywords.length > 0 ? (
            <div className="flex-1">
              <div className="flex flex-wrap gap-2">
                {result.missing_keywords.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => copySingleSkill(skill)}
                    title="Click to copy keyword"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/40 text-xs font-medium text-zinc-300 hover:text-amber-300 transition shadow-sm group"
                  >
                    <span>{skill}</span>
                    {copiedSkill === skill ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3 text-zinc-600 group-hover:text-amber-400 transition" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-zinc-500 mt-4 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-zinc-500" />
                Click any chip to copy keyword directly to clipboard.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-zinc-950/40 rounded-xl border border-zinc-800/60">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mb-2" />
              <p className="text-sm font-semibold text-zinc-200">
                Zero Skill Gaps Detected!
              </p>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                Your resume includes all recognized technical skills listed in the target job description.
              </p>
            </div>
          )}
        </div>

        {/* Actionable Suggestions Section */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Lightbulb className="h-4 w-4 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100 text-base">
                  Optimization Recommendations
                </h3>
                <p className="text-xs text-zinc-400">
                  Targeted actions to increase your interview callbacks
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {result.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-3 text-xs sm:text-sm text-zinc-300 leading-relaxed"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-[10px] font-bold text-indigo-400 border border-indigo-500/20 mt-0.5">
                  {index + 1}
                </span>
                <p>{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

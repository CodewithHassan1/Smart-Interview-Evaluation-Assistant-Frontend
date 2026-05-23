import { useEffect, useState } from "react";
import { createEvaluation, deleteEvaluation, fetchEvaluations, updateEvaluation } from "../api";
import { useTheme } from "../context/ThemeContext";
import EvaluationForm from "./EvaluationForm";
import ReportCard from "./ReportCard";

export default function Dashboard({ authToken, user, onLogout }) {
  const { isDark, toggleTheme } = useTheme();
  const [evaluations, setEvaluations] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setStatusMessage("");

    fetchEvaluations(authToken)
      .then((data) => {
        if (cancelled) return;
        const records = Array.isArray(data) ? data : data?.results ?? [];
        setEvaluations(records);
        setActiveReport(records[0] || null);
      })
      .catch(() => {
        if (!cancelled) {
          setStatusMessage("Unable to load evaluations. Please refresh.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [authToken]);

  async function handleDelete(id) {
    setStatusMessage("Deleting evaluation...");
    try {
      await deleteEvaluation(authToken, id);
      setEvaluations((current) => {
        const remaining = current.filter((e) => e.id !== id);
        setActiveReport((prev) => {
          if (!prev || prev.id !== id) return prev;
          return remaining[0] || null;
        });
        return remaining;
      });
      setStatusMessage("Evaluation deleted.");
    } catch {
      setStatusMessage("Unable to delete evaluation.");
    }
  }

  async function handleVerdictChange(id, final_verdict) {
    setStatusMessage("Updating hiring verdict...");
    try {
      const updated = await updateEvaluation(authToken, id, { final_verdict });
      setEvaluations((current) => current.map((e) => (e.id === id ? updated : e)));
      setActiveReport((prev) => (prev?.id === id ? updated : prev));
      setStatusMessage("Verdict updated successfully.");
    } catch {
      setStatusMessage("Unable to update verdict.");
    }
  }

  async function handleSubmit(payload) {
    setStatusMessage("Generating a polished evaluation report...");
    try {
      const evaluation = await createEvaluation(authToken, payload);
      setEvaluations((current) => [evaluation, ...current]);
      setActiveReport(evaluation);
      setStatusMessage("Report created successfully.");
    } catch (error) {
      let errorMsg = "Unable to create evaluation right now.";
      if (error.response?.data) {
        if (error.response.data.detail) {
          errorMsg = error.response.data.detail;
        } else if (error.response.data.raw_notes) {
          errorMsg = Array.isArray(error.response.data.raw_notes) 
            ? error.response.data.raw_notes[0] 
            : error.response.data.raw_notes;
        } else if (error.response.data.candidate_name) {
          errorMsg = Array.isArray(error.response.data.candidate_name)
            ? error.response.data.candidate_name[0]
            : error.response.data.candidate_name;
        }
      }
      setStatusMessage(errorMsg);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-10 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white py-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Interview Evaluation</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-50">Smart recruitment reports</h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">Transform messy notes into consistent candidate reports with AI support.</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="rounded-full bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 1.78a1 1 0 00-1.41 1.41l1.41 1.41a1 1 0 001.41-1.41L14.22 3.78zm2.828 2.828a1 1 0 00-1.414 0l-1.414 1.414a1 1 0 001.414 1.414l1.414-1.414zm2.828 2.829a1 1 0 000 1.414l-1.414 1.414a1 1 0 11-1.414-1.414l1.414-1.414zM16 10a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zm1.78 4.22a1 1 0 00-1.41-1.41l-1.41 1.41a1 1 0 001.41 1.41l1.41-1.41zm-2.828 2.828a1 1 0 00-1.414 0l-1.414-1.414a1 1 0 011.414-1.414l1.414 1.414zM14 14a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 001 1h4a1 1 0 001-1v-2zm-4-5a3 3 0 110-6 3 3 0 010 6z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">Signed in as</p>
              <p className="font-semibold text-slate-900 dark:text-slate-50">{user?.username || "HR Lead"}</p>
            </div>
            <button
              onClick={onLogout}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6">
            <EvaluationForm onSubmit={handleSubmit} />
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Latest evaluations</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Select any record to review the AI report.</p>
                </div>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">{evaluations.length} records</span>
              </div>

              {loading ? (
                <p className="text-slate-600 dark:text-slate-400">Loading records...</p>
              ) : evaluations.length === 0 ? (
                <p className="text-slate-600 dark:text-slate-400">No evaluations yet. Submit a new report to begin.</p>
              ) : (
                <div className="space-y-3">
                  {evaluations.map((item) => (
                    <div
                      key={item.id}
                      className={`flex w-full items-center gap-2 rounded-3xl border transition ${
                        activeReport?.id === item.id
                          ? "border-brand-400 bg-brand-50 dark:border-brand-400 dark:bg-brand-900/20"
                          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveReport(item)}
                        className="flex-1 px-4 py-4 text-left"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-50">{item.candidate_name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{item.position}</p>
                          </div>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                            {item.final_verdict}
                          </span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!confirm(`Delete evaluation for ${item.candidate_name}?`)) return;
                          handleDelete(item.id);
                        }}
                        className="mr-3 rounded-xl border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40"
                        title="Delete evaluation"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="space-y-6">
            {activeReport ? (
              <ReportCard
                evaluation={activeReport}
                onVerdictChange={handleVerdictChange}
                onDelete={handleDelete}
              />
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Ready for your first report</h2>
                <p className="mt-2">Submit a candidate evaluation and see the structured AI output instantly.</p>
              </div>
            )}
            {statusMessage ? (
              <p className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">{statusMessage}</p>
            ) : null}
          </section>
        </div>
      </main>
    </div>
  );
}

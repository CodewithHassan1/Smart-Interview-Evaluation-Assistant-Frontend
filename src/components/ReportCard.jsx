import { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Scorecard from "./Scorecard";

const VERDICT_OPTIONS = ["Strong Hire", "Hire", "No Hire"];

export default function ReportCard({ evaluation, onDelete, onVerdictChange }) {
  const [verdict, setVerdict] = useState(evaluation.final_verdict);
  const [savingVerdict, setSavingVerdict] = useState(false);

  useEffect(() => {
    setVerdict(evaluation.final_verdict);
  }, [evaluation.id, evaluation.final_verdict]);

  async function handleVerdictSave() {
    if (!onVerdictChange || verdict === evaluation.final_verdict) return;
    setSavingVerdict(true);
    try {
      await onVerdictChange(evaluation.id, verdict);
    } finally {
      setSavingVerdict(false);
    }
  }
  async function exportPdf() {
    const element = document.getElementById("report-preview");
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2 });
    const image = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(image, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${evaluation.candidate_name.replace(/\s+/g, "_")}_evaluation.pdf`);
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Professional report</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">{evaluation.candidate_name}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{evaluation.position}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportPdf} className="rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-500 dark:hover:bg-brand-600">
            Export PDF
          </button>
          {onDelete && (
            <button
              onClick={async () => {
                if (!confirm('Delete this evaluation? This action cannot be undone.')) return;
                await onDelete(evaluation.id);
              }}
              className="rounded-2xl border border-red-500 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:bg-slate-800 dark:text-red-400"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div id="report-preview" className="mt-6 space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
        <section className="space-y-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1">
              <p className="text-sm text-slate-500 dark:text-slate-400">Final Recommendation</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Override the AI verdict when every report defaults to No Hire.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <select
                  value={verdict}
                  onChange={(event) => setVerdict(event.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-50"
                >
                  {VERDICT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {onVerdictChange && verdict !== evaluation.final_verdict && (
                  <button
                    type="button"
                    onClick={handleVerdictSave}
                    disabled={savingVerdict}
                    className="rounded-2xl bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:opacity-60 dark:hover:bg-brand-600"
                  >
                    {savingVerdict ? "Saving..." : "Save verdict"}
                  </button>
                )}
              </div>
            </div>
            <div className="rounded-3xl bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-300">
              {new Date(evaluation.created_at).toLocaleDateString()}
            </div>
          </div>
          <div className="rounded-3xl bg-white p-4 text-sm leading-7 text-slate-700 shadow-sm dark:bg-slate-700 dark:text-slate-300">
            {evaluation.structured_report.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-3 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <Scorecard evaluation={evaluation} />

        <section className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Skills summary</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Technical skills</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(evaluation.skills_summary?.technical_skills || []).map((skill) => (
                  <span key={skill} className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Soft skills</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(evaluation.skills_summary?.soft_skills || []).map((skill) => (
                  <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-600 dark:text-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

import { useState } from "react";
import Dropdown from "./Dropdown";

const positions = ["Backend Intern", "Frontend Developer", "Full Stack Developer", "QA Engineer", "Product Designer"];

export default function EvaluationForm({ onSubmit }) {
  const [candidateName, setCandidateName] = useState("");
  const [position, setPosition] = useState(positions[0]);
  const [rawNotes, setRawNotes] = useState("");

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Candidate evaluation</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-50">Convert messy notes into a professional report</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Paste interview notes and let the assistant create a consistent, recruiter-ready summary.</p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit({ candidate_name: candidateName, position, raw_notes: rawNotes });
        }}
        className="space-y-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Candidate name</span>
            <input
              className="mt-2 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={candidateName}
              onChange={(event) => setCandidateName(event.target.value)}
              required
            />
          </label>

          <div className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Position</span>
            <Dropdown
              value={position}
              onChange={setPosition}
              options={positions}
              className="mt-2 w-full"
            />
          </div>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Raw interview notes</span>
          <textarea
            className="mt-2 min-h-[220px] w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={rawNotes}
            onChange={(event) => setRawNotes(event.target.value)}
            placeholder="Type or paste messy bullet points from the interview here..."
            required
          />
        </label>

        <button className="w-full rounded-2xl bg-brand-700 px-5 py-3 text-base font-semibold text-white transition hover:bg-brand-500 dark:hover:bg-brand-600">
          Generate structured report
        </button>
      </form>
    </div>
  );
}

export default function Scorecard({ evaluation }) {
  const scores = evaluation.score_breakdown || {};
  const scoreItems = [
    { label: "Communication", value: scores.communication ?? 0 },
    { label: "Technical", value: scores.technical ?? 0 },
    { label: "Problem solving", value: scores.problem_solving ?? 0 },
  ];

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-800">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Technical scorecard</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">A consistent performance snapshot for every candidate.</p>
        </div>
      </div>
      <div className="space-y-4">
        {scoreItems.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
              <span>{item.label}</span>
              <span>{item.value}/10</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <div style={{ width: `${item.value * 10}%` }} className="h-full rounded-full bg-brand-600 transition-all duration-300" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

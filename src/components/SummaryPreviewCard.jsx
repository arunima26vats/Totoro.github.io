import { Link } from 'react-router-dom';

export default function SummaryPreviewCard() {
  return (
    <section className="section-card">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-coral-500">
            AI Summary Preview
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">Preview quick revision support</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Generate short study recaps for any topic when you want a fast review pass before an
            exam, quiz, or assignment session.
          </p>
          <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Example
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              This is a generated summary for Binary Search Trees. Review the core definition, tree
              traversal behavior, insertion and deletion rules, and the most common balancing
              pitfalls.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:min-w-60">
          <Link to="/summary" className="btn-primary">
            Open Summary Tool
          </Link>
          <p className="text-sm leading-6 text-slate-600">
            Use the full summary page for custom topics and generated revision notes.
          </p>
        </div>
      </div>
    </section>
  );
}

import AppShell from '../components/AppShell';
import FirebaseNotice from '../components/FirebaseNotice';
import SummaryGenerator from '../components/SummaryGenerator';

export default function SummaryPage() {
  return (
    <AppShell
      title="Summary Generator"
      subtitle="Generate quick AI-style study summaries for any topic so revision feels more focused and less scattered."
    >
      <div className="page-stack">
        <FirebaseNotice />
        <section className="grid gap-6 xl:grid-cols-[0.32fr_0.68fr] xl:items-start">
          <div className="xl:order-2">
            <SummaryGenerator />
          </div>

          <div className="section-card xl:order-1">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent-700">
              How to use it
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">
              Generate concise revision notes
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Type in a topic, concept, or chapter name and generate a short study recap. This
              mock AI flow is useful for pre-exam revision, note cleanup, and quick concept
              refreshers.
            </p>
            <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">
              Use specific topics for the best result, such as "Binary Search Trees",
              "Photosynthesis steps", or "French Revolution causes".
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

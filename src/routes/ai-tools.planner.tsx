import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import { site } from "@/lib/site";

export const Route = createFileRoute("/ai-tools/planner")({
  head: () => ({
    meta: [
      { title: `AI Task Planner — ${site.name}` },
      {
        name: "description",
        content: "Turn a messy task list into a prioritized daily or weekly plan with AI.",
      },
      { property: "og:title", content: `AI Task Planner — ${site.name}` },
      {
        property: "og:description",
        content: "Turn a messy task list into a prioritized daily or weekly plan with AI.",
      },
      { property: "og:url", content: "/ai-tools/planner" },
    ],
    links: [{ rel: "canonical", href: "/ai-tools/planner" }],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const [form, setForm] = useState({
    tasks: "",
    workingHours: "9-17",
    range: "daily" as "daily" | "weekly",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function generate(e?: FormEvent) {
    e?.preventDefault();
    if (!form.tasks.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "planner", payload: form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setResult(data.content ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={generate} className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Tasks *
          </span>
          <textarea
            required
            rows={7}
            value={form.tasks}
            onChange={(e) => setForm({ ...form, tasks: e.target.value })}
            placeholder="List your tasks, one per line…"
            className="input"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Working hours
            </span>
            <input
              value={form.workingHours}
              onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
              placeholder="9-17"
              className="input"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Plan range
            </span>
            <select
              value={form.range}
              onChange={(e) => setForm({ ...form, range: e.target.value as "daily" | "weekly" })}
              className="input"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Notes
          </span>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Constraints, deadlines, energy levels…"
            className="input"
          />
        </label>
        <button
          type="submit"
          disabled={loading || !form.tasks.trim()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Planning…" : "Generate Plan"}
        </button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Your plan</h2>
        {result ? (
          <div className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-strong:text-foreground prose-a:text-accent">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Your plan will appear here.</p>
        )}
      </div>
    </div>
  );
}

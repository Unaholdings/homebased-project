import { createFileRoute } from "@tanstack/react-router";
import { Copy, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import { site } from "@/lib/site";

export const Route = createFileRoute("/ai-tools/email")({
  head: () => ({
    meta: [
      { title: `Smart Email Generator — ${site.name}` },
      {
        name: "description",
        content: "Generate polished, on-tone emails in seconds with ZHT's AI email writer.",
      },
      { property: "og:title", content: `Smart Email Generator — ${site.name}` },
      {
        property: "og:description",
        content: "Generate polished, on-tone emails in seconds with ZHT's AI email writer.",
      },
      { property: "og:url", content: "/ai-tools/email" },
    ],
    links: [{ rel: "canonical", href: "/ai-tools/email" }],
  }),
  component: EmailPage,
});

const tones = ["professional", "friendly", "formal", "casual", "persuasive", "apologetic"];
const audiences = ["general", "client", "colleague", "manager", "customer", "recruiter"];

function EmailPage() {
  const [form, setForm] = useState({
    purpose: "",
    recipient: "",
    keyPoints: "",
    tone: "professional",
    audience: "general",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function generate(e?: FormEvent) {
    e?.preventDefault();
    if (!form.purpose.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "email", payload: form }),
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
      <form
        onSubmit={generate}
        className="rounded-2xl border border-border bg-card p-6 space-y-4"
      >
        <Field label="Purpose *">
          <input
            required
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            placeholder="e.g. Request a project deadline extension"
            className="input"
          />
        </Field>
        <Field label="Recipient">
          <input
            value={form.recipient}
            onChange={(e) => setForm({ ...form, recipient: e.target.value })}
            placeholder="e.g. My manager, Alex"
            className="input"
          />
        </Field>
        <Field label="Key points">
          <textarea
            value={form.keyPoints}
            onChange={(e) => setForm({ ...form, keyPoints: e.target.value })}
            rows={4}
            placeholder="Bullet the main things to mention"
            className="input"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tone">
            <select
              value={form.tone}
              onChange={(e) => setForm({ ...form, tone: e.target.value })}
              className="input"
            >
              {tones.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Audience">
            <select
              value={form.audience}
              onChange={(e) => setForm({ ...form, audience: e.target.value })}
              className="input"
            >
              {audiences.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <button
          type="submit"
          disabled={loading || !form.purpose.trim()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Generating…" : "Generate Email"}
        </button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">Generated email</h2>
          {result && (
            <div className="flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-secondary"
              >
                <Copy className="h-3.5 w-3.5" /> Copy
              </button>
              <button
                onClick={() => generate()}
                disabled={loading}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-secondary disabled:opacity-60"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Regenerate
              </button>
            </div>
          )}
        </div>
        {result ? (
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
            {result}
          </pre>
        ) : (
          <p className="text-sm text-muted-foreground">
            Your generated email will appear here.
          </p>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

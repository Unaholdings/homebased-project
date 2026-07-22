import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Bot, ListChecks, Mail, Sparkles, Zap, ShieldCheck, Cpu } from "lucide-react";
import { site } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${site.name} — ${site.tagline}` },
      { name: "description", content: site.description },
      { property: "og:title", content: `${site.name} — ${site.tagline}` },
      { property: "og:description", content: site.description },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: `${site.name} — ${site.tagline}` },
      { name: "twitter:description", content: site.description },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const icons = { email: Mail, planner: ListChecks, chat: Bot } as const;

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-hero relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 py-24 text-center md:py-32">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-silver bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            An AI suite by {site.name}
          </div>
          <h1 className="text-metal mt-6 text-balance text-5xl font-bold tracking-tight md:text-7xl">
            Three intelligent tools.
            <br />
            One workspace.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Draft polished emails, plan your day, and chat with a fast general-purpose assistant —
            no signup, no clutter.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/ai-tools/chat"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-glow transition hover:brightness-110"
            >
              Try the AI Chatbot <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/ai-tools"
              className="inline-flex items-center gap-2 rounded-md border border-silver bg-card/40 px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-card"
            >
              Explore all tools
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {site.tools.map((t) => {
            const Icon = icons[t.slug];
            return (
              <Link
                key={t.slug}
                to={t.href}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:border-silver hover:shadow-glow"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">{t.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
                <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  Open tool <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why use this */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="rounded-2xl border border-border bg-card/50 p-8 md:p-12">
          <h2 className="text-metal text-3xl font-bold">Why use this</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              { icon: Zap, title: "Instant results", body: "Answers stream back in seconds." },
              {
                icon: ShieldCheck,
                title: "No signup",
                body: "Open a tool and start — no accounts, no friction.",
              },
              { icon: Cpu, title: "Modern AI", body: "Powered by Google Gemini via Lovable AI." },
            ].map((b) => (
              <div key={b.title} className="flex gap-4">
                <div className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-secondary text-accent">
                  <b.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">{b.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Bot, ListChecks, Mail } from "lucide-react";
import { site } from "@/lib/site";

export const Route = createFileRoute("/ai-tools/")({
  component: Overview,
});

const icons = { email: Mail, planner: ListChecks, chat: Bot } as const;

function Overview() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {site.tools.map((t) => {
        const Icon = icons[t.slug];
        return (
          <Link
            key={t.slug}
            to={t.href}
            className="group rounded-2xl border border-border bg-card p-6 transition hover:border-silver hover:shadow-glow"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-accent">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">{t.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
            <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent">
              Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

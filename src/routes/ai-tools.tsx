import { Link, Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { site } from "@/lib/site";

export const Route = createFileRoute("/ai-tools")({
  head: () => ({
    meta: [
      { title: `AI Tools — ${site.name}` },
      {
        name: "description",
        content: "Explore ZHT's AI tools: email generator, task planner, and chatbot.",
      },
      { property: "og:title", content: `AI Tools — ${site.name}` },
      {
        property: "og:description",
        content: "Explore ZHT's AI tools: email generator, task planner, and chatbot.",
      },
      { property: "og:url", content: "/ai-tools" },
    ],
    links: [{ rel: "canonical", href: "/ai-tools" }],
  }),
  component: AiToolsLayout,
});

const tabs = [
  { to: "/ai-tools", label: "Overview", exact: true },
  { to: "/ai-tools/email", label: "Email Generator", exact: false },
  { to: "/ai-tools/planner", label: "Task Planner", exact: false },
  { to: "/ai-tools/chat", label: "AI Chatbot", exact: false },
] as const;

function AiToolsLayout() {
  const { pathname } = useLocation();
  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <div className="text-center">
        <h1 className="text-metal text-4xl font-bold tracking-tight md:text-5xl">AI Tools</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          A small, focused toolkit powered by modern AI. Pick a tool below.
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <div className="inline-flex flex-wrap gap-1 rounded-xl border border-border bg-card/50 p-1">
          {tabs.map((t) => {
            const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-10">
        <Outlet />
      </div>
    </div>
  );
}

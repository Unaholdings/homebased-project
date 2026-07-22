import { Link } from "@tanstack/react-router";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { site } from "@/lib/site";

const links = [
  { to: "/", label: "Home" },
  { to: "/ai-tools/email", label: "Smart Email Generator" },
  { to: "/ai-tools/planner", label: "AI Task Planner" },
  { to: "/ai-tools/chat", label: "AI Chatbot" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-silver to-silver-muted text-background shadow-glow">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-metal text-lg font-bold tracking-tight">{site.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground data-[status=active]:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/ai-tools/chat"
            className="ml-2 inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:brightness-110"
          >
            <Sparkles className="h-4 w-4" /> Try AI
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/ai-tools/chat"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
            >
              <Sparkles className="h-4 w-4" /> Try AI
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

import { Link } from "@tanstack/react-router";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
        <div>
          <div className="text-metal text-lg font-bold">{site.name}</div>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            A minimal AI suite: draft emails, plan your day, and chat with an assistant — all in
            one quiet workspace.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">AI tools</div>
          <ul className="mt-3 space-y-2 text-sm">
            {site.tools.map((t) => (
              <li key={t.slug}>
                <Link
                  to={t.href}
                  className="text-muted-foreground transition hover:text-foreground"
                >
                  {t.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {site.name}
      </div>
    </footer>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import { site } from "@/lib/site";

export const Route = createFileRoute("/ai-tools/chat")({
  head: () => ({
    meta: [
      { title: `AI Chatbot — ${site.name}` },
      {
        name: "description",
        content: "Chat with ZHT's fast, general-purpose AI assistant. No signup required.",
      },
      { property: "og:title", content: `AI Chatbot — ${site.name}` },
      {
        property: "og:description",
        content: "Chat with ZHT's fast, general-purpose AI assistant. No signup required.",
      },
      { property: "og:url", content: "/ai-tools/chat" },
    ],
    links: [{ rel: "canonical", href: "/ai-tools/chat" }],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const INITIAL: Msg = {
  role: "assistant",
  content: "Hi! I'm ZHT. Ask me anything — I can explain, brainstorm, summarize, or help you draft.",
};

const SUGGESTIONS = [
  "Explain quantum computing simply",
  "Draft a 3-line intro about me",
  "Summarize the pros and cons of remote work",
  "Give me a 20-minute workout plan",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([INITIAL]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    setError("");
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "chat",
          payload: { messages: next.map((m) => ({ role: m.role, content: m.content })) },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setMessages([...next, { role: "assistant", content: data.content ?? "" }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  const isEmpty = messages.length === 1;

  return (
    <div className="mx-auto flex h-[70vh] max-w-3xl flex-col rounded-2xl border border-border bg-card">
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-6">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                m.role === "user"
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-foreground"
              }`}
            >
              {m.role === "assistant" ? (
                <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-headings:text-foreground prose-strong:text-foreground">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{m.content}</p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl bg-secondary px-4 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
            </div>
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="border-t border-border p-4">
        {isEmpty && (
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => void send(s)}
                className="rounded-full border border-silver bg-background/40 px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything…"
            className="input flex-1"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

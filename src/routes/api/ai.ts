import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const BodySchema = z.object({
  mode: z.enum(["email", "planner", "chat"]),
  payload: z.any(),
});

const emailPayload = z.object({
  purpose: z.string().min(1),
  recipient: z.string().optional().default(""),
  keyPoints: z.string().optional().default(""),
  tone: z.string().optional().default("professional"),
  audience: z.string().optional().default("general"),
});

const plannerPayload = z.object({
  tasks: z.string().min(1),
  workingHours: z.string().optional().default("9-17"),
  range: z.enum(["daily", "weekly"]).default("daily"),
  notes: z.string().optional().default(""),
});

const chatPayload = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant", "system"]), content: z.string() }))
    .min(1),
});

function buildPrompt(mode: "email" | "planner" | "chat", payload: unknown) {
  if (mode === "email") {
    const d = emailPayload.parse(payload);
    return {
      system:
        "You are a professional email writing assistant. Produce a single ready-to-send email. Return plain text with a subject line on the first line prefixed with 'Subject: '. Keep it concise and well-structured.",
      user: `Purpose: ${d.purpose}\nRecipient: ${d.recipient || "(unspecified)"}\nKey points: ${d.keyPoints || "(none)"}\nTone: ${d.tone}\nAudience: ${d.audience}\n\nWrite the email.`,
    };
  }
  if (mode === "planner") {
    const d = plannerPayload.parse(payload);
    return {
      system:
        "You are an expert productivity planner. Output well-formatted Markdown with: a short summary, a prioritized schedule with time blocks, and 3 concise tips at the end. Use headings, bullet lists, and bold priorities.",
      user: `Tasks:\n${d.tasks}\n\nWorking hours: ${d.workingHours}\nPlan range: ${d.range}\nNotes: ${d.notes || "(none)"}\n\nProduce the plan in Markdown.`,
    };
  }
  const d = chatPayload.parse(payload);
  return {
    system:
      "You are ZHT, a helpful, concise, and friendly general-purpose AI assistant. Use Markdown when helpful.",
    messages: d.messages,
  };
}

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return Response.json(
            { error: "AI is not configured (missing LOVABLE_API_KEY)." },
            { status: 500 },
          );
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON." }, { status: 400 });
        }

        const parsed = BodySchema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "Invalid request." }, { status: 400 });
        }

        let messages: Array<{ role: string; content: string }>;
        try {
          const built = buildPrompt(parsed.data.mode, parsed.data.payload);
          if ("messages" in built) {
            messages = [{ role: "system", content: built.system }, ...built.messages];
          } else {
            messages = [
              { role: "system", content: built.system },
              { role: "user", content: built.user },
            ];
          }
        } catch {
          return Response.json({ error: "Invalid payload for mode." }, { status: 400 });
        }

        try {
          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Lovable-API-Key": key,
            },
            body: JSON.stringify({ model: "google/gemini-3.6-flash", messages }),
          });

          if (res.status === 429) {
            return Response.json(
              { error: "Rate limit reached. Please try again shortly." },
              { status: 429 },
            );
          }
          if (res.status === 402) {
            return Response.json(
              { error: "AI credits exhausted. Please add credits to continue." },
              { status: 402 },
            );
          }
          if (!res.ok) {
            const text = await res.text().catch(() => "");
            return Response.json(
              { error: `AI gateway error (${res.status}): ${text.slice(0, 200)}` },
              { status: 502 },
            );
          }

          const data = (await res.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
          };
          const content = data.choices?.[0]?.message?.content ?? "";
          return Response.json({ content });
        } catch (err) {
          return Response.json(
            { error: err instanceof Error ? err.message : "Unknown error" },
            { status: 500 },
          );
        }
      },
    },
  },
});

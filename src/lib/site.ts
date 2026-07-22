export const site = {
  name: "ZHT",
  tagline: "Three intelligent tools. One workspace.",
  description:
    "ZHT is a modern AI suite with a smart email generator, task planner, and chatbot — no signup required.",
  url: "",
  tools: [
    {
      slug: "email",
      title: "Smart Email Generator",
      href: "/ai-tools/email",
      description: "Draft polished, on-tone emails in seconds.",
    },
    {
      slug: "planner",
      title: "AI Task Planner",
      href: "/ai-tools/planner",
      description: "Turn a messy task list into a prioritized plan.",
    },
    {
      slug: "chat",
      title: "AI Chatbot",
      href: "/ai-tools/chat",
      description: "A fast, general-purpose assistant for anything.",
    },
  ],
} as const;

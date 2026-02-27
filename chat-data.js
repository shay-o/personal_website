// ═══════════════════════════════════════════════════════════════
// Chat Widget Config
// ═══════════════════════════════════════════════════════════════
// Controls the starter questions and widget header text.
// The system prompt and resume data live in api/chat.js (server-side).
// ═══════════════════════════════════════════════════════════════

const SUGGESTED_QUESTIONS = [
  "What kind of role is Shay looking for?",
  "Tell me about their AI projects",
  "What was their role at Adobe?",
  "What's their leadership experience?",
];

window.ChatConfig = {
  SUGGESTED_QUESTIONS,
  name: "Shay O'Reilly",
  initials: "SO",
  tagline: "Ask me anything about Shay's experience",
};

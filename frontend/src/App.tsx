// =============================================================
// App.tsx
// Root component of the application.
// Manages chat state, message send/reset logic, and the overall
// layout (navbar + chat area + input bar).
// =============================================================

import { useState, useRef, useEffect } from "react";
import ChatInput from "./components/ChatInput";
import UserPanel from "./components/UserPanel";
import AIResponsePanel from "./components/AIResponsePanel";
import { sendChatMessage } from "./services/backendApiService";
import type { Message } from "./types";
import "./App.css";

/**
 * Returns the current time as a formatted string (e.g. "02:35 PM").
 * Used to timestamp each message when it is created.
 */
function now(): string {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function App() {
  // List of messages sent by the user
  const [userMessages, setUserMessages] = useState<Message[]>([]);
  // List of AI responses received from the backend
  const [aiResponses, setAiResponses] = useState<Message[]>([]);
  // True while waiting for the backend to respond (shows loading indicator)
  const [loading, setLoading] = useState(false);

  // Ref attached to an invisible div at the bottom of the message list,
  // used to auto-scroll to the latest message
  const bottomRef = useRef<HTMLDivElement>(null);

  // True before the user sends any message — controls Welcome screen visibility
  const isFirstMessage = userMessages.length === 0;

  // Scroll to the bottom whenever a new message is added or loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [userMessages, aiResponses, loading]);

  /**
   * Called when the user submits a message.
   * 1) Appends the user message to the list
   * 2) Calls the backend API
   * 3) Appends the AI response to the list
   *
   * @param message - The text string the user submitted
   */
  const handleSend = async (message: string) => {
    setUserMessages((prev) => [...prev, { text: message, ts: now() }]);
    setLoading(true);
    try {
      const { response } = await sendChatMessage(message);
      setAiResponses((prev) => [...prev, { text: response, ts: now() }]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Called when the user clicks "Reset Chat".
   * Clears all messages and returns to the Welcome screen.
   */
  const handleReset = () => {
    setUserMessages([]);
    setAiResponses([]);
  };

  /**
   * Called when the user clicks "Quick Exit".
   * Uses window.location.replace() to redirect to Google immediately.
   * replace() overwrites the current history entry so the user cannot
   * navigate back to this app using the browser's back button —
   * an important safety behaviour for sensitive resource apps.
   */
  const handleQuickExit = () => {
    window.location.replace("https://www.google.com");
  };

  // Build a chronologically interleaved array of user and AI messages:
  // userMessages[0] → aiResponses[0] → userMessages[1] → aiResponses[1] ...
  const maxLen = Math.max(userMessages.length, aiResponses.length);
  const interleaved = Array.from({ length: maxLen }).flatMap((_, i) => {
    const items = [];
    if (userMessages[i])
      items.push({ type: "user" as const, data: userMessages[i] });
    if (aiResponses[i])
      items.push({ type: "ai" as const, data: aiResponses[i] });
    return items;
  });

  return (
    <div className="page">
      <div className="chat-box">
        {/* ── Top navigation bar ── */}
        <nav className="navbar">
          <div className="navbar-inner">
            <div className="navbar-left">
              <span className="nav-brand">TechAlong Labs</span>
              {/* FAQ links SFU (Not defined yet) */}
              <a
                href="https://www.sfu.ca/"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                FAQ
              </a>
              {/* Clears all messages and returns to the Welcome screen */}
              <button className="nav-link nav-btn-reset" onClick={handleReset}>
                Reset Chat
              </button>
            </div>
            {/* Redirects to Google immediately; back-navigation is blocked via replace() */}
            <button
              className="nav-quick-exit"
              onClick={handleQuickExit}
              aria-label="Quick exit – navigate away immediately"
            >
              Quick Exit
            </button>
          </div>
        </nav>

        {/* ── Main chat area ── */}
        <main className="main-content">
          <div className="chat-inner">
            {/* Welcome screen — only shown before the first message is sent */}
            {isFirstMessage && (
              <div className="welcome">
                <div className="welcome-avatar">
                  <span>ᴗ</span>
                </div>
                <h1 className="welcome-title">Hi, I'm One Tap Away Chatbot!</h1>
                <p className="welcome-subtitle">
                  I am here to provide you with community resources in British
                  Columbia, Canada.
                </p>
              </div>
            )}

            {/* Message list — shown once at least one message exists */}
            {!isFirstMessage && (
              <div className="messages">
                {interleaved.map((item, i) =>
                  item.type === "user" ? (
                    <UserPanel key={i} messages={[item.data]} />
                  ) : (
                    <AIResponsePanel
                      key={i}
                      responses={[item.data]}
                      loading={false}
                    />
                  ),
                )}
                {/* Show typing indicator while waiting for the AI response */}
                {loading && <AIResponsePanel responses={[]} loading={true} />}
                {/* Invisible anchor used by the auto-scroll effect */}
                <div ref={bottomRef} />
              </div>
            )}
          </div>
        </main>

        {/* ── Bottom input bar ── */}
        <div className="input-wrapper">
          <div className="input-wrapper-inner">
            <ChatInput
              onSend={handleSend}
              disabled={loading}
              isFirstMessage={isFirstMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

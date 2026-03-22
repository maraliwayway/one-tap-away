import { useState, useRef } from "react";

const SUGGESTION_CHIPS = [
  "I am not sure what to do.",
  "I need legal help for family matters.",
  "I need a safe place to go.",
  "I need someone to talk to confidentially.",
];

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isFirstMessage?: boolean;
  showChips?: boolean;
}

export default function ChatInput({
  onSend,
  disabled = false,
  isFirstMessage = true,
  showChips = true,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const chipsRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = (text: string = message) => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setMessage("");
    textareaRef.current?.focus();
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const scrollChips = (dir: "left" | "right") => {
    if (!chipsRef.current) return;
    chipsRef.current.scrollBy({ left: dir === "left" ? -160 : 160, behavior: "smooth" });
  };

  return (
    <div className="input-bar">

      {/* ── Suggestion chips row ── */}
      {showChips && (
        <div className="chips-row">
          <button className="chips-chevron" onClick={() => scrollChips("left")} aria-label="Scroll left">
            &#8249;
          </button>
          <div className="chips-container" ref={chipsRef}>
            {SUGGESTION_CHIPS.map((chip) => (
              <button
                key={chip}
                className="chip"
                onClick={() => handleSend(chip)}
                disabled={disabled}
              >
                {chip}
              </button>
            ))}
          </div>
          <button className="chips-chevron" onClick={() => scrollChips("right")} aria-label="Scroll right">
            &#8250;
          </button>
        </div>
      )}

      {/* ── Text input row ── */}
      <div className="input-row">
        <textarea
          ref={textareaRef}
          className="input-field"
          rows={1}
          placeholder={isFirstMessage
            ? "What seems to be the biggest concern on your mind?"
            : "Type your response..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
        />
        <button
          className="send-btn"
          onClick={() => handleSend()}
          disabled={!message.trim() || disabled}
          aria-label="Send"
        >
          <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
            <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
          </svg>
        </button>
      </div>

      {/* ── Privacy policy row ── */}
      <div className="input-footer">
        Created by <a href="#" className="footer-link">TechAlong Labs</a>. By using this chat, you agree to our{" "}
        <a href="#" className="footer-link">Privacy Policy</a>.
      </div>

    </div>
  );
}
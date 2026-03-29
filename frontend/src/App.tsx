import { useState, useRef, useEffect } from "react";
import ChatInput from "./components/ChatInput";
import UserPanel from "./components/UserPanel";
import AIResponsePanel from "./components/AIResponsePanel";
import { streamResponse, type ConversationState } from "./services/streamService";
import { sendChatMessage } from "./services/backendApiService";
import "./App.css";

interface Message {
  text: string;
  ts: string;
}

function now(): string {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const INITIAL_STATE: ConversationState = {
  step: "init",
  detectedKeywords: [],
  city: null,
};

export default function App() {
  const [userMessages, setUserMessages] = useState<Message[]>([]);
  const [aiResponses,  setAiResponses]  = useState<Message[]>([]);
  const [loading,      setLoading]      = useState(false);
  const [convState,    setConvState]    = useState<ConversationState>(INITIAL_STATE);

  const bottomRef = useRef<HTMLDivElement>(null);
  const isFirstMessage = userMessages.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [userMessages, aiResponses, loading]);

  const handleSend = async (message: string) => {
    setUserMessages((prev) => [...prev, { text: message, ts: now() }]);
    setLoading(true);
    try {
    //   const { reply, nextState } = await streamResponse(message, convState);
      const { response } = await sendChatMessage(message);
      setAiResponses((prev) => [...prev, { text: response, ts: now() }]);
    //   setConvState(nextState);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUserMessages([]);
    setAiResponses([]);
    setConvState(INITIAL_STATE);
  };

  // Interleave messages chronologically
  const maxLen = Math.max(userMessages.length, aiResponses.length);
  const interleaved = Array.from({ length: maxLen }).flatMap((_, i) => {
    const items = [];
    if (userMessages[i]) items.push({ type: "user" as const, data: userMessages[i] });
    if (aiResponses[i])  items.push({ type: "ai"   as const, data: aiResponses[i] });
    return items;
  });

  return (
    <div className="page">
      <div className="chat-box">

        {/* ── Top nav ── */}
        <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-left">
            <span className="nav-brand">TechAlong Labs</span>
            <a href="#" className="nav-link">FAQ</a>
            <button className="nav-link nav-btn-reset" onClick={handleReset}>Reset Chat</button>
          </div>
          <button className="nav-quick-exit">Quick Exit</button>
        </div>
      </nav>

      {/* ── Main content ── */}
      <main className="main-content">
        <div className="chat-inner">

          {/* Welcome screen — only before first message */}
          {isFirstMessage && (
            <div className="welcome">
              <div className="welcome-avatar">
                <span>ᴗ</span>
              </div>
              <h1 className="welcome-title">Hi, I'm One Tap Away Chatbot!</h1>
              <p className="welcome-subtitle">
                I am here to provide you with community resources in British Columbia, Canada.
              </p>
            </div>
          )}

          {/* Messages */}
          {!isFirstMessage && (
            <div className="messages">
              {interleaved.map((item, i) =>
                item.type === "user"
                  ? <UserPanel       key={i} messages={[item.data]} />
                  : <AIResponsePanel key={i} responses={[item.data]} loading={false} />
              )}
              {loading && <AIResponsePanel responses={[]} loading={true} />}
              <div ref={bottomRef} />
            </div>
          )}

        </div>
      </main>

      {/* ── Input bar ── */}
      <div className="input-wrapper">
        <div className="input-wrapper-inner">
          <ChatInput
            onSend={handleSend}
            disabled={loading}
            isFirstMessage={isFirstMessage}
            showChips={convState.step === "init"}
          />
        </div>
      </div>

      </div>
    </div>
  );
}
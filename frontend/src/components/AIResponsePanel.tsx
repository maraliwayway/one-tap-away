import ReactMarkdown from "react-markdown";

interface Message {
  text: string;
  ts: string;
}

interface AIResponsePanelProps {
  responses: Message[];
  loading: boolean;
}

export default function AIResponsePanel({ responses, loading }: AIResponsePanelProps) {
  return (
    <>
      {responses.map((res, i) => (
        <div key={i} className="msg-row ai">
          <div className="msg-avatar">🤝</div>
          <div className="bubble ai markdown-body">
            <ReactMarkdown>{res.text}</ReactMarkdown>
          </div>
        </div>
      ))}

      {loading && (
        <div className="typing-row">
          <div className="msg-avatar">🤝</div>
          <div className="typing-bubble">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
        </div>
      )}
    </>
  );
}
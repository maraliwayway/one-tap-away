interface Message {
  text: string;
  ts: string;
}

interface UserPanelProps {
  messages: Message[];
}

export default function UserPanel({ messages }: UserPanelProps) {
  return (
    <>
      {messages.map((msg, i) => (
        <div key={i} className="msg-row user">
          <div className="bubble user">{msg.text}</div>
        </div>
      ))}
    </>
  );
}
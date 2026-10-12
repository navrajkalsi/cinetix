// A discardable pill

import "./Pill.css";

interface PillProps {
  content: string;
  handleDiscard: (s: string) => void;
}

export default function Pill({ content, handleDiscard }: PillProps) {
  return (
    <div className="pill">
      <div className="pill-content">{content}</div>
      <button
        type="button"
        onClick={() => handleDiscard(content)}
        aria-label={`Remove seat ${content}`}
        title={`Remove seat ${content}`}
        className="pill-close"
      >
        ×
      </button>
    </div>
  );
}

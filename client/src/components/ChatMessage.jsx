import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import "../styles/Message.css";

function formatMath(text) {
  return String(text || "")
    .replace(/\\\[/g, "$$")
    .replace(/\\\]/g, "$$")
    .replace(/\\\(/g, "$")
    .replace(/\\\)/g, "$");
}

export default function ChatMessage({ message }) {
  const isUser = message.sender === "user";

   return (
    <div className={`message ${message.sender}`}>
      <div className="message-content">
        {isUser ? (
          <p>{message.text}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {formatMath(message.text)}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
} 
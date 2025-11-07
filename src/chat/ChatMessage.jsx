import { cn } from "@/lib/utils";
import "./ChatMessage.css";

const ChatMessage = ({ role, content }) => {
  return (
    <div
      className={cn(
        "chat-message",
        role === "assistant" && "chat-message-assistant"
      )}
    >
      <div className="chat-avatar">{role === "user" ? "U" : "AI"}</div>
      <div className="chat-content">
        <p className="chat-text">{content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;

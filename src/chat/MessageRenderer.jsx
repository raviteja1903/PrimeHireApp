// import React from "react";
// import ChatMessage from "./ChatMessage";
// import ProfileTable from "./ProfileTable";
// import ResumeTable from "./ResumeTable";

// const MessageRenderer = ({ message, index }) => {
//   console.log("🖥 Rendering message:", message, "at index:", index);

//   if (message.type === "profile_table") {
//     console.log("📊 Rendering ProfileTable");
//     return <ProfileTable data={message.data} index={index} />;
//   }

//   if (message.type === "resume_table") {
//     console.log("📄 Rendering ResumeTable");
//     return <ResumeTable data={message.data} index={index} />;
//   }

//   console.log("💬 Rendering ChatMessage");
//   return <ChatMessage key={index} role={message.role} content={message.content} />;
// };

// export default MessageRenderer;
import React, { useState } from "react";
import ChatMessage from "./ChatMessage";
import ProfileTable from "./ProfileTable";
import ResumeTable from "./ResumeTable";

const MessageRenderer = ({ message, index }) => {
  // Profile and Resume tables remain unchanged
  if (message.type === "profile_table") return <ProfileTable data={message.data} index={index} />;
  if (message.type === "resume_table") return <ResumeTable data={message.data} index={index} />;

  // Detect JD message by simple condition
  const isJDMessage =
    message.role === "assistant" &&
    typeof message.content === "string" &&
    message.content.includes("Job Title:");

  // Local state to show "Copied" temporarily
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // reset after 1.5s
  };

  return (
    <div>
      <ChatMessage key={index} role={message.role} content={message.content} />

      {/* Minimal copy button for JD messages */}
      {isJDMessage && (
        <span
          onClick={handleCopy}
          style={{
            cursor: "pointer",
            fontSize: "0.75rem",
            color: copied ? "green" : "gray",
            marginLeft: "0.5rem",
            userSelect: "none",
          }}
        >
          {copied ? "Copied ✅" : "Copy JD"}
        </span>
      )}
    </div>
  );
};

export default MessageRenderer;
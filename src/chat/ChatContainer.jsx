import React from "react";
import MessageRenderer from "./MessageRenderer";
import PrimeHireBrain from "../PrimeHireBrain/PrimeHireBrain";
import InterviewBot from "../InterviewBot/InterviewBot";
import LinkedInPosterButton from "../LinkedInPoster/LinkedInPosterButton";
import ZohoLoginButton from "../ZohoBridge/ZohoLoginButton";
import MailMindButton from "../MailMind/MailMindButton";
import "./ChatContainer.css";

const ChatContainer = ({ messages, selectedFeature, selectedTask, isLoading }) => {
  return (
    <>
      {/* Render messages */}
      {messages.map((msg, idx) => (
        <MessageRenderer key={idx} message={msg} index={idx} />
      ))}

      {/* Loading indicator */}
      {isLoading && <LoadingIndicator />}

      {/* Feature-specific components */}
      {selectedFeature === "PrimeHireBrain" && <PrimeHireBrain />}
      {selectedFeature === "InterviewBot" && <InterviewBot />}
      {selectedFeature === "LinkedInPoster" && <LinkedInPosterButton />}
      {selectedFeature === "ZohoBridge" && <ZohoLoginButton />}
      {selectedFeature === "MailMind" && <MailMindButton />}
    </>
  );
};

const LoadingIndicator = () => (
  <div className="chat-loading-container">
    <div className="chat-ai-avatar">
      AI
    </div>
    <div className="chat-loading-dots">
      <div className="chat-loading-dot chat-loading-dot-1" />
      <div className="chat-loading-dot chat-loading-dot-2" />
      <div className="chat-loading-dot chat-loading-dot-3" />
    </div>
  </div>
);

export default ChatContainer;
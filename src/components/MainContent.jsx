// import React from "react";
// import { useMainContent } from "@/hooks/useMainContent";
// import Header from "../common/Header";
// import FeatureButtons from "../common/FeatureButtons";
// import ChatContainer from "../chat/ChatContainer";
// import TaskSelector from "../common/TaskSelector";
// import "./MainContent.css";

// const MainContent = () => {
//   const {
//     messages,
//     selectedFeature,
//     selectedTask,
//     isLoading,
//     handleFeatureClick,
//     handleTaskSelect,
//     handleRefresh,
//     handleSend,
//     handleJdSend,
//     currentJdInput,
//     setCurrentJdInput,
//     currentJdStep,
//     uploadResumes,
//   } = useMainContent();

//   return (
//     <div className="main-content">
//       <Header onRefresh={handleRefresh} />

//       <main className="main-content-body">
//         <div className="chat-area">
//           {/* Welcome / Feature Selection */}
//           {messages.length === 0 && selectedTask === "" && (
//             <div className="welcome-section">
//               <h1 className="welcome-title">
//                 Hi, I'm PrimeHire — Agentic AI for Recruiting
//               </h1>
//               <p className="welcome-subtitle">
//                 Choose from powerful AI features below
//               </p>
//               <FeatureButtons
//                 selectedFeature={selectedFeature}
//                 onFeatureClick={handleFeatureClick}
//               />
//             </div>
//           )}

//           {/* Chat and Feature Content */}
//           <ChatContainer
//             messages={messages}
//             selectedFeature={selectedFeature}
//             selectedTask={selectedTask}
//             isLoading={isLoading}
//           />
//         </div>

//         {/* Bottom Sticky Section */}
//         <div className="bottom-sticky-section">
//           <TaskSelector
//             selectedTask={selectedTask}
//             onTaskSelect={handleTaskSelect}
//             onUploadResumes={uploadResumes}
//             onJdSend={handleJdSend}
//             currentJdInput={currentJdInput}
//             setCurrentJdInput={setCurrentJdInput}
//             currentJdStep={currentJdStep}
//             isLoading={isLoading}
//             onSend={handleSend}
//           />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default MainContent;

import React, { useState } from "react";
import { useMainContent } from "@/hooks/useMainContent";
import Header from "../common/Header";
import FeatureButtons from "../common/FeatureButtons";
import ChatContainer from "../chat/ChatContainer";
import TaskSelector from "../common/TaskSelector";
import WebcamRecorder from "../InterviewBot/WebcamRecorder";
import "./MainContent.css";

const MainContent = () => {
  const {
    messages,
    selectedFeature,
    selectedTask,
    isLoading,
    handleFeatureClick,
    handleTaskSelect,
    handleRefresh,
    handleSend,
    handleJdSend,
    currentJdInput,
    setCurrentJdInput,
    currentJdStep,
    uploadResumes,
  } = useMainContent();

  const [interviewTranscript, setInterviewTranscript] = useState([]);

  const isWebcamActive = selectedTask === "webcam-interview";

  return (
    <div className="main-content">
      <Header onRefresh={handleRefresh} />

      <main className={`main-content-body ${isWebcamActive ? "webcam-active" : ""}`}>
        <div className="chat-area">
          {/* Welcome / Feature Selection */}
          {messages.length === 0 && selectedTask === "" && (
            <div className="welcome-section">
              <h1 className="welcome-title">
                Hi, I'm PrimeHire <span>— Agentic AI for Recruiting</span>
              </h1>
              <p className="welcome-subtitle">
                Choose from powerful AI features below
              </p>
              <FeatureButtons
                selectedFeature={selectedFeature}
                onFeatureClick={handleFeatureClick}
              />
            </div>
          )}

          {/* Conditional Rendering */}
          {isWebcamActive ? (
            <WebcamRecorder
              candidateName={currentJdInput || "Candidate Name"}
              onStopInterview={() => handleTaskSelect("")}
              transcript={interviewTranscript}
              setTranscript={setInterviewTranscript}
            />
          ) : (
            <ChatContainer
              messages={messages}
              selectedFeature={selectedFeature}
              selectedTask={selectedTask}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Bottom Sticky Section - only show if webcam is NOT active */}
        {!isWebcamActive && (
          <div className="bottom-sticky-section">
            <TaskSelector
              selectedTask={selectedTask}
              onTaskSelect={handleTaskSelect}
              onUploadResumes={uploadResumes}
              onJdSend={handleJdSend}
              currentJdInput={currentJdInput}
              setCurrentJdInput={setCurrentJdInput}
              currentJdStep={currentJdStep}
              isLoading={isLoading}
              onSend={handleSend}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default MainContent;

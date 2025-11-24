// // // // import React, { useState, useEffect, useRef } from "react";
// // // // import { Button } from "@/components/ui/button";
// // // // import "./TranscriptPanel.css";
// // // // import { API_BASE } from "@/utils/constants";
// // // // import { v4 as uuidv4 } from "uuid";

// // // // const TranscriptPanel = ({ onStopInterview, candidateName, jobDescription = "" }) => {
// // // //   const [transcript, setTranscript] = useState([]);
// // // //   const [recording, setRecording] = useState(false);
// // // //   const [recorder, setRecorder] = useState(null);
// // // //   const [candidateId, setCandidateId] = useState(uuidv4()); // ✅ candidate ID persists per session
// // // //   const [interviewCompleted, setInterviewCompleted] = useState(false);
// // // //   const transcriptEndRef = useRef(null);

// // // //   // Auto-scroll to bottom when new message added
// // // //   useEffect(() => {
// // // //     transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
// // // //   }, [transcript]);

// // // //   // 🔊 Speak + Append to transcript
// // // //   const speak = (text) => {
// // // //     if (!text) return;
// // // //     setTranscript((t) => [...t, { sender: "ai", text }]);
// // // //     const utter = new SpeechSynthesisUtterance(text);
// // // //     utter.rate = 1.05;
// // // //     speechSynthesis.cancel();
// // // //     speechSynthesis.speak(utter);
// // // //   };

// // // //   // 🎯 Start Interview / Get First Question
// // // //   async function generateQuestion() {
// // // //     console.log("🎯 Starting interview for candidateId:", candidateId);
// // // //     if (!jobDescription.trim()) {
// // // //       alert("Please enter or paste a Job Description first!");
// // // //       return;
// // // //     }

// // // //     try {
// // // //       const fd = new FormData();
// // // //       fd.append("init", "true");
// // // //       fd.append("candidate_name", candidateName || "Anonymous");
// // // //       fd.append("job_description", jobDescription);
// // // //       fd.append("candidate_id", candidateId);

// // // //       const r = await fetch(`${API_BASE}/mcp/interview/process-answer`, {
// // // //         method: "POST",
// // // //         body: fd,
// // // //       });

// // // //       const d = await r.json();
// // // //       console.log("🧠 AI Question Response:", d);

// // // //       if (d.ok && d.next_question) {
// // // //         // ✅ If backend returned a candidate_id, persist it
// // // //         if (d.candidate_id && d.candidate_id !== candidateId) {
// // // //           setCandidateId(d.candidate_id);
// // // //         }

// // // //         // ✅ Show first AI question
// // // //         const firstQ = d.next_question.trim();
// // // //         setTranscript((t) => [...t, { sender: "ai", text: firstQ }]);
// // // //         speak(firstQ);
// // // //       } else {
// // // //         alert("⚠ AI did not return a question. Try again.");
// // // //       }
// // // //     } catch (err) {
// // // //       console.error("❌ Error generating question:", err);
// // // //       alert("Failed to start the interview. Check backend connection.");
// // // //     }
// // // //   }

// // // //   // 🎙 Start Recording
// // // //   async function startRecording() {
// // // //     try {
// // // //       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
// // // //       const rec = new MediaRecorder(stream);
// // // //       const chunks = [];

// // // //       rec.ondataavailable = (e) => chunks.push(e.data);
// // // //       rec.onstop = async () => {
// // // //         const blob = new Blob(chunks, { type: "audio/webm" });
// // // //         await sendAnswer(blob);
// // // //         stream.getTracks().forEach((t) => t.stop());
// // // //       };

// // // //       rec.start();
// // // //       setRecorder(rec);
// // // //       setRecording(true);
// // // //     } catch (err) {
// // // //       console.error("🎙 Mic error:", err);
// // // //       alert("Please allow microphone access to continue.");
// // // //     }
// // // //   }

// // // //   // ⏹ Stop & Send
// // // //   function stopAndSend() {
// // // //     if (recorder) {
// // // //       recorder.stop();
// // // //       setRecording(false);
// // // //     }
// // // //   }

// // // //   // 🚀 Send Answer to Backend
// // // //   async function sendAnswer(blob) {
// // // //     console.log("🎙 Sending answer for candidateId:", candidateId);
// // // //     try {
// // // //       const fd = new FormData();
// // // //       fd.append("audio", blob);
// // // //       fd.append("candidate_name", candidateName || "Anonymous");
// // // //       fd.append("job_description", jobDescription);
// // // //       fd.append("candidate_id", candidateId);

// // // //       const r = await fetch(`${API_BASE}/mcp/interview/process-answer`, {
// // // //         method: "POST",
// // // //         body: fd,
// // // //       });

// // // //       const d = await r.json();
// // // //       console.log("🧩 Backend Response:", d);

// // // //       // ✅ Candidate's transcribed answer
// // // //       if (d.ok && d.transcribed_text) {
// // // //         setTranscript((t) => [...t, { sender: "user", text: d.transcribed_text }]);
// // // //       }

// // // //       // ✅ Next question (if not finished)
// // // //       if (d.next_question && !d.completed) {
// // // //         speak(d.next_question);
// // // //       }

// // // //       // ✅ Final message after last question
// // // //       if (d.completed) {
// // // //         const finalMsg =
// // // //           d.final_message ||
// // // //           "✅ Thank you for completing the interview. Please click Stop Interview to end your session.";
// // // //         setTranscript((t) => [...t, { sender: "ai", text: finalMsg }]);
// // // //         speak(finalMsg);
// // // //         setRecording(false);
// // // //         setInterviewCompleted(true);
// // // //       }
// // // //     } catch (err) {
// // // //       console.error("❌ Error sending answer:", err);
// // // //       alert("Failed to send audio to backend.");
// // // //     }
// // // //   }

// // // //   return (
// // // //     <div className="transcript-panel">
// // // //       <h3 className="transcript-heading">📝 Transcript</h3>

// // // //       {/* 🎯 Action Buttons */}
// // // //       <div className="transcript-actions">
// // // //         <Button onClick={generateQuestion} variant="outline" disabled={recording || interviewCompleted}>
// // // //           🎯 Start / Next Question
// // // //         </Button>

// // // //         {!recording ? (
// // // //           <Button onClick={startRecording} variant="default" disabled={interviewCompleted}>
// // // //             🎙 Record Answer
// // // //           </Button>
// // // //         ) : (
// // // //           <Button onClick={stopAndSend} variant="destructive">
// // // //             ⏹ Stop & Send
// // // //           </Button>
// // // //         )}

// // // //         {/* <Button
// // // //           onClick={onStopInterview}
// // // //           variant={interviewCompleted ? "destructive" : "secondary"}
// // // //         >
// // // //           🛑 Stop Interview
// // // //         </Button> */}
// // // //       </div>

// // // //       {/* 💬 Transcript Messages */}
// // // //       <div className="transcript-messages">
// // // //         {transcript.length === 0 ? (
// // // //           <p className="transcript-empty">
// // // //             No conversation yet. Click <strong>🎯 Start / Next Question</strong> to begin.
// // // //           </p>
// // // //         ) : (
// // // //           transcript.map((msg, idx) => (
// // // //             <div
// // // //               key={idx}
// // // //               className={`transcript-message-row ${msg.sender === "ai" ? "ai-row" : "user-row"}`}
// // // //             >
// // // //               <div
// // // //                 className={`transcript-message ${msg.sender === "ai" ? "ai-message" : "user-message"}`}
// // // //               >
// // // //                 <div className="message-header">
// // // //                   <strong>{msg.sender === "ai" ? "AI Interviewer" : "Candidate"}:</strong>
// // // //                 </div>
// // // //                 <div className="message-content">{msg.text}</div>
// // // //               </div>
// // // //             </div>
// // // //           ))
// // // //         )}
// // // //         <div ref={transcriptEndRef} />
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default TranscriptPanel;
// // // // file: src/components/TranscriptPanel.jsx
// // // import React, { useState, useEffect, useRef } from "react";
// // // import { Button } from "@/components/ui/button";
// // // import "./TranscriptPanel.css";
// // // import { API_BASE } from "@/utils/constants";
// // // import { v4 as uuidv4 } from "uuid";

// // // const TranscriptPanel = ({ transcript: incomingTranscript = [], candidateName = "Anonymous", jobDescription = "" }) => {
// // //   // Local transcript state (if you prefer to control from parent, adapt accordingly)
// // //   const [transcript, setTranscript] = useState(incomingTranscript || []);
// // //   const [recording, setRecording] = useState(false);
// // //   const [recorder, setRecorder] = useState(null);
// // //   // const [candidateId, setCandidateId] = useState(uuidv4());
// // //   const [interviewCompleted, setInterviewCompleted] = useState(false);
// // //   const transcriptEndRef = useRef(null);

// // //   useEffect(() => {
// // //     transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
// // //   }, [transcript]);

// // //   const speak = (text) => {
// // //     if (!text) return;
// // //     setTranscript((t) => [...t, { sender: "ai", text }]);
// // //     const utter = new SpeechSynthesisUtterance(text);
// // //     utter.rate = 1.05;
// // //     speechSynthesis.cancel();
// // //     speechSynthesis.speak(utter);
// // //   };

// // //   async function generateQuestion() {
// // //     if (!jobDescription.trim()) {
// // //       alert("Please enter or paste a Job Description first!");
// // //       return;
// // //     }
// // //     try {
// // //       const fd = new FormData();
// // //       fd.append("init", "true");
// // //       fd.append("candidate_name", candidateName || "Anonymous");
// // //       fd.append("job_description", jobDescription);
// // //       fd.append("candidate_id", candidateId);

// // //       const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, {
// // //         method: "POST",
// // //         body: fd,
// // //       });
// // //       const d = await r.json();

// // //       if (d.ok && d.next_question) {
// // //         if (d.candidate_id && d.candidate_id !== candidateId) setCandidateId(d.candidate_id);
// // //         const firstQ = d.next_question.trim();
// // //         setTranscript((t) => [...t, { sender: "ai", text: firstQ }]);
// // //         speak(firstQ);
// // //       } else {
// // //         alert("AI did not return a question. Try again.");
// // //       }
// // //     } catch (err) {
// // //       console.error("Error generating question:", err);
// // //       alert("Failed to start the interview. Check backend connection.");
// // //     }
// // //   }

// // //   async function startRecording() {
// // //     try {
// // //       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
// // //       const rec = new MediaRecorder(stream);
// // //       const chunks = [];

// // //       rec.ondataavailable = (e) => chunks.push(e.data);
// // //       rec.onstop = async () => {
// // //         const blob = new Blob(chunks, { type: "audio/webm" });
// // //         await sendAnswer(blob);
// // //         stream.getTracks().forEach((t) => t.stop());
// // //       };

// // //       rec.start();
// // //       setRecorder(rec);
// // //       setRecording(true);
// // //     } catch (err) {
// // //       console.error("Mic error:", err);
// // //       alert("Please allow microphone access to continue.");
// // //     }
// // //   }

// // //   function stopAndSend() {
// // //     if (recorder) {
// // //       recorder.stop();
// // //       setRecording(false);
// // //     }
// // //   }

// // //   async function sendAnswer(blob) {
// // //     try {
// // //       const fd = new FormData();
// // //       fd.append("audio", blob);
// // //       fd.append("candidate_name", candidateName || "Anonymous");
// // //       fd.append("job_description", jobDescription);
// // //       fd.append("candidate_id", candidateId);

// // //       const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, {
// // //         method: "POST",
// // //         body: fd,
// // //       });

// // //       const d = await r.json();

// // //       if (d.ok && d.transcribed_text) {
// // //         setTranscript((t) => [...t, { sender: "user", text: d.transcribed_text }]);
// // //       }

// // //       if (d.next_question && !d.completed) speak(d.next_question);

// // //       if (d.completed) {
// // //         const finalMsg = d.final_message || "✅ Thank you for completing the interview. Please click Stop Interview to end your session.";
// // //         setTranscript((t) => [...t, { sender: "ai", text: finalMsg }]);
// // //         speak(finalMsg);
// // //         setRecording(false);
// // //         setInterviewCompleted(true);
// // //       }
// // //     } catch (err) {
// // //       console.error("Error sending answer:", err);
// // //       alert("Failed to send audio to backend.");
// // //     }
// // //   }

// // //   return (
// // //     <div className="transcript-panel">
// // //       <h3 className="transcript-heading">📝 Transcript</h3>
// // //       <div className="transcript-actions">
// // //         <Button onClick={generateQuestion} variant="outline" disabled={recording || interviewCompleted}>
// // //           🎯 Start / Next Question
// // //         </Button>

// // //         {!recording ? (
// // //           <Button onClick={startRecording} variant="default" disabled={interviewCompleted}>
// // //             🎙 Record Answer
// // //           </Button>
// // //         ) : (
// // //           <Button onClick={stopAndSend} variant="destructive">
// // //             ⏹ Stop & Send
// // //           </Button>
// // //         )}
// // //       </div>

// // //       <div className="transcript-messages">
// // //         {transcript.length === 0 ? (
// // //           <p className="transcript-empty">No conversation yet. Click <strong>🎯 Start / Next Question</strong> to begin.</p>
// // //         ) : (
// // //           transcript.map((msg, idx) => (
// // //             <div key={idx} className={`transcript-message-row ${msg.sender === "ai" ? "ai-row" : "user-row"}`}>
// // //               <div className={`transcript-message ${msg.sender === "ai" ? "ai-message" : "user-message"}`}>
// // //                 <div className="message-header"><strong>{msg.sender === "ai" ? "AI Interviewer" : "Candidate"}:</strong></div>
// // //                 <div className="message-content">{msg.text}</div>
// // //               </div>
// // //             </div>
// // //           ))
// // //         )}
// // //         <div ref={transcriptEndRef} />
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default TranscriptPanel;
// // import React, { useState, useEffect, useRef } from "react";
// // import { Button } from "@/components/ui/button";
// // import { API_BASE } from "@/utils/constants";

// // export default function TranscriptPanel({ candidateName = "Anonymous", candidateId = null, jobDescription = "" }) {
// //   const [transcript, setTranscript] = useState([]);
// //   const [recording, setRecording] = useState(false);
// //   const [recorder, setRecorder] = useState(null);
// //   const [interviewCompleted, setInterviewCompleted] = useState(false);

// //   const transcriptEndRef = useRef(null);

// //   useEffect(() => {
// //     transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [transcript]);

// //   // ---------------------------
// //   // 🔊 Speak helper
// //   // ---------------------------
// //   const speak = (text) => {
// //     if (!text) return;
// //     const u = new SpeechSynthesisUtterance(text);
// //     speechSynthesis.cancel();
// //     speechSynthesis.speak(u);
// //   };

// //   // ---------------------------
// //   // 🎯 Start / Next Question
// //   // ---------------------------
// //   async function generateQuestion() {
// //     if (!jobDescription.trim()) {
// //       alert("Please paste job description in the left side before starting.");
// //       return;
// //     }

// //     const fd = new FormData();
// //     fd.append("init", "true");
// //     fd.append("candidate_name", candidateName);
// //     fd.append("job_description", jobDescription);
// //     if (candidateId) fd.append("candidate_id", candidateId);

// //     console.log("📨 [TranscriptPanel] generateQuestion:", { candidateName, candidateId });

// //     try {
// //       const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, {
// //         method: "POST",
// //         body: fd,
// //       });
// //       const d = await r.json();
// //       console.log("📩 [TranscriptPanel] generateQuestion response:", d);

// //       if (d.ok && d.next_question) {
// //         setTranscript((t) => [...t, { sender: "ai", text: d.next_question }]);
// //         speak(d.next_question);
// //       } else {
// //         alert("AI did not return a question.");
// //       }
// //     } catch (err) {
// //       console.error("❌ generateQuestion error:", err);
// //       alert("Error generating next question.");
// //     }
// //   }

// //   // ---------------------------
// //   // 🎙 Start Recording
// //   // ---------------------------
// //   async function startRecording() {
// //     try {
// //       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
// //       const rec = new MediaRecorder(stream);
// //       const chunks = [];

// //       rec.ondataavailable = (e) => chunks.push(e.data);

// //       rec.onstop = async () => {
// //         const blob = new Blob(chunks, { type: "audio/webm" });
// //         await sendAnswer(blob);
// //         stream.getTracks().forEach((t) => t.stop());
// //       };

// //       rec.start();
// //       setRecorder(rec);
// //       setRecording(true);
// //     } catch (err) {
// //       console.error("🎤 Mic error:", err);
// //       alert("Please allow microphone access.");
// //     }
// //   }

// //   // ---------------------------
// //   // ⏹ Stop & Send
// //   // ---------------------------
// //   function stopAndSend() {
// //     if (recorder) {
// //       recorder.stop();
// //       setRecording(false);
// //     }
// //   }

// //   // ---------------------------
// //   // 🔁 Send audio to backend
// //   // ---------------------------
// //   async function sendAnswer(blob) {
// //     const fd = new FormData();
// //     fd.append("audio", blob);
// //     fd.append("candidate_name", candidateName);
// //     fd.append("job_description", jobDescription);
// //     if (candidateId) fd.append("candidate_id", candidateId);

// //     console.log("📨 [TranscriptPanel] sendAnswer:", { candidateName, candidateId });

// //     try {
// //       const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, {
// //         method: "POST",
// //         body: fd,
// //       });
// //       const d = await r.json();
// //       console.log("📩 [TranscriptPanel] sendAnswer response:", d);

// //       // User transcript
// //       if (d.ok && d.transcribed_text) {
// //         setTranscript((t) => [...t, { sender: "user", text: d.transcribed_text }]);
// //       }

// //       // Next question
// //       if (d.next_question && !d.completed) {
// //         setTranscript((t) => [...t, { sender: "ai", text: d.next_question }]);
// //         speak(d.next_question);
// //       }

// //       // Completion
// //       if (d.completed) {
// //         const msg = d.final_message || "Interview completed.";
// //         setTranscript((t) => [...t, { sender: "ai", text: msg }]);
// //         speak(msg);
// //         setInterviewCompleted(true);
// //       }
// //     } catch (err) {
// //       console.error("❌ sendAnswer error:", err);
// //       alert("Failed to send audio.");
// //     }
// //   }

// //   return (
// //     <div className="transcript-panel">
// //       <h3 className="transcript-heading">📝 Transcript</h3>

// //       {/* Buttons */}
// //       <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
// //         <Button
// //           onClick={generateQuestion}
// //           disabled={recording || interviewCompleted}
// //         >
// //           🎯 Start / Next Question
// //         </Button>

// //         {!recording ? (
// //           <Button
// //             onClick={startRecording}
// //             disabled={interviewCompleted}
// //           >
// //             🎙 Record
// //           </Button>
// //         ) : (
// //           <Button variant="destructive" onClick={stopAndSend}>
// //             ⏹ Stop & Send
// //           </Button>
// //         )}
// //       </div>

// //       {/* Transcript Feed */}
// //       <div
// //         style={{
// //           marginTop: 12,
// //           maxHeight: 420,
// //           overflowY: "auto",
// //           padding: 10,
// //           border: "1px solid #ddd",
// //           borderRadius: 6,
// //           background: "#fafafa",
// //         }}
// //       >
// //         {transcript.length === 0 ? (
// //           <div style={{ opacity: 0.6 }}>No conversation yet.</div>
// //         ) : (
// //           transcript.map((m, i) => (
// //             <div
// //               key={i}
// //               style={{
// //                 marginBottom: 10,
// //                 padding: 8,
// //                 background: m.sender === "ai" ? "#eef7ff" : "#f7ffe9",
// //                 borderRadius: 6,
// //               }}
// //             >
// //               <strong>{m.sender === "ai" ? "AI" : "You"}:</strong> {m.text}
// //             </div>
// //           ))
// //         )}
// //         <div ref={transcriptEndRef} />
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { API_BASE } from "@/utils/constants";

// export default function TranscriptPanel({ candidateName = "Anonymous", candidateId = null, jobDescription = "" }) {
//   const [transcript, setTranscript] = useState([]);
//   const [recording, setRecording] = useState(false);
//   const [recorder, setRecorder] = useState(null);
//   const [interviewCompleted, setInterviewCompleted] = useState(false);

//   const transcriptEndRef = useRef(null);

//   useEffect(() => {
//     transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [transcript]);

//   // ---------------------------
//   // 🔊 Speak helper
//   // ---------------------------
//   const speak = (text) => {
//     if (!text) return;
//     const u = new SpeechSynthesisUtterance(text);
//     speechSynthesis.cancel();
//     speechSynthesis.speak(u);
//   };

//   // ---------------------------
//   // 🎯 Start / Next Question
//   // ---------------------------
//   async function generateQuestion() {
//     if (!jobDescription.trim()) {
//       alert("Please paste job description in the left side before starting.");
//       return;
//     }

//     const fd = new FormData();
//     fd.append("init", "true");
//     fd.append("candidate_name", candidateName);
//     fd.append("job_description", jobDescription);
//     if (candidateId) fd.append("candidate_id", candidateId);

//     console.log("📨 [TranscriptPanel] generateQuestion:", { candidateName, candidateId });

//     try {
//       const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, {
//         method: "POST",
//         body: fd,
//       });
//       const d = await r.json();
//       console.log("📩 [TranscriptPanel] generateQuestion response:", d);

//       if (d.ok && d.next_question) {
//         setTranscript((t) => [...t, { sender: "ai", text: d.next_question }]);
//         speak(d.next_question);
//       } else {
//         alert("AI did not return a question.");
//       }
//     } catch (err) {
//       console.error("❌ generateQuestion error:", err);
//       alert("Error generating next question.");
//     }
//   }

//   // ---------------------------
//   // 🎙 Start Recording
//   // ---------------------------
//   async function startRecording() {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const rec = new MediaRecorder(stream);
//       const chunks = [];

//       rec.ondataavailable = (e) => chunks.push(e.data);

//       rec.onstop = async () => {
//         const blob = new Blob(chunks, { type: "audio/webm" });
//         await sendAnswer(blob);
//         stream.getTracks().forEach((t) => t.stop());
//       };

//       rec.start();
//       setRecorder(rec);
//       setRecording(true);
//     } catch (err) {
//       console.error("🎤 Mic error:", err);
//       alert("Please allow microphone access.");
//     }
//   }

//   // ---------------------------
//   // ⏹ Stop & Send
//   // ---------------------------
//   function stopAndSend() {
//     if (recorder) {
//       recorder.stop();
//       setRecording(false);
//     }
//   }

//   // ---------------------------
//   // 🔁 Send audio to backend
//   // ---------------------------
//   async function sendAnswer(blob) {
//     const fd = new FormData();
//     fd.append("audio", blob);
//     fd.append("candidate_name", candidateName);
//     fd.append("job_description", jobDescription);
//     if (candidateId) fd.append("candidate_id", candidateId);

//     console.log("📨 [TranscriptPanel] sendAnswer:", { candidateName, candidateId });

//     try {
//       const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, {
//         method: "POST",
//         body: fd,
//       });
//       const d = await r.json();
//       console.log("📩 [TranscriptPanel] sendAnswer response:", d);

//       // User transcript
//       if (d.ok && d.transcribed_text) {
//         setTranscript((t) => [...t, { sender: "user", text: d.transcribed_text }]);
//       }

//       // Next question
//       if (d.next_question && !d.completed) {
//         setTranscript((t) => [...t, { sender: "ai", text: d.next_question }]);
//         speak(d.next_question);
//       }

//       // Completion
//       if (d.completed) {
//         const msg = d.final_message || "Interview completed.";
//         setTranscript((t) => [...t, { sender: "ai", text: msg }]);
//         speak(msg);
//         setInterviewCompleted(true);
//       }
//     } catch (err) {
//       console.error("❌ sendAnswer error:", err);
//       alert("Failed to send audio.");
//     }
//   }

//   return (
//     <div className="transcript-panel">
//       <h3 className="transcript-heading">📝 Transcript</h3>

//       {/* Buttons */}
//       <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
//         <Button
//           onClick={generateQuestion}
//           disabled={recording || interviewCompleted}
//         >
//           🎯 Start / Next Question
//         </Button>

//         {!recording ? (
//           <Button
//             onClick={startRecording}
//             disabled={interviewCompleted}
//           >
//             🎙 Record
//           </Button>
//         ) : (
//           <Button variant="destructive" onClick={stopAndSend}>
//             ⏹ Stop & Send
//           </Button>
//         )}
//       </div>

//       {/* Transcript Feed */}
//       <div
//         style={{
//           marginTop: 12,
//           maxHeight: 420,
//           overflowY: "auto",
//           padding: 10,
//           border: "1px solid #ddd",
//           borderRadius: 6,
//           background: "#fafafa",
//         }}
//       >
//         {transcript.length === 0 ? (
//           <div style={{ opacity: 0.6 }}>No conversation yet.</div>
//         ) : (
//           transcript.map((m, i) => (
//             <div
//               key={i}
//               style={{
//                 marginBottom: 10,
//                 padding: 8,
//                 background: m.sender === "ai" ? "#eef7ff" : "#f7ffe9",
//                 borderRadius: 6,
//               }}
//             >
//               <strong>{m.sender === "ai" ? "AI" : "You"}:</strong> {m.text}
//             </div>
//           ))
//         )}
//         <div ref={transcriptEndRef} />
//       </div>
//     </div>
//   );
// }
// src/components/TranscriptPanel.jsx
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/utils/constants";
import "./TranscriptPanel.css"

export default function TranscriptPanel({ candidateName = "Anonymous", candidateId = null, jobDescription = "" }) {
  const [transcript, setTranscript] = useState([]);
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const transcriptEndRef = useRef(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const speak = (text) => {
    if (!text) return;
    setTranscript((t) => [...t, { sender: "ai", text }]);
    const u = new SpeechSynthesisUtterance(text);
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  };

  async function generateQuestion() {
    if (!jobDescription.trim()) {
      alert("Please paste job description in the left panel.");
      return;
    }

    const fd = new FormData();
    fd.append("init", "true");
    fd.append("candidate_name", candidateName || "Anonymous");
    fd.append("job_description", jobDescription);
    if (candidateId) fd.append("candidate_id", candidateId);

    console.log("[TranscriptPanel] generateQuestion payload:", { candidateName, candidateId });
    try {
      const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, { method: "POST", body: fd });
      const d = await r.json();
      console.log("[TranscriptPanel] generateQuestion response:", d);
      if (d.ok && d.next_question) {
        setTranscript((t) => [...t, { sender: "ai", text: d.next_question }]);
        if (d.candidate_id) {
          console.log("[TranscriptPanel] backend returned candidate_id:", d.candidate_id);
        }
        speak(d.next_question);
      } else {
        alert("No question returned.");
      }
    } catch (err) {
      console.error("generateQuestion error:", err);
      alert("Failed to get next question.");
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      const chunks = [];
      rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        await sendAnswer(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      setRecorder(rec);
      setRecording(true);
    } catch (err) {
      console.error("Mic error:", err);
      alert("Please allow mic.");
    }
  }

  function stopAndSend() {
    if (recorder) {
      recorder.stop();
      setRecording(false);
    }
  }

  async function sendAnswer(blob) {
    const fd = new FormData();
    fd.append("audio", blob);
    fd.append("candidate_name", candidateName || "Anonymous");
    fd.append("job_description", jobDescription);
    if (candidateId) fd.append("candidate_id", candidateId);

    console.log("[TranscriptPanel] sendAnswer, candidate:", { candidateName, candidateId });
    try {
      const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, { method: "POST", body: fd });
      const d = await r.json();
      console.log("[TranscriptPanel] sendAnswer response:", d);

      if (d.ok && d.transcribed_text) {
        setTranscript((t) => [...t, { sender: "user", text: d.transcribed_text }]);
      }
      if (d.next_question && !d.completed) {
        setTranscript((t) => [...t, { sender: "ai", text: d.next_question }]);
        speak(d.next_question);
      }
      if (d.completed) {
        setTranscript((t) => [...t, { sender: "ai", text: d.final_message || "Interview complete." }]);
        setInterviewCompleted(true);
      }
    } catch (err) {
      console.error("sendAnswer error:", err);
      alert("Failed to send audio.");
    }
  }

  return (
    <div className="transcript-panel">
      <h3>Transcript</h3>
      
      <div className="transcript-actions">
        <button onClick={generateQuestion} disabled={recording || interviewCompleted}>
          Start / Next Question
        </button>
        {!recording ? (
          <button onClick={startRecording} disabled={interviewCompleted}>
            Record
          </button>
        ) : (
          <button onClick={stopAndSend} className="recording">
            Stop & Send
          </button>
        )}
      </div>

      <div className="transcript-messages">
        {transcript.length === 0 ? (
          <div className="transcript-empty">No conversation yet.</div>
        ) : (
          transcript.map((m, i) => (
            <div key={i} className={`transcript-message-row ${m.sender === "ai" ? "ai-row" : "user-row"}`}>
              <div className="transcript-message">
                <div className="message-header">{m.sender === "ai" ? "AI" : "You"}</div>
                {m.text}
              </div>
            </div>
          ))
        )}
        <div ref={transcriptEndRef} />
      </div>
    </div>
  );
}

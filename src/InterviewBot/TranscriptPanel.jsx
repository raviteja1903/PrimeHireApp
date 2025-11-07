import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import "./TranscriptPanel.css";
import { API_BASE } from "@/utils/constants";
import { v4 as uuidv4 } from "uuid";

const TranscriptPanel = ({
  onStopInterview,
  candidateName,
  candidateId,
  jobDescription = "",
}) => {
  const [transcript, setTranscript] = useState([]);
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const transcriptEndRef = useRef(null);
  // const [candidateId, setCandidateId] = useState(uuidv4());

  // Auto-scroll to bottom when new message added
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // 🔊 Speak + Append to transcript
  const speak = (text) => {
    if (!text) return;
    setTranscript((t) => [...t, { sender: "ai", text }]);
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.05;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  };

  // 🎯 Ask first question
  async function generateQuestion() {
    console.log(
      "🎯 TranscriptPanel: sending candidateId to backend:",
      candidateId
    );
    if (!jobDescription.trim()) {
      alert("Paste Job Description first!");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("init", "true");
      fd.append("candidate_name", candidateName || "Anonymous");
      fd.append("job_description", jobDescription);
      fd.append("candidate_id", candidateId); // ✅ send same ID

      const r = await fetch(`${API_BASE}/mcp/interview/process-answer`, {
        method: "POST",
        body: fd,
      });

      const d = await r.json();
      console.log("🧠 AI Question Response:", d);

      if (d.ok && d.next_question) {
        // ✅ store candidateId returned from backend (in case it generated a new one)
        console.log(
          "💡 TranscriptPanel: backend returned candidateId:",
          d.candidate_id
        );
        setCandidateId(d.candidate_id);

        // ✅ append first question to transcript
        setTranscript((t) => [...t, { sender: "ai", text: d.next_question }]);
        speak(d.next_question);
      } else {
        alert("AI did not return any question. Please try again.");
      }
    } catch (err) {
      console.error("❌ Error generating question:", err);
    }
  }

  // 🎙️ Start Recording
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
      console.error("🎙️ Mic permission or recording error:", err);
      alert("Please allow microphone access.");
    }
  }

  // ⏹ Stop & Send
  function stopAndSend() {
    if (recorder) {
      recorder.stop();
      setRecording(false);
    }
  }

  // 🚀 Send Answer to Backend
  async function sendAnswer(blob) {
    console.log("🎙️ Sending answer for candidateId:", candidateId);
    try {
      const fd = new FormData();
      fd.append("audio", blob);
      fd.append("candidate_name", candidateName || "Anonymous");
      fd.append("job_description", jobDescription);
      fd.append("candidate_id", candidateId); // <--- must send

      const r = await fetch(`${API_BASE}/mcp/interview/process-answer`, {
        method: "POST",
        body: fd,
      });

      const d = await r.json();
      console.log("🧩 Backend Response:", d);

      if (d.ok && d.transcribed_text) {
        setTranscript((t) => [
          ...t,
          { sender: "user", text: d.transcribed_text },
        ]);
      }

      if (d.next_question) speak(d.next_question);
    } catch (err) {
      console.error("❌ Error sending answer:", err);
      alert("Failed to send audio to backend.");
    }
  }

  return (
    <div className="transcript-panel">
      <h3 className="transcript-heading">📝 Transcript</h3>

      {/* 🎯 Action Buttons */}
      <div className="transcript-actions">
        <Button
          onClick={generateQuestion}
          variant="outline"
          disabled={recording}
        >
          🎯 Start / Next Question
        </Button>

        {!recording ? (
          <Button onClick={startRecording} variant="default">
            🎙️ Record Answer
          </Button>
        ) : (
          <Button onClick={stopAndSend} variant="destructive">
            ⏹ Stop & Send
          </Button>
        )}

        {/* <Button onClick={onStopInterview} variant="secondary">
          🛑 Stop Interview
        </Button> */}
      </div>

      {/* 💬 Transcript Messages */}
      <div className="transcript-messages">
        {transcript.length === 0 ? (
          <p className="transcript-empty">
            No conversation yet. Start the interview to see messages here.
          </p>
        ) : (
          transcript.map((msg, idx) => (
            <div
              key={idx}
              className={`transcript-message-row ${
                msg.sender === "ai" ? "ai-row" : "user-row"
              }`}
            >
              <div
                className={`transcript-message ${
                  msg.sender === "ai" ? "ai-message" : "user-message"
                }`}
              >
                <div className="message-header">
                  <strong>
                    {msg.sender === "ai" ? "AI Interviewer" : "Candidate"}:
                  </strong>
                </div>
                <div className="message-content">{msg.text}</div>
              </div>
            </div>
          ))
        )}
        <div ref={transcriptEndRef} />
      </div>
    </div>
  );
};

export default TranscriptPanel;

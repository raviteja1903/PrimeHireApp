import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import TranscriptPanel from "./TranscriptPanel";
import { API_BASE } from "@/utils/constants";
import "./WebcamRecorder.css";
import logo from "../assets/primehire_logo.png";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const alertBeep = new Audio(
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YRAAAAAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA"
);

export default function WebcamRecorder() {
  const navigate = useNavigate();
  const location = useLocation();

  const passedCandidateId = location.state?.candidateId || null;
  const passedCandidateName = location.state?.candidateName || "";

  const [candidateId, setCandidateId] = useState(() => passedCandidateId || uuidv4());
  const [candidateName, setCandidateName] = useState(passedCandidateName);
  const [started, setStarted] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [transcript, setTranscript] = useState([]);
  const [anomaly, setAnomaly] = useState("");
  const [lastAnomaly, setLastAnomaly] = useState("");

  const videoRef = useRef();
  const canvasRef = useRef();
  const frameCanvas = useRef();
  const boxes = useRef([]);

  // -------------------------------
  // Tab switch detection
  // -------------------------------
  useEffect(() => {
    const handle = () => {
      if (started && document.hidden) {
        alertBeep.play().catch(() => {});
        setTranscript((t) => [
          ...t,
          { sender: "ai", text: "⚠ Tab switch detected." },
        ]);
        alert("⚠ Do not switch tabs during interview!");
      }
    };
    document.addEventListener("visibilitychange", handle);
    return () => document.removeEventListener("visibilitychange", handle);
  }, [started]);

  // -------------------------------
  // Webcam stream start
  // -------------------------------
  useEffect(() => {
    if (!started) return;

    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      frameCanvas.current = document.createElement("canvas");
      startFrameLoop();
    })();
  }, [started]);

  // -------------------------------
  // Draw boxes loop
  // -------------------------------
  useEffect(() => {
    const loop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      boxes.current.forEach((b) => {
        ctx.strokeStyle = "lime";
        ctx.lineWidth = 2;
        ctx.strokeRect(b.x, b.y, b.w, b.h);
      });
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }, []);

  // -------------------------------
  // Send frame for monitoring
  // -------------------------------
  async function sendFrame() {
    if (!videoRef.current) return;
    const canvas = frameCanvas.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    const blob = await new Promise((res) => canvas.toBlob(res));

    const fd = new FormData();
    fd.append("candidate_name", candidateName);
    fd.append("frame", blob, "f.jpg");

    const r = await fetch(`${API_BASE}/mcp/interview/face-monitor`, {
      method: "POST",
      body: fd,
    });
    const d = await r.json();

    boxes.current = d.boxes || [];

    if (d.anomalies && d.anomalies.length > 0) {
      const msgs = d.anomalies.map((a) => `⚠ ${a.msg}`).join(" | ");
      if (msgs !== lastAnomaly) {
        setAnomaly(msgs);
        setLastAnomaly(msgs);
        setTranscript((t) => [...t, { sender: "ai", text: msgs }]);
        alertBeep.play().catch(() => {});
      }
    } else {
      setAnomaly("");
      setLastAnomaly("");
    }
  }

  // -------------------------------
  // Frame loop
  // -------------------------------
  function startFrameLoop() {
    const tick = async () => {
      while (started) {
        await sendFrame();
        await new Promise((r) => setTimeout(r, 400));
      }
    };
    tick();
  }

  // -------------------------------
  // Stop Interview
  // -------------------------------
  const handleStopInterview = async () => {
    setStarted(false);
    document.exitFullscreen().catch(() => {});

    try {
      const fd = new FormData();
      fd.append("candidate_name", candidateName);
      fd.append("candidate_id", candidateId);
      fd.append("job_description", jobDescription);

      const r = await fetch(`${API_BASE}/mcp/interview/evaluate-transcript`, {
        method: "POST",
        body: fd,
      });
      const d = await r.json();

      if (d.ok) {
        navigate("/certificatedata", {
          state: {
            scores: d.scores,
            candidateName: d.candidateName,
            candidateId: d.candidateId,
          },
        });
      } else {
        console.error("Evaluation failed:", d.error);
        alert("Evaluation failed: " + d.error);
      }
    } catch (err) {
      console.error("Error fetching evaluation:", err);
      alert("Error fetching evaluation: " + err.message);
    }
  };

  // -------------------------------
  // Start Interview
  // -------------------------------
  const handleStartInterview = async () => {
    setStarted(true);
    document.documentElement.requestFullscreen().catch(() => {});
    setTranscript((t) => [
      ...t,
      { sender: "ai", text: "✅ Interview started. Focus on the camera." },
    ]);

    try {
      const fd = new FormData();
      fd.append("init", "true");
      fd.append("candidate_name", candidateName);
      fd.append("job_description", jobDescription);
      fd.append("candidate_id", candidateId);

      const r = await fetch(`${API_BASE}/mcp/interview/process-answer`, {
        method: "POST",
        body: fd,
      });
      const d = await r.json();

      if (d.ok && d.next_question) {
        setCandidateId(d.candidate_id);
        setTranscript((t) => [...t, { sender: "ai", text: d.next_question }]);
        const utter = new SpeechSynthesisUtterance(d.next_question);
        speechSynthesis.speak(utter);
      }
    } catch (err) {
      console.error("Error starting first question:", err);
    }
  };

 
  return (
    <div className={`interview-full ${started ? "active" : ""}`}>
      {!started ? (
        <div className="intro-container">
          <div className="navbar">
           <Link to={"/"}><img src={logo} alt="PrimeHire" className="nav-logo" /></Link> 
            {/* <h1 className="nav-title">PrimeHire</h1> */}
          </div>

          <div className="intro-box">
            <h2>AI Interview Setup</h2>
            <p>Paste your Job Description to begin the interview.</p>
            <textarea
              placeholder="Paste Job Description..."
              className="jd-box"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <Button className="start-btn" onClick={handleStartInterview}>
              🎥 Start Interview
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="video-area">
            <button className="stop-btn" onClick={handleStopInterview}>
              ⏹ Stop Interview
            </button>
            <video ref={videoRef} autoPlay muted className="vid" />
            <canvas ref={canvasRef} className="overlay" />
            {anomaly && (
              <div className="anomaly-list">
                {anomaly.split(" | ").map((msg, i) => (
                  <div key={i} className="anomaly-item">
                    {msg}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="right-panel">
            <TranscriptPanel
              transcript={transcript}
              candidateName={candidateName}
              candidateId={candidateId}
              jobDescription={jobDescription}
            />
          </div>
        </>
      )}
    </div>
  );
}

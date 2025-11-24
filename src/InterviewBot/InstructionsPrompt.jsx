 
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/primehire_logo.png";
import "./InstructionsPrompt.css";

export default function InstructionsPrompt() {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const candidateName = location.state?.candidateName || null;
  const candidateId = location.state?.candidateId || null;
  const jd_id = location.state?.jd_id || null;
  const jd_text = location.state?.jd_text || "";

  console.log("📥 InstructionsPrompt received:", {
    candidateName,
    candidateId,
    jd_id,
    jd_text,
  });

  const handleStart = () => {
    if (!candidateName || !candidateId) {
      alert("❌ Missing candidate details. Please go back and validate again.");
      return;
    }

    navigate("/webcam-recorder", {
      state: {
        candidateName,
        candidateId,
        jd_id,
        jd_text,
      },
    });
  };

  return (
    <div className="instructions-wrapper">
      <nav className="instructions-navbar">
        <img src={logo} alt="PrimeHire Logo" className="navbar-logo" />
      </nav>

     <Card className="instructions-card">
        <CardHeader className="instructions-header">
          <CardTitle className="instructions-title">
            Interview Instructions
          </CardTitle>
        </CardHeader>

        <CardContent className="card-content">
          <p>Please read and accept the instructions before continuing.</p>

          <ul className="instructions-list">
            <li>Interview will be recorded (video + audio + responses).</li>
            <li>
              During the interview, you can change the job position without
              ending the interview.
            </li>
            <li>
              Your system keeps complete records of the candidate’s interview —
              from scheduling to completion — so HR can monitor everything
              easily.
            </li>
            <li>Your data will be used for evaluation purposes.</li>
            <li>Do not share personal or sensitive information.</li>
            <li>Give honest answers without external help.</li>
            <li>Arrive 10-15 min early; 5 min for online interview.</li>
            <li>Ensure camera, mic, and internet are working properly.</li>
          </ul>

          <div className="confirm-checkbox">
            <Checkbox
              id="agree-checkbox"
              checked={checked}
              onCheckedChange={setChecked}
            />

            <label htmlFor="agree-checkbox" className="checkbox-label">
              I agree to the above instructions.
            </label>
          </div>
        </CardContent>

        <CardFooter>
          <Button disabled={!checked} onClick={handleStart} className="start-btn">
            Start Interview
          </Button>
        </CardFooter>
      </Card>

      <div style={{ marginTop: 20, opacity: 0.8 }}>
        Debug: {candidateName} | {candidateId} | JD_ID: {jd_id}
      </div>
    </div>
  );
}

// import React from 'react'

// const ResumeUpload = () => {

//       const uploadResumes = async (files) => {
//         if (!files || files.length === 0) return;
//         setIsLoading(true);
    
//         try {
//           const formData = new FormData();
//           Array.from(files).forEach((file) => formData.append("files", file));
    
//           const response = await fetch(`${API_BASE}/mcp/tools/resume/upload`, {
//             method: "POST",
//             body: formData,
//           });
    
//           if (!response.ok) {
//             const text = await response.text();
//             console.error("Backend response:", text);
//             throw new Error(`Status ${response.status} - ${text}`);
//           }
    
//           const data = await response.json();
//           const resumes = data.uploaded_files || []; // ✅ fixed key name
    
//           console.log("📄 Resumes received:", resumes);
    
//           if (resumes.length === 0) {
//             setMessages((prev) => [
//               ...prev,
//               { role: "assistant", content: "No resumes could be extracted from uploaded files." },
//             ]);
//           } else {
//             // Append the assistant message with parsed resume data
//             setMessages((prev) => [
//               ...prev,
//               {
//                 role: "assistant",
//                 type: "resume_table",
//                 data: resumes.map((r) => ({
//                   name: r.metadata?.full_name || "Unknown",
//                   email: r.metadata?.email || "-",
//                   phone: r.metadata?.phone || "-",
//                   skills: r.metadata?.top_skills
//                     ? r.metadata.top_skills.split(",").map((s) => s.trim())
//                     : [],
//                   title: r.metadata?.current_title || "",
//                   company: r.metadata?.current_company || "",
//                   location: r.metadata?.location || "",
//                 })),
//               },
//             ]);
//           }
//         } catch (err) {
//           console.error("❌ Failed to upload resumes:", err);
//           setMessages((prev) => [
//             ...prev,
//             { role: "assistant", content: "❌ Failed to upload resumes. Try again." },
//           ]);
//         } finally {
//           setIsLoading(false);
//         }
//       };

//        const handleFeatureClick = (feature) => {
//           console.log("🧭 Feature clicked:", feature);
//           setSelectedFeature(feature);
      
//           // Optional: Clear chat when switching feature
//           setMessages([]);
      
//           // You can add any feature-specific initialization here:
//           if (feature === "ZohoBridge") {
//             console.log("🔗 ZohoBridge selected. Showing Zoho login button.");
//           }
      
//           if (feature === "MailMind") {
//             console.log("🧠 MailMind selected. Showing MailMind UI.");
//           }
//           if (feature === "LinkedInPoster") {
//             // show LinkedIn connect + post JD buttons
//             console.log("💼 LinkedIn Poster selected.");
//           }
//           if (feature === "PrimeHireBrain") {
//             // show LinkedIn connect + post JD buttons
//             console.log("🤖 PrimeHire Brain selected.");
//           }
//         };
      
//         const fetchStoredResumes = async () => {
//           setIsLoading(true);
//           try {
//             const response = await fetch(`${API_BASE}/mcp/tools/resume/list`);
//             if (!response.ok) throw new Error("Failed to fetch resumes");
//             const data = await response.json();
//             const resumes = data.resumes || [];
      
//             setMessages((prev) => [
//               ...prev,
//               { role: "assistant", type: "resume_table", data: resumes },
//             ]);
//           } catch (err) {
//             console.error("❌ Failed to load resumes:", err);
//             setMessages((prev) => [
//               ...prev,
//               { role: "assistant", content: "❌ Failed to load stored candidates." },
//             ]);
//           } finally {
//             setIsLoading(false);
//           }
//         };
      
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default ResumeUpload
import React, { useState } from "react";
import { API_BASE } from "@/utils/constants";
import { useWebSocket } from "@/hooks/useWebSocket";
import ResumeTable from "@/components/chat/ResumeTable";

const ResumeUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [localResumes, setLocalResumes] = useState([]);
  const { messages, setMessages, handleSend } = useWebSocket();

  const latestResumeTable = [...messages].reverse().find((msg) => msg.type === "resume_table");

  const uploadResumes = async (files) => {
    if (!files?.length) return;
    setIsLoading(true);

    try {
      console.log("📂 Files selected:", files);
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("files", file));

      const response = await fetch(`${API_BASE}/mcp/tools/resume/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Backend response:", text);
        throw new Error(`Status ${response.status} - ${text}`);
      }

      const data = await response.json();
      console.log("📄 Backend response data:", data);

      const resumesRaw = data.uploaded_files || [];

      if (resumesRaw.length === 0) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "No resumes could be extracted." },
        ]);
        return;
      }

      const flattenedResumes = resumesRaw.map((r) => {
        const meta = r.metadata || {};
        return {
          name: meta.full_name || r.filename || "Unknown",
          email: meta.email || "-",
          phone: meta.phone || "-",
          skills: meta.top_skills ? meta.top_skills.split(",").map((s) => s.trim()) : [],
          experience: meta.years_of_experience ?? "-",
        };
      });

      console.log("✅ Flattened resumes:", flattenedResumes);

      // Update WebSocket + local
      setMessages((prev) => [
        ...prev.filter((msg) => msg.type !== "resume_table"),
        { role: "assistant", type: "resume_table", data: flattenedResumes },
      ]);

      setLocalResumes(flattenedResumes);

      handleSend({ type: "resume", data: flattenedResumes });
    } catch (err) {
      console.error("❌ Failed to upload resumes:", err);
      setMessages((prev) => [...prev, { role: "assistant", content: "❌ Failed to upload resumes. Try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const resumesToShow =
    latestResumeTable?.data?.length > 0 ? latestResumeTable.data : localResumes;

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">📄 Upload Resumes</h2>

      <input
        type="file"
        multiple
        onChange={(e) => uploadResumes(e.target.files)}
        className="border p-2 rounded"
      />

      {isLoading && <p className="mt-3 text-gray-500">Uploading...</p>}

      {resumesToShow?.length > 0 ? (
        <ResumeTable data={resumesToShow} index={0} />
      ) : (
        !isLoading && <p className="text-gray-400 mt-4">No resumes uploaded yet.</p>
      )}
    </div>
  );
};

export default ResumeUpload;

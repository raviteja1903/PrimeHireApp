import React from "react";
import "./ResumeTable.css";

const ResumeTable = ({ data, index }) => {
  console.log("🚨 ResumeTable data:", data);

  const resumes = Array.isArray(data) ? data : [];

  if (resumes.length === 0) {
    return <div className="empty-state">No resumes available.</div>;
  }

  return (
    <div key={index} className="resume-box">
      {/* Header */}
      <h3 className="resume-title">
        📄 Uploaded Resumes ({resumes.length})
      </h3>

      {/* Table */}
      <table className="resume-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Title</th>
            <th>Company</th>
            <th>Experience</th>
            <th>Location</th>
            <th>Contact</th>
            <th>Skills</th>
          </tr>
        </thead>
        <tbody>
          {resumes.map((r, i) => (
            <tr key={i}>
              <td className="name-cell">
                {r.metadata?.full_name || "N/A"}
              </td>
              <td>{r.metadata?.current_title || "N/A"}</td>
              <td>{r.metadata?.current_company || "N/A"}</td>
              <td>{r.metadata?.years_of_experience ?? "N/A"}</td>
              <td>{r.metadata?.location || "N/A"}</td>
              <td>
                <div className="contact-info">
                  <span>{r.metadata?.email}</span>
                  <span>{r.metadata?.phone}</span>
                </div>
              </td>
              <td className="skills-cell">
                {r.metadata?.top_skills || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResumeTable;

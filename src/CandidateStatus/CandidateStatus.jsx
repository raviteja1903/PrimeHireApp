import React, { useState } from "react";
import "./CandidateStatus.css";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Download, MoreVertical } from "lucide-react";
import logo from "../assets/primehire_logo.png";
import { Link } from "react-router-dom";
 

ChartJS.register(ArcElement, Tooltip, Legend);

const CandidateStatus = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const statusData = {
    labels: [
      "Disconnected",
      "Not Started",
      "Blocked",
      "Completed",
      "In Progress",
      "Test Stopped",
      "Yet To Start",
    ],
    datasets: [
      {
        data: [4, 6, 1, 12, 1, 1, 18],
        backgroundColor: [
          "#9da9c9",
          "#e4e7eb",
          "#c0392b",
          "#2ecc71",
          "#1e90ff",
          "#7d4db5",
          "#0a2d5c",
        ],
        borderWidth: 0,
      },
    ],
  };

  const performanceData = {
    labels: ["Excellent (7)", "Poor (2)", "Average (7)", "Good (1)", "Below Average"],
    datasets: [
      {
        data: [7, 2, 7, 1, 0],
        backgroundColor: ["#0E90E0", "#DB3C7F", "#18A999", "#0FB89A", "#5641A6"],
        borderWidth: 0,
      },
    ],
  };

  const testTakers = [
    { id: 1, name: "j12", email: "j12@mettl.com", status: "Completed", totalScore: 20, sectionScores: [2, 6, 8, 4] },
    { id: 2, name: "jasleen", email: "jasleen.sandhu@mettl.com", status: "Completed", totalScore: 20, sectionScores: [2, 6, 8, 4] },
    { id: 3, name: "abc", email: "abc@gmail.com", status: "Completed", totalScore: 20, sectionScores: [2, 6, 8, 4] },
  ];

  const filteredTestTakers = testTakers.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="candidate-container">
      {/* Top Logo */}
      <Link to="/">
        <div className="top-header">
          <img src={logo} alt="Logo" className="top-logo" />
        </div>
      </Link>

      {/* Top Card Section */}
      <div className="top-cards">
        {/* Test Overview */}
        <div className="card">
          <h4>Test Overview</h4>
          <div className="card-stats">
            <div>
              <p>Total Test Links</p>
              <h2>14</h2>
            </div>
            <div>
              <p>Total Test-Takers</p>
              <h2>41</h2>
            </div>
          </div>
          <p className="sub-info">Reports: 17 / 41</p>
        </div>

        {/* Status Summary */}
        <div className="card">
          <div className="flex-between">
            <h4>Status Summary</h4>
            <span className="total-count">41 Total Test-Takers</span>
          </div>
          <div className="chart-box">
            <Doughnut
              data={statusData}
              options={{ cutout: "65%", plugins: { legend: { display: false } } }}
            />
          </div>

          {/* STATUS LEGEND */}
          <div className="status-legend">
            <div className="legend-item"><span className="legend-dot disconnected"></span><p>Disconnected (4)</p></div>
            <div className="legend-item"><span className="legend-dot not-started"></span><p>Not started (6)</p></div>
            <div className="legend-item"><span className="legend-dot in-progress"></span><p>In-progress (1)</p></div>
            <div className="legend-item"><span className="legend-dot test-stopped"></span><p>Test stopped (1)</p></div>
            <div className="legend-item"><span className="legend-dot blocked"></span><p>Blocked (1)</p></div>
            <div className="legend-item"><span className="legend-dot completed"></span><p>Completed (12)</p></div>
            <div className="legend-item"><span className="legend-dot yet"></span><p>Yet to start (18)</p></div>
          </div>
        </div>

        {/* Performance Category */}
        <div className="card performance-card">
          <div className="flex-between"><h4>Performance Category</h4></div>
          <div className="performance-chart-box">
            <Doughnut
              data={performanceData}
              options={{
                cutout: "65%",
                plugins: {
                  legend: {
                    display: true,
                    position: "bottom",
                    labels: { usePointStyle: true, pointStyle: "circle", padding: 15, font: { size: 12 } },
                  },
                },
              }}
            />
            <div className="doughnut-center">
              <h2>17</h2>
              <p>Reports</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="table-header">
        <h4>Test-Takers List</h4>
        <p>41 Test-Takers</p>
      </div>

      {/* Table Controls */}
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn" onClick={() => setSearchTerm("")}>Reset</button>
        <button className="btn download-btn"><Download size={16} /> Download</button>
      </div>

      {/* Table */}
      <table className="test-table">
        <thead>
          <tr>
            <th>Name & Email</th>
            <th>Overall Status</th>
            <th>Detailed Status</th>
            <th>Total Score</th>
            <th>Section Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTestTakers.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="user-info">
                  <span className="user-icon">{item.name.charAt(0)}</span>
                  <div>
                    <strong>
                      <Link to={`/candidate/${item.id}`} className="user-link">{item.name}</Link>
                    </strong>
                    <p>
                      <Link to={`/candidate/${item.id}`} className="user-link">{item.email}</Link>
                    </p>
                  </div>
                </div>
              </td>
              <td><span className="status-tag">{item.status}</span></td>
              <td>Test-taker Completed</td>
              <td>{item.totalScore}</td>
              <td>{item.sectionScores.join("  ")}</td>
              <td><MoreVertical size={16} className="action-icon" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateStatus;

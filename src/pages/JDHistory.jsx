// JDHistory.jsx (With Delete Only Candidate Match Feature)

import React, { useEffect, useState } from "react";
import { Copy, Eye, RefreshCcw, PlusSquare, Edit, Send, Trash2 } from "lucide-react";
import { API_BASE } from "@/utils/constants";
import "./JDHistory.css";

const JDHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selected, setSelected] = useState(null);

    // Matcher modal state
    const [matcherJD, setMatcherJD] = useState(null);
    const [matcherLoading, setMatcherLoading] = useState(false);

    // Load JD History
    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/history`);
            const data = await res.json();
            setHistory(data.history || []);
            localStorage.setItem("jdHistory", JSON.stringify(data.history || []));
        } catch (e) {
            console.error("Failed:", e);
            const local = localStorage.getItem("jdHistory");
            if (local) setHistory(JSON.parse(local));
        }
        setLoading(false);
    };

    // Get single JD
    const fetchSingleJD = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/history/${id}`);
            return await res.json();
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    // Open Matcher
    const openMatcher = async (id) => {
        setMatcherLoading(true);
        try {
            await fetch(`${API_BASE}/mcp/tools/jd_history/jd/match_profiles/${id}`, { method: "POST" });
            const data = await fetchSingleJD(id);

            const jdData = {
                ...data,
                matches: data.matches || []
            };

            setMatcherJD(jdData);
        } catch (e) {
            console.error("Matcher failed:", e);
        }
        setMatcherLoading(false);
    };

    // Delete ONLY profile from matches list
    const deleteProfileFromMatch = (profileId) => {
        if (!matcherJD) return;

        const updatedMatches = matcherJD.matches.filter(
            (p) => p.id !== profileId
        );

        const updatedJD = { ...matcherJD, matches: updatedMatches };
        setMatcherJD(updatedJD);

        const updatedHistory = history.map((jd) =>
            jd.id === matcherJD.id ? updatedJD : jd
        );

        setHistory(updatedHistory);
        localStorage.setItem("jdHistory", JSON.stringify(updatedHistory));
    };

    // Load data first time
    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <div className="jd-history-container">

            <div className="jd-header">
                <h1 className="jd-title">📄 Generated JD History</h1>
                <button className="jd-button jd-refresh" onClick={fetchHistory}>
                    <RefreshCcw size={16} /> Refresh
                </button>
            </div>

            {/* TABLE */}
            {!loading ? (
                <table className="jd-table">
                    <thead>
                        <tr>
                            <th>Designation</th>
                            <th>Skills</th>
                            <th>Matches</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {history.map((row) => (
                            <tr key={row.id}>
                                <td>{row.designation}</td>
                                <td>{row.skills}</td>
                                <td>{row.match_count}</td>
                                <td>{new Date(row.created_at).toLocaleString()}</td>

                                <td className="jd-actions">
                                    <button className="jd-button jd-view" onClick={() => setSelected(row)}>
                                        <Eye size={14} /> View
                                    </button>

                                    <button className="jd-button jd-matcher" onClick={() => openMatcher(row.id)}>
                                        🤝 Matcher
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Loading...</p>
            )}


            {/* LOADING popup */}
            {matcherLoading && (
                <div className="jd-modal-overlay">
                    <div className="jd-modal">
                        <h3>🔍 Matching profiles...</h3>
                        <div className="spinner"></div>
                    </div>
                </div>
            )}


            {/* MATCHER POPUP */}
            {matcherJD && (
                <div className="jd-modal-overlay">
                    <div className="jd-modal large-modal">
                        <button className="jd-modal-close" onClick={() => setMatcherJD(null)}>✖</button>

                        <h2>🤝 Matched Profiles</h2>
                        <p><strong>JD:</strong> {matcherJD.designation}</p>

                        {matcherJD.matches.length > 0 ? (
                            <table className="profile-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Skills</th>
                                        <th>Score</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {matcherJD.matches.map((profile) => (
                                        <tr key={profile.id}>
                                            <td>{profile.name}</td>
                                            <td>{profile.skills}</td>
                                            <td>{profile.score}%</td>
                                            <td>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => deleteProfileFromMatch(profile.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No profiles found.</p>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default JDHistory;

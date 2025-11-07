import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_BASE } from "@/utils/constants";
import "./MailMindButton.css";

const MailMindButton = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [platform, setPlatform] = useState("gmail");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);

  const handleConnect = async () => {
    if (!email || !password || !platform) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/mcp/tools/mailmind/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, platform }),
      });
      if (!res.ok) throw new Error(await res.text());
      await res.json();
      setConnected(true);
      alert(`✅ Login Successful: ${email} (${platform})`);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to connect. Check credentials or IMAP settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleExtract = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/mcp/tools/mailmind/fetch-resumes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, platform }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (data.result && data.result.length) {
        setResumes(data.result);
        alert(`✅ Extracted ${data.result.length} resumes`);
      } else if (data.message) {
        alert(`ℹ️ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to extract resumes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mailmind-container">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">LOADING...</div>
        </div>
      )}

      <h3 className="mailmind-title">📬 MailMind</h3>

      {!connected && (
        <>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-full mailmind-input"
          />
          <Input
            type="password"
            placeholder="Password / App Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-full mailmind-input"
          />
          <Select onValueChange={setPlatform} defaultValue={platform}>
            <SelectTrigger className="w-full rounded-full mailmind-select">
              <SelectValue placeholder="Select Platform" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="gmail">Gmail</SelectItem> */}
              <SelectItem value="outlook">Outlook</SelectItem>
              {/* <SelectItem value="godaddy">GoDaddy</SelectItem> */}
            </SelectContent>
          </Select>
          <Button
            onClick={handleConnect}
            disabled={loading || !email || !password || !platform}
            className="w-full rounded-full mailmind-btn"
          >
            {loading ? "Connecting..." : "Login to Mail"}
          </Button>
        </>
      )}

      {connected && (
        <>
          <Button
            onClick={handleExtract}
            disabled={loading}
            className="w-full rounded-full mailmind-extract-btn"
          >
            <span role="img" aria-label="extract">
              📄
            </span>
            {loading ? "Extracting Resumes..." : "Extract Resumes"}
          </Button>

          {resumes.length > 0 && (
            <div className="mailmind-resume-list">
              <h4 className="font-semibold">Extracted Resumes:</h4>
              <ul>
                {resumes.map((url) => {
                  const filename = url.split("/").pop();
                  const isPdf = filename.toLowerCase().endsWith(".pdf");
                  const fileUrl = `${API_BASE}${url}`;
                  return (
                    <li key={url}>
                      {isPdf ? (
                        <span
                          className="resume-link"
                          onClick={() => setPreviewFile(fileUrl)}
                        >
                          {filename}
                        </span>
                      ) : (
                        <span className="text-gray-800">{filename}</span>
                      )}
                      <a href={fileUrl} download className="resume-download">
                        Download
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {previewFile && (
            <div className="mailmind-preview">
              <h5>Preview PDF:</h5>
              <iframe
                src={previewFile}
                width="100%"
                height="500px"
                title="PDF Preview"
              />
              <Button
                onClick={() => setPreviewFile(null)}
                className="close-preview-btn"
              >
                Close Preview
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MailMindButton;

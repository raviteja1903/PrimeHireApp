import { useCallback } from "react";
import { API_BASE } from "@/utils/constants";

export const useProfileMatcher = (setMessages, setIsLoading) => {
  const fetchProfileMatches = useCallback(async (promptMessage) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/mcp/tools/match/profile/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd_text: promptMessage || "" }),
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Status ${response.status} - ${text}`);
      }
      
      const data = await response.json();
      const candidates = data.candidates || [];

      setMessages(prev => [
        ...prev,
        { role: "assistant", type: "profile_table", data: candidates },
      ]);
    } catch (err) {
      console.error("❌ Failed to fetch profile matches:", err);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "❌ Failed to fetch profile matches. Try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [setMessages, setIsLoading]);

  return {
    fetchProfileMatches
  };
};
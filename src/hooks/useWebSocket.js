// import { useState, useEffect, useRef, useCallback } from "react";
// import { WS_URL } from "@/utils/constants";

// export const useWebSocket = () => {
//   const [messages, setMessages] = useState([]);
//   const wsRef = useRef(null);
//   const reconnectRef = useRef(null);

//   const connectWebSocket = useCallback(() => {
//     const ws = new WebSocket(WS_URL);
//     wsRef.current = ws;

//     ws.onopen = () => console.log("✅ WebSocket connected");
    
//     ws.onmessage = (event) => {
//       try {
//         const msg = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
//         handleWebSocketMessage(msg);
//       } catch (err) {
//         console.warn("⚠️ Failed to parse WebSocket message:", event.data);
//       }
//     };

//     ws.onclose = () => {
//       console.warn("❌ WebSocket disconnected. Reconnecting in 2s...");
//       reconnectRef.current = setTimeout(connectWebSocket, 2000);
//     };

//     ws.onerror = (err) => {
//       console.error("WebSocket error:", err);
//       try { ws.close(); } catch (e) { }
//     };
//   }, []);

//   const handleWebSocketMessage = useCallback((msg) => {
//     if ((msg.type === "structured" || msg.type === "profile") && msg.data?.candidates) {
//       setMessages(prev => [
//         ...prev,
//         { role: "assistant", type: "profile_table", data: msg.data.candidates }
//       ]);
//     } else if (msg.type === "text" || typeof msg === "string") {
//       const content = typeof msg === "string" ? msg : msg.data ?? msg;
//       setMessages(prev => [...prev, { role: "assistant", content: String(content) }]);
//     }
//   }, []);

//   const handleSend = useCallback((message, selectedTask = "") => {
//     const finalMessage = selectedTask ? `[${selectedTask}] ${message}` : message;
    
//     if (wsRef.current?.readyState === WebSocket.OPEN) {
//       wsRef.current.send(JSON.stringify({ message: finalMessage }));
//     } else {
//       setMessages(prev => [
//         ...prev,
//         { role: "assistant", content: "❌ WebSocket not connected." }
//       ]);
//     }
//   }, []);

//   useEffect(() => {
//     connectWebSocket();
//     return () => {
//       if (wsRef.current) wsRef.current.close();
//       if (reconnectRef.current) clearTimeout(reconnectRef.current);
//     };
//   }, [connectWebSocket]);

//   return {
//     messages,
//     setMessages,
//     handleSend
//   };
// };

import { useState, useEffect, useRef, useCallback } from "react";
import { WS_URL } from "@/utils/constants";

export const useWebSocket = () => {
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);
  const reconnectRef = useRef(null);

  /** ✅ Connect WebSocket */
  const connectWebSocket = useCallback(() => {
    console.log("🔗 Connecting WebSocket:", WS_URL);
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => console.log("✅ WebSocket connected");

    ws.onmessage = (event) => {
      console.log("📩 Raw WS:", event.data);

      try {
        const msg = typeof event.data === "string"
          ? JSON.parse(event.data)
          : event.data;

        console.log("📝 Parsed:", msg);
        handleWebSocketMessage(msg);
      } catch (err) {
        console.warn("⚠ Failed to parse message", err);
      }
    };

    ws.onclose = (e) => {
      console.warn("❌ WebSocket closed. Reason:", e.reason);
      if (!reconnectRef.current) {
        reconnectRef.current = setTimeout(() => {
          reconnectRef.current = null;
          connectWebSocket();
        }, 2000);
      }
    };

    ws.onerror = (err) => {
      console.error("🔥 WS Error:", err);
      try { ws.close(); } catch {}
    };
  }, []);

  /** ✅ Handle incoming WS messages */
  const handleWebSocketMessage = useCallback((msg) => {
    if ((msg.type === "structured" || msg.type === "profile") && msg.data?.candidates) {
      return setMessages((p) => [...p, { role: "assistant", type: "profile_table", data: msg.data.candidates }]);
    }

    if (msg.type === "resume" && msg.data) {
      return setMessages((p) => [...p, { role: "assistant", type: "resume_table", data: msg.data }]);
    }

    if (msg.type === "text" || typeof msg === "string") {
      const content = typeof msg === "string" ? msg : msg.data ?? msg;
      return setMessages((p) => [...p, { role: "assistant", content: String(content) }]);
    }

    if (msg.type === "structured" && msg.data) {
      return setMessages((p) => [...p, { role: "assistant", content: JSON.stringify(msg.data, null, 2) }]);
    }

    // Fallback
    setMessages((p) => [...p, { role: "assistant", content: JSON.stringify(msg) }]);
  }, []);

  /** ✅ Send messages */
  const handleSend = useCallback((message, selectedTask = "") => {
    let payload;

    if (typeof message === "object") {
      // Example: { type:"resume", data:[...] }
      payload = JSON.stringify(message);
    } else {
      // Chat commands
      const finalMessage = selectedTask
        ? `[${selectedTask}] ${message}`
        : message;

      payload = JSON.stringify({ message: finalMessage });
    }

    console.log("📤 Sending WS:", payload);

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(payload);
    } else {
      console.warn("❌ WebSocket not connected");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ WebSocket not connected." },
      ]);
    }
  }, []);

  /** ✅ Init + Cleanup */
  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
    };
  }, [connectWebSocket]);

  return { messages, setMessages, handleSend };
};

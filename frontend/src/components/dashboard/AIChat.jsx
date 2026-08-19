import { useState, useRef, useEffect } from "react";
import "./Dashboard.css";
import {
  FaRobot,
  FaPaperPlane,
  FaTimes,
  FaComments,
  FaTrashAlt,
  FaLightbulb,
} from "react-icons/fa";
import { sendAIChatMessage } from "../../api";

const SUGGESTED_PROMPTS = [
  "Explain the STAR method with an example",
  "How to prepare for System Design interviews?",
  "Give me 5 common behavioral interview questions",
  "What are top 50 LeetCode patterns for Google?",
];

function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "AI",
      text: "👋 Hello! I'm your **Intervista AI Coach**. Ask me anything about Data Structures, System Design, Behavioral STAR questions, or Company-specific interview tips!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage = {
      sender: "You",
      text: text,
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      // Send message and previous conversation to backend
      const data = await sendAIChatMessage({
        message: text,
        history: newHistory.slice(-6),
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "AI",
          text: data.response,
          followups: data.suggested_followups || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "AI",
          text: `⚠ ${err.message || "Failed to reach AI service. Please make sure the backend is running."}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        sender: "AI",
        text: "👋 Chat cleared! How else can I assist your interview preparation today?",
      },
    ]);
  };

  return (
    <>
      <button
        className="chat-float-btn"
        onClick={() => setOpen(!open)}
        title={open ? "Close AI Coach" : "Open AI Interview Coach"}
      >
        {open ? <FaTimes /> : <FaComments />}
      </button>

      {open && (
        <div className="chat-box">
          <div className="chat-header">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FaRobot />
              <div>
                <h3 style={{ margin: 0, fontSize: "16px" }}>Intervista AI Coach</h3>
                <small style={{ color: "#22c55e", fontSize: "11px" }}>● Live Assistant</small>
              </div>
            </div>

            <div style={{ display: "flex", gap: "6px" }}>
              <button
                type="button"
                onClick={clearChat}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  padding: "4px",
                  fontSize: "14px",
                }}
                title="Clear conversation"
              >
                <FaTrashAlt />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                ✕
              </button>
            </div>
          </div>

          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.sender === "AI" ? "ai-message" : "user-message"}
              >
                <strong>{msg.sender === "AI" ? "🤖 Intervista AI" : "👤 You"}</strong>
                <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.5, margin: "6px 0 0" }}>
                  {msg.text}
                </p>

                {msg.followups && msg.followups.length > 0 && (
                  <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <small style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px" }}>
                      <FaLightbulb /> Suggested follow-ups:
                    </small>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                      {msg.followups.map((chip, cIdx) => (
                        <button
                          key={cIdx}
                          type="button"
                          onClick={() => handleSend(chip)}
                          style={{
                            background: "rgba(59,130,246,0.15)",
                            border: "1px solid rgba(59,130,246,0.3)",
                            color: "#93c5fd",
                            borderRadius: "14px",
                            padding: "4px 10px",
                            fontSize: "11px",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="ai-message">
                <strong>🤖 Intervista AI</strong>
                <p style={{ margin: "4px 0 0", color: "#94a3b8", fontStyle: "italic" }}>
                  Thinking & analyzing interview response...
                </p>
              </div>
            )}
          </div>

          {/* Quick Suggestions Chips */}
          <div
            style={{
              padding: "6px 12px",
              background: "rgba(15,23,42,0.6)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >
            {SUGGESTED_PROMPTS.map((prompt, pIdx) => (
              <button
                key={pIdx}
                type="button"
                onClick={() => handleSend(prompt)}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#cbd5e1",
                  borderRadius: "12px",
                  padding: "3px 8px",
                  fontSize: "11px",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="chat-footer">
            <input
              type="text"
              placeholder="Ask about DSA, System Design, STAR answers..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              disabled={loading}
            />

            <button type="button" onClick={() => handleSend()} disabled={loading || !input.trim()}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AIChat;
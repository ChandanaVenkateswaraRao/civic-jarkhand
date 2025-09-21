// src/components/Chatbot.js
import React, { useState, useEffect, useRef } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./Chatbot.css";

// Gemini API Key rotation
const GEMINI_KEYS = (process.env.REACT_APP_GEMINI_API_KEY || "").split(",");
let keyIndex = 0;
const getNextKey = () => {
  const key = GEMINI_KEYS[keyIndex];
  keyIndex = (keyIndex + 1) % GEMINI_KEYS.length;
  return key;
};
const createAIInstance = () => {
  const key = getNextKey();
  console.log("Using Gemini API Key:", key.slice(0, 6) + "...");
  return new GoogleGenerativeAI(key);
};

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const WEBSITE_CONTEXT = `
You are a helpful assistant for the CivicTracker Citizen Dashboard.
      Only answer questions related to the website.
      
      Users can:
      - Register and log in to their citizen account.
      - Click the "Report" button to submit a new civic issue.
      - Provide a title, description, and optionally upload an image.
      - Select categories when reporting: Potholes, Trash, Streetlight, Water Leakage, Other.
      - Submit the report and check its status in the dashboard.
      - Contact info: phone number: 999-999-9999, email: citizen.support@example.com.

      Rules:
      - If the question is unrelated to this website, respond:
        "I'm sorry, I can only answer questions related to CivicTracker."
      - Keep responses short and clear.
    `;

    try {
      const ai = createAIInstance();
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

      const conversationText = newMessages
        .map((m) => (m.role === "user" ? "User: " : "Assistant: ") + m.content)
        .join("\n");

      const prompt = `${WEBSITE_CONTEXT}\n\nConversation so far:\n${conversationText}\nAssistant:`;

      const result = await model.generateContent([{ text: prompt }]);
      const reply = result.response.text?.() || "Sorry, I couldn't generate a response.";

      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error("Gemini API error:", error);
      setMessages([...newMessages, { role: "assistant", content: "Something went wrong" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div className="chatbot-window">
          <div className="chatbot-header">
            Citizen Bot
            <FaTimes className="chatbot-close" onClick={() => setIsOpen(false)} />
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chatbot-message ${msg.role === "user" ? "user" : "assistant"}`}
              >
                {msg.content}
              </div>
            ))}
            {loading && <div className="chatbot-typing">Bot is typing...</div>}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="chatbot-input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask a question..."
              className="chatbot-input"
            />
            <button onClick={sendMessage} className="chatbot-send-btn">
              Send
            </button>
          </div>
        </div>
      ) : (
        <button className="chatbot-toggle-btn" onClick={() => setIsOpen(true)}>
          <FaRobot />
        </button>
      )}
    </div>
  );
};

export default Chatbot;

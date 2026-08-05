import { useState } from "react";
import "./Dashboard.css";
import {
  FaRobot,
  FaPaperPlane,
  FaTimes,
  FaComments
} from "react-icons/fa";

function AIChat() {

    const [open, setOpen] = useState(false);

    const [messages, setMessages] = useState([
        {
            sender: "AI",
            text: "👋 Hello! I'm Interview AI. How can I help you today?"
        }
    ]);

    const [input, setInput] = useState("");

    const sendMessage = () => {

        if (input.trim() === "") return;

        const userMessage = {
            sender: "You",
            text: input
        };

        setMessages([...messages, userMessage]);

        setInput("");

        setTimeout(() => {

            setMessages(prev => [

                ...prev,

                {
                    sender: "AI",
                    text: "This feature will be connected with the AI backend later."
                }

            ]);

        }, 800);

    };

    return (

        <>

            <button
                className="chat-float-btn"
                onClick={() => setOpen(!open)}
            >

                {open ? <FaTimes /> : <FaComments />}

            </button>

            {open && (

                <div className="chat-box">

                    <div className="chat-header">

                        <FaRobot />

                        <h3>Interview AI</h3>

                    </div>

                    <div className="chat-body">

                        {messages.map((msg, index) => (

                            <div
                                key={index}
                                className={
                                    msg.sender === "AI"
                                        ? "ai-message"
                                        : "user-message"
                                }
                            >

                                <strong>{msg.sender}</strong>

                                <p>{msg.text}</p>

                            </div>

                        ))}

                    </div>

                    <div className="chat-footer">

                        <input
                            type="text"
                            placeholder="Ask Interview AI..."
                            value={input}
                            onChange={(e) =>
                                setInput(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }}
                        />

                        <button onClick={sendMessage}>

                            <FaPaperPlane />

                        </button>

                    </div>

                </div>

            )}

        </>

    );

}

export default AIChat;
import React, { useState } from "react";
import "./App.css"; // Import custom styles

function App() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query) return;
    setLoading(true);

    try {
      const res = await fetch(
        "https://api-inference.huggingface.co/models/distilgpt2",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_HF_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: query }),
        }
      );

      const data = await res.json();
      setResponse(data[0]?.generated_text || "⚠️ No response from AI");
    } catch (err) {
      console.error(err);
      setResponse("⚠️ Error fetching AI response");
    }

    setLoading(false);
  };

  const handleSaveTask = () => {
    if (response) {
      setTasks([...tasks, response]);
      setResponse("");
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">🤖 AI Task Assistant (Free)</h1>

      <div className="card">
        <input
          type="text"
          placeholder="Ask AI something..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-box"
        />

        <button onClick={handleAsk} className="btn ask-btn">
          {loading ? "Thinking..." : "Ask AI"}
        </button>

        {response && (
          <div className="response-box">
            <h3>AI Response:</h3>
            <p>{response}</p>
            <button onClick={handleSaveTask} className="btn save-btn">
              Save as Task
            </button>
          </div>
        )}

        {tasks.length > 0 && (
          <div className="task-section">
            <h2>📝 Saved Tasks</h2>
            <ul className="task-list">
              {tasks.map((task, i) => (
                <li key={i} className="task-item">
                  {task}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

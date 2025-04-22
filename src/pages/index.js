// pages/index.js

import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    return data.reply;
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;

    setLoading(true);
    const reply = await sendMessage(userInput);

    setMessages([
      ...messages,
      { role: 'user', content: userInput },
      { role: 'assistant', content: reply },
    ]);

    setUserInput('');
    setLoading(false);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>EchoMind</h1>

      <div style={{ marginBottom: 20 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        style={{ width: '80%', padding: 8 }}
        placeholder="Спроси что-нибудь..."
      />
      <button onClick={handleSend} disabled={loading} style={{ padding: 8, marginLeft: 10 }}>
        {loading ? '...' : 'Отправить'}
      </button>
    </div>
  );
}

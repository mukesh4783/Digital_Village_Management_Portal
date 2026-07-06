import { useState, useRef, useEffect } from 'react';
import { api } from '../api';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Namaste! 🌿 I\'m GramSetu Assistant. I can help you navigate the portal, explain features, or guide you through any process. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      // Build history for API (exclude first bot greeting)
      const history = updated.slice(1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const data = await api('/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text, history: history.slice(0, -1) })
      });

      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: `Sorry, I encountered an error: ${err.message}. Please try again.` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="chatbot-toggle"
        onClick={() => setOpen(!open)}
        title="Chat with GramSetu Assistant"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <Bot size={20} />
            <div>
              <strong>GramSetu Assistant</strong>
              <small>Powered by Gemini AI</small>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chatbot-msg ${m.role}`}>
                <div className="chatbot-msg-icon">
                  {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className="chatbot-msg-bubble">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="chatbot-msg bot">
                <div className="chatbot-msg-icon"><Bot size={14} /></div>
                <div className="chatbot-msg-bubble chatbot-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form className="chatbot-input" onSubmit={send}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything about the portal..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

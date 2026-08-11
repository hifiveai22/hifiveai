'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare, X, Send, Sparkles, RotateCcw } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  'How does HiFive AI replace 5+ tools?',
  'What makes Ask AI different from ChatGPT?',
  'How does cross-module reasoning work?',
  "What's the typical implementation timeline?",
];

function parseMarkdown(text: string): string {
  let html = text;
  // Bold: **text** → <strong>text</strong>
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Bullet points: - text → • text
  html = html.replace(/^-\s/gm, '• ');
  // Newlines → <br/>
  html = html.replace(/\n/g, '<br/>');
  return html;
}

export default function AskAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate sessionId on first open
  useEffect(() => {
    if (isOpen && !sessionId) {
      setSessionId(`${Date.now()}-${Math.random().toString(36).slice(2)}`);
    }
  }, [isOpen, sessionId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMessage: Message = { role: 'user', content: trimmed };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setLoading(true);

      try {
        const res = await fetch('/api/ask-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: trimmed, sessionId }),
        });

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response || data.message || 'I appreciate your question. Let me think about that...',
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        const errorMessage: Message = {
          role: 'assistant',
          content:
            err instanceof Error && err.message
              ? `Sorry, something went wrong: ${err.message}. Please try again.`
              : 'Sorry, I encountered an error. Please try again.',
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setLoading(false);
      }
    },
    [loading, sessionId]
  );

  const handleSend = useCallback(() => {
    sendMessage(input);
  }, [input, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleNewChat = useCallback(async () => {
    if (sessionId) {
      try {
        await fetch(`/api/ask-ai?sessionId=${encodeURIComponent(sessionId)}`, {
          method: 'DELETE',
        });
      } catch {
        // Silently ignore cleanup errors
      }
    }
    setMessages([]);
    setInput('');
    setSessionId(`${Date.now()}-${Math.random().toString(36).slice(2)}`);
  }, [sessionId]);

  const handleSuggestionClick = useCallback(
    (question: string) => {
      sendMessage(question);
    },
    [sendMessage]
  );

  const showSuggestions = messages.length === 0 && !loading;

  return (
    <>
      {/* Floating trigger button */}
      <button
        className={`ask-ai-trigger ${isOpen ? 'active' : ''}`}
        onClick={toggleChat}
        aria-label={isOpen ? 'Close AI chat' : 'Open AI chat'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat panel */}
      <div className={`ask-ai-panel ${isOpen ? 'open' : ''}`} role="dialog" aria-label="Ask AI Chat">
        {/* Header */}
        <div className="ask-ai-header">
          <div className="ask-ai-header-icon">
            <Sparkles size={16} />
          </div>
          <div className="ask-ai-header-text">
            <h4>Ask AI</h4>
            <span>HiFive AI Assistant</span>
          </div>
          <div className="ask-ai-header-actions">
            <button className="ask-ai-header-btn" onClick={handleNewChat} aria-label="Start new chat">
              <RotateCcw size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              New Chat
            </button>
            <button className="ask-ai-header-btn" onClick={toggleChat} aria-label="Close chat">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="ask-ai-messages">
          {showSuggestions && (
            <div style={{ textAlign: 'center', padding: '24px 0 8px' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>
                <Sparkles size={28} style={{ color: 'var(--gold)', display: 'inline' }} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', margin: '0 0 4px' }}>
                HiFive AI Assistant
              </p>
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
                Ask me anything about HiFive AI
              </p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`ask-ai-msg ${msg.role}`}>
              {msg.role === 'assistant' ? (
                <span dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }} />
              ) : (
                msg.content
              )}
            </div>
          ))}
          {loading && (
            <div className="ask-ai-typing">
              <span />
              <span />
              <span />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions */}
        {showSuggestions && (
          <div className="ask-ai-suggestions">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button key={q} className="ask-ai-suggestion" onClick={() => handleSuggestionClick(q)}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="ask-ai-input-area">
          <input
            ref={inputRef}
            className="ask-ai-input"
            type="text"
            placeholder="Ask about HiFive AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            aria-label="Type your message"
          />
          <button
            className="ask-ai-send"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  );
}

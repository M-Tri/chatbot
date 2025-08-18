import { useState, useRef } from 'react';
import './ChatInput.css';

export function ChatInput({ chatMessages, setChatMessages, isLoading, setIsLoading }) {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef(null);

  function saveInputText(e) {
    setInputText(e.target.value);

    // auto-resize textarea
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 'px';
    }
  }

  async function sendMessage() {
    if (!inputText.trim()) return;

    const newMessage = {
      message: inputText,
      sender: 'user',
      id: crypto.randomUUID(),
    };
    setChatMessages(prev => [...prev, newMessage]);
    setInputText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage.message })
      });

      const data = await res.json();

      const botMessage = {
        message: data.reply ?? 'No reply from model.',
        sender: 'robot',
        id: crypto.randomUUID(),
      };
      setChatMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, {
        message: 'Backend error. Check server & Ollama.',
        sender: 'robot',
        id: crypto.randomUUID(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="chat-input-container">
      <textarea
        ref={textareaRef}
        placeholder="Type a message..."
        onChange={saveInputText}
        value={inputText}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        className="chat-input"
        rows={1}
      />
      <button className="send-button" onClick={sendMessage} disabled={isLoading}>
        send
      </button>
    </div>
  );
}

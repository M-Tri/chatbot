import { useRef, useState } from 'react';
import './ChatInput.css';

export function ChatInput({
  apiUrl,
  model,
  temperature,
  systemPrompt,
  setChatMessages,
  isLoading,
  setIsLoading,
  setError
}) {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef(null);

  function saveInputText(e) {
    setInputText(e.target.value);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }

  async function sendMessage() {
    if (!inputText.trim() || isLoading) return;

    const newMessage = {
      message: inputText.trim(),
      sender: 'user',
      id: crypto.randomUUID()
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setError('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    setIsLoading(true);

    try {
      const res = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newMessage.message,
          model,
          temperature,
          systemPrompt
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'The backend could not complete the request.');

      setChatMessages((prev) => [
        ...prev,
        {
          message: data.reply || 'No reply from model.',
          sender: 'robot',
          id: crypto.randomUUID()
        }
      ]);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Backend error. Check the server and Ollama.');
      setChatMessages((prev) => [
        ...prev,
        {
          message: 'I could not reach the model. Check that the backend and Ollama are running.',
          sender: 'robot',
          id: crypto.randomUUID(),
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="chat-input-container">
      <textarea
        ref={textareaRef}
        placeholder="Ask the local model anything..."
        onChange={saveInputText}
        value={inputText}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        className="chat-input"
        rows={1}
      />
      <button className="send-button" onClick={sendMessage} disabled={isLoading || !inputText.trim()}>
        {isLoading ? 'Thinking' : 'Send'}
      </button>
    </div>
  );
}

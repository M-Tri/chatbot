import { useRef, useState } from 'react';
import './ChatInput.css';

function cleanModelOutput(text) {
  let cleanedText = text.trim();

  if (cleanedText.startsWith('{') && cleanedText.endsWith('}')) {
    try {
      const data = JSON.parse(cleanedText);
      cleanedText = data.reply || data.response || data.message?.content || cleanedText;
    } catch {
      // Keep the original text if it only looks like JSON.
    }
  }

  return cleanedText
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/```(?:\w+)?\n?([\s\S]*?)```/g, '$1')
    .trim()
    .replace(/^["'“”]+/, '')
    .replace(/["'“”]+$/, '')
    .trim();
}

export function ChatInput({
  apiUrl,
  model,
  temperature,
  systemPrompt,
  chatMessages,
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
    const history = chatMessages
      .filter((msg) => !msg.isError)
      .slice(-8)
      .map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.message
      }));

    setChatMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setError('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    setIsLoading(true);

    let botMessageId = '';
    let streamedReply = '';

    try {
      const res = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newMessage.message,
          model,
          temperature,
          systemPrompt,
          history
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'The backend could not complete the request.');
      }

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        const reply = cleanModelOutput(data.reply || data.response || data.message?.content || '');

        setChatMessages((prev) => [
          ...prev,
          {
            message: reply || 'No reply from model.',
            sender: 'robot',
            id: crypto.randomUUID()
          }
        ]);
        return;
      }

      if (!res.body) throw new Error('The backend did not return a readable stream.');

      botMessageId = crypto.randomUUID();

      setChatMessages((prev) => [
        ...prev,
        {
          message: '',
          sender: 'robot',
          id: botMessageId
        }
      ]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;

        streamedReply += chunk;
        const cleanedReply = cleanModelOutput(streamedReply);
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, message: cleanedReply }
              : msg
          )
        );
      }

      const finalChunk = decoder.decode();
      if (finalChunk) {
        streamedReply += finalChunk;
        const cleanedReply = cleanModelOutput(streamedReply);
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, message: cleanedReply }
              : msg
          )
        );
      }

      if (!cleanModelOutput(streamedReply)) {
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, message: 'No reply from model.' }
              : msg
          )
        );
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Backend error. Check the server and Ollama.');
      setChatMessages((prev) => {
        const errorMessage = 'I could not reach the model. Check that the backend and Ollama are running.';

        if (botMessageId && !streamedReply) {
          return prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, message: errorMessage, isError: true }
              : msg
          );
        }

        return [
          ...prev,
          {
            message: errorMessage,
            sender: 'robot',
            id: crypto.randomUUID(),
            isError: true
          }
        ];
      });
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

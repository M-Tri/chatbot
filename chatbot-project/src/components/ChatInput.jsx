import { useState, useRef } from 'react';
import { chatbot } from 'supersimpledev';
import './ChatInput.css';

export function ChatInput({ chatMessages, setChatMessages }) {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef(null);

  function saveInputText(event) {
    setInputText(event.target.value);

    // Auto resize textarea height
    const textarea = textareaRef.current;
    if (textarea) {
      // reset height
      textarea.style.height = 'auto'; 
      // set to scrollHeight
      textarea.style.height = textarea.scrollHeight + 'px'; 
    }
  }

  function sendMessage() {

    const newMessage = {
      message: inputText,
      sender: 'user',
      id: crypto.randomUUID(),
    };

    // Get chatbot response
    const response = chatbot.getResponse(inputText);

    const newResponse = {
      message: response,
      sender: 'robot',
      id: crypto.randomUUID(),
    };

    setChatMessages([...chatMessages, newMessage, newResponse]);
    setInputText('');

    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }

  return (
    <div className="chat-input-container">
      {/* Auto-resizing textarea */}
      <textarea
        ref={textareaRef}
        placeholder="Type a message..."
        onChange={saveInputText}
        value={inputText}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        className="chat-input"
        // initial height
        rows={1} 
      />

      <button className="send-button" onClick={sendMessage}>
        send
      </button>
    </div>
  );
}

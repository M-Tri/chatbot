import { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import './ChatMessages.css';

function ChatMessages({ chatMessages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  return (
    <div className="chat-messages-container">
      {chatMessages.map(msg => (
        <ChatMessage key={msg.id} message={msg.message} sender={msg.sender} />
      ))}

      {isLoading && (
        <div className="chat-message-robot">
          <div className="chat-message-text">Typing...</div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatMessages;

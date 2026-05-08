import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import './ChatMessages.css';

function ChatMessages({ chatMessages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  return (
    <section className="chat-messages-container" aria-label="Chat messages">
      {chatMessages.length === 0 && (
        <div className="empty-state">
          <h2>
            <span className="empty-blue">:)</span>
            <span className="empty-orange">(:</span>
          </h2>
        </div>
      )}

      {chatMessages.map((msg) => (
        <ChatMessage
          key={msg.id}
          message={msg.message}
          sender={msg.sender}
          isError={msg.isError}
        />
      ))}

      {isLoading && (
        <div className="chat-message-robot">
          <div className="typing-indicator" aria-label="Model is thinking">
            <span />
            <span />
            <span />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </section>
  );
}

export default ChatMessages;

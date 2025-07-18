import { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import './ChatMessages.css';


function ChatMessages({chatMessages}) {
  const bottomRef = useRef(null);
  // Auto-scroll effect
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="chat-messages-container">
      {/*React efficiently updates only the changed parts in the real DOM */}
      {chatMessages.map((chatMessage) => (
        <ChatMessage
          message={chatMessage.message}
          sender={chatMessage.sender}
          key={chatMessage.id}
        />
      ))}
      
      {/* This invisible div marks the scroll target */}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatMessages;
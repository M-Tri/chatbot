import { useState } from 'react';
import ChatMessages from './components/ChatMessages';
import { ChatInput } from './components/ChatInput';
import './App.css';

function App() {
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="app-container">
      <ChatMessages chatMessages={chatMessages} isLoading={isLoading} />
      <ChatInput 
        setChatMessages={setChatMessages} 
        chatMessages={chatMessages} 
        isLoading={isLoading} 
        setIsLoading={setIsLoading} 
      />
    </div>
  );
}

export default App;

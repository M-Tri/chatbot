import { ChatInput } from './components/ChatInput';
import ChatMessages from './components/ChatMessages';
import { useState } from 'react';
import './App.css'


function App(){
  const [chatMessages, setChatMessages] = useState([{
    message: 'hello chatbot',
    sender: 'user',
    id: 'id1'
  }, {
    message: 'Hello! How can I help you?',
    sender: 'robot',
    id: 'id2'
  }, {
    message: "Can you get me todays' date",
    sender: "user",
    id: 'id3'
  }, {
    message: "Today is July 9",
    sender: "robot",
    id: 'id4'
  }, {
    message: 'hello chatbot',
    sender: 'user',
    id: 'id1'
  }, {
    message: 'Hello! How can I help you?',
    sender: 'robot',
    id: 'id2'
  }, {
    message: "Can you get me todays' date",
    sender: "user",
    id: 'id3'
  }, {
    message: "Today is July 9",
    sender: "robot",
    id: 'id4'
  }]);

  return (
    <div className="app-container">
      <ChatMessages 
        chatMessages={chatMessages}
      />
      {/*set props to ChatInput component*/}
      <ChatInput 
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}  
      />
    </div>
  );
}

export default App

import RobotProfileImage from '../assets/robotCircle.svg';
import UserProfileImage from '../assets/userCircle.svg';
import './ChatMessage.css';

export function ChatMessage({ message, sender, isError }) {
  const isUser = sender === 'user';

  return (
    <div className={isUser ? 'chat-message-user' : 'chat-message-robot'}>
      {!isUser && <img src={RobotProfileImage} className="chat-img-profile" alt="" />}
      <div className={`chat-message-text ${isUser ? 'user-bubble' : 'robot-bubble'} ${isError ? 'error-bubble' : ''}`}>
        {message}
      </div>
      {isUser && <img src={UserProfileImage} className="chat-img-profile" alt="" />}
    </div>
  );
}

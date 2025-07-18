import RobotProfileImage from '../assets/robotCircle.svg';
import UserProfileImage from '../assets/userCircle.svg';
import './ChatMessage.css';


// First method: Destructure the argument directly.
export function ChatMessage({message, sender}) {
  /* Second method:
  const {message, sender} = props;
  Third method:
  const message = props.message;
  const sender = props.sender;
  */

  return (
    <div className={sender === 'user' ? 'chat-message-user' : 'chat-message-robot'}>
      {(sender === 'robot') && 
        (<img src= {RobotProfileImage} className="chat-img-profile-robot"/>)}
        <div className="chat-message-text">
          {message}
        </div>
      {(sender === 'user') && 
        (<img src= {UserProfileImage} className="chat-img-profile-user"/>)}
    </div> 
  );
}
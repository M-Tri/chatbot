import { useEffect, useState } from 'react';
import ChatMessages from './components/ChatMessages';
import { ChatInput } from './components/ChatInput';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const STORAGE_KEY = 'local-ai-chat-history';
const MODEL_OPTIONS = [
  'deepseek-r1:1.5b',
  'llama3.2:3b',
  'mistral:7b',
  'qwen2.5:7b'
];

function App() {
  const [chatMessages, setChatMessages] = useState(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [model, setModel] = useState('deepseek-r1:1.5b');
  const [temperature, setTemperature] = useState(0.7);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    async function loadConfig() {
      try {
        const response = await fetch(`${API_URL}/config`);
        if (!response.ok) return;

        const config = await response.json();
        setModel(config.model || 'deepseek-r1:1.5b');
        setTemperature(config.temperature ?? 0.7);
      } catch (err) {
        console.error(err);
      }
    }

    loadConfig();
  }, []);

  function resetChat() {
    setChatMessages([]);
    setError('');
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <main className="app-container">
      <div className="app-toolbar">
        <button className="reset-button" onClick={resetChat} disabled={isLoading || chatMessages.length === 0}>
          Reset chat
        </button>
        <button className="settings-button" onClick={() => setIsSettingsOpen(true)}>
          Settings
        </button>
      </div>

      <div
        className={`settings-backdrop ${isSettingsOpen ? 'settings-backdrop-open' : ''}`}
        onClick={() => setIsSettingsOpen(false)}
      />

      <aside className={`settings-panel ${isSettingsOpen ? 'settings-panel-open' : ''}`} aria-label="Experiment settings">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-settings-button" onClick={() => setIsSettingsOpen(false)}>
            Close
          </button>
        </div>

        <label>
          Model
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            {MODEL_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        <label>
          Temperature <span>{Number(temperature).toFixed(1)}</span>
          <input
            type="range"
            min="0"
            max="1.5"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
          />
        </label>

        <label className="system-prompt-field">
          System prompt
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Optional: guide the assistant's tone or behavior..."
            rows={2}
          />
        </label>
      </aside>

      {error && <div className="error-banner">{error}</div>}

      <ChatMessages chatMessages={chatMessages} isLoading={isLoading} />
      <ChatInput
        apiUrl={API_URL}
        model={model}
        temperature={temperature}
        systemPrompt={systemPrompt}
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setError={setError}
      />
    </main>
  );
}

export default App;

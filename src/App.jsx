import { useState, useEffect, useRef } from 'react';
import api from './api';

function App() {
  const [phoneNumber, setPhoneNumber] = useState('+4915251354115');
  const [instructions, setInstructions] = useState('Dein name ist Mona. Du bist ein netter Assistent.');
  const [log, setLog] = useState([]);
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const chatWindowRef = useRef(null);
  const sseRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [log]);

  const handleLogin = async () => {
    try {
      const response = await api.post('/api/call/adminlogin', { password });
      setIsLoggedIn(true);
      setPassword('');
      console.log(response.data.message);
    } catch (error) {
      console.error('Login failed:', error.response?.data?.error || error.message);
      alert(error.response?.data?.error || 'Login failed');
    }
  };

  const startCall = async () => {
    if (!isLoggedIn) {
      alert('Please log in first');
      return;
    }

    try {
      await api.post('/api/call/instructions/set', { instructions });
      const response = await api.post('/api/call/start', { phoneNumber });
      console.log(response.data.message);
      setIsCalling(true);
      startTranscriptionLog();
    } catch (error) {
      console.error('Call initiation failed:', error.response?.data?.error || error.message);
      alert(error.response?.data?.error || 'Failed to initiate call');
    }
  };

  const endCall = async () => {
    if (!isLoggedIn) {
      alert('Please log in first');
      return;
    }

    try {
      const response = await api.post('/api/call/end');
      console.log(response.data.message);
      setIsCalling(false);
      stopTranscriptionLog();
    } catch (error) {
      console.error('Ending call failed:', error.response?.data?.error || error.message);
      alert(error.response?.data?.error || 'Failed to end call');
    }
  };

  const startTranscriptionLog = () => {
    if (sseRef.current) return;
    sseRef.current = new EventSource(`${import.meta.env.VITE_BACKEND_URL}/api/call/transcription-log`, {
      withCredentials: true,
    });

    sseRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setLog((prevLog) => [...prevLog, { sender: message.type === 'mona' ? 'Mona' : 'User', text: message.transcription }]);
    };

    sseRef.current.onerror = (error) => {
      console.error('SSE Error:', error);
      stopTranscriptionLog();
    };
  };

  const stopTranscriptionLog = () => {
    if (sseRef.current) {
      sseRef.current.close();
      sseRef.current = null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-8 bg-gray-900 text-white">
      <h1 className="text-7xl font-bold">
        Let <span className="text-blue-500">Mona</span> Make A Call
      </h1>

      {!isLoggedIn ? (
        <div className="flex flex-col items-center space-y-4 w-full max-w-md">
          <span className="text-sm text-gray-400">Admin Password</span>
          <input
            className="input input-bordered w-full"
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin} className="btn btn-primary bg-blue-500 w-full mt-4">
            Log In
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4 w-full max-w-md">
          <span className="text-sm text-gray-400">Phone Number to Call</span>
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="Enter Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <span className="text-sm text-gray-400">Tell Mona what to do</span>
          <textarea
            className="textarea textarea-bordered w-full p-2 min-h-40"
            placeholder="Mona's instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          ></textarea>

          <div className="flex space-x-4 w-full">
            {isCalling ? (
              <button onClick={endCall} className="btn btn-secondary w-full">
                End Call
              </button>
            ) : (
              <button onClick={startCall} className="btn btn-primary bg-blue-500 w-full">
                Start Call
              </button>
            )}
          </div>
        </div>
      )}

      <div
        ref={chatWindowRef}
        className="chat-window max-h-[500px] min-h-[300px] overflow-y-auto w-full max-w-4xl border border-gray-600 rounded-lg p-4 bg-gray-800"
      >
        {log.map((message, index) => (
          <div key={index} className={`chat ${message.sender === 'Mona' ? 'chat-start' : 'chat-end'}`}>
            <div
              className={`chat-bubble ${message.sender === 'Mona' ? 'bg-blue-700' : 'bg-slate-700'} text-white p-2 rounded-lg`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

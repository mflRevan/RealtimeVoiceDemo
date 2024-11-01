import { useState, useEffect, useRef } from 'react';

function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [instructions, setInstructions] = useState('');
  const [log, setLog] = useState([
    { sender: 'Mona', text: 'Hello, how can I assist you today?' },
    { sender: 'User', text: 'I would like to know more about your services.' },
    { sender: 'Mona', text: 'Sure, we offer a variety of services including customer support and sales.' },
    { sender: 'User', text: 'That sounds great. Can you tell me more about your sales process?' },
    { sender: 'Mona', text: 'Of course! Our sales process is designed to be customer-friendly and efficient.' },
    { sender: 'User', text: 'That sounds great. Can you tell me more about your sales process?' },
    { sender: 'Mona', text: 'Of course! Our sales process is designed to be customer-friendly and efficient.' },
    { sender: 'User', text: 'I would like to know more about your services.' },
    { sender: 'Mona', text: 'Sure, we offer a variety of services including customer support and sales.' },
    { sender: 'User', text: 'I would like to know more about your services.' },
    { sender: 'Mona', text: 'Sure, we offer a variety of services including customer support and sales.' },
  ]);

  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [log]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-8 bg-gray-900 text-white">
      <h1 className="text-7xl font-bold">
        Let <span className="text-blue-500">Mona</span> Make A Call
      </h1>

      <div className="flex flex-col items-center space-y-4 w-full max-w-md">
        <span className="text-sm text-gray-400">Phonenumber to call</span>
        <input
          className="input input-bordered w-full"
          type="text"
          placeholder="Enter Phone Number"
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <span className="text-sm text-gray-400">Tell Mona what to do</span>
        <textarea
          className="textarea textarea-bordered w-full p-2 min-h-40"
          placeholder="Mona's instructions"
          defaultValue={'You are a call center agent interviewing customers on cars...'}
          onChange={(e) => setInstructions(e.target.value)}
        ></textarea>

        <button className="btn btn-primary bg-blue-500 w-full mt-4">Call</button>
        {/* <button className="btn btn-circle btn-outline w-full btn-lg">Call</button> */}
      </div>

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

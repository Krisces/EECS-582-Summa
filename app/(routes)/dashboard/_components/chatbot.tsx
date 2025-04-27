'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';

export default function Chatbot() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();

  // Load messages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('chat_messages');
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (chatRef.current && isOpen) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading, isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = `You: ${input}`;
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, email: user?.primaryEmailAddress?.emailAddress as string }),
      });

      const data = await res.json();
      const botReply = `${data.reply || data.message || 'No reply from model.'}`;

      setMessages([...updatedMessages, botReply]);
    } catch (err) {
      setMessages([...updatedMessages, 'Error reaching the server.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col max-h-96">
          <div
            className="bg-violet-950 text-white p-3 rounded-t-lg flex justify-between items-center cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <h2 className="font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              Summa Assistant
            </h2>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414L11.414 12l3.293 3.293a1 1 0 01-1.414 1.414L10 13.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 12 5.293 8.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>

          <div
            ref={chatRef}
            className="flex-1 p-3 overflow-y-auto bg-gray-50"
            style={{ minHeight: "240px", maxHeight: "calc(100% - 110px)" }}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>How can I help you today?</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className="mb-2">
                  {msg.startsWith('You:') && (
                    <div className="text-right text-slate-500 italic">You</div>
                  )}
                  <div className={`${msg.startsWith('You:') ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block px-3 py-2 rounded-lg text-sm ${msg.startsWith('You:')
                      ? 'bg-violet-950 text-white'
                      : 'bg-gray-200 text-gray-800'
                      }`}>
                      {msg.replace('You: ', '')}
                    </span>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="text-left">
                <span className="px-3 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm flex items-center gap-2">
                  <span className="flex space-x-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </span>
                  Assistant is typing ...
                </span>
              </div>
            )}
          </div>
          <div className="p-3 border-t bg-white mt-auto rounded-b-lg">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Ask me a question ..."
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-violet-950 text-white rounded px-4 py-2 hover:bg-violet-300 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-violet-950 text-white rounded-full p-4 shadow-lg hover:bg-violet-500 transition-all flex items-center justify-center"
          aria-label="Open chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}
    </div>
  );
}
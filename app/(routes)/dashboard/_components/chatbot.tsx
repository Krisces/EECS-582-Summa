/**
 * Prologue
 * 
 * Chatbot Component
 *
 * This component provides an interactive chatbot widget for users to ask questions and receive replies.
 * It includes a floating button to toggle the chat window, manages user inputs and bot responses, 
 * and saves conversation history in local storage for persistence.
 * Automatically scrolls to the latest message and shows a typing indicator while awaiting a reply.
 * 
 * Input: User text input from the chatbox.
 * Output: JSX that displays a floating chatbot with conversation history and real-time interactions.
 * 
 * Dependencies:
 * - `@clerk/nextjs` for retrieving the authenticated user's email
 * - `fetch` API to send user messages to the backend endpoint `/api/chat`
 * - `useState`, `useEffect`, `useRef` hooks from React
 * 
 * Author: Kristin Boeckmann, Lisa Phan, Zach Alwin, Vinayak Jha, Shravya Matta
 * Creation Date: 04/27/2025
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';

// Main Chatbot component
export default function Chatbot() {
  // State variables
  const [messages, setMessages] = useState<string[]>([]); // List of chat messages
  const [input, setInput] = useState(''); // User input field
  const [loading, setLoading] = useState(false); // Loading state when waiting for bot reply
  const [isOpen, setIsOpen] = useState(false); // Toggle chat window open/close
  const chatRef = useRef<HTMLDivElement>(null); // Reference to the chat messages container for auto-scrolling

  const { user } = useUser(); // Get the logged-in user info from Clerk authentication

  // Load messages from localStorage when component mounts
  useEffect(() => {
    const saved = localStorage.getItem('chat_messages');
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  // Save updated messages to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  // Scroll to the bottom when new messages come in and chat is open
  useEffect(() => {
    if (chatRef.current && isOpen) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading, isOpen]);

  // Handle sending a new message
  const sendMessage = async () => {
    if (!input.trim()) return; // Do not send empty messages

    const userMessage = `You: ${input}`; // Format the user message
    const updatedMessages = [...messages, userMessage]; // Add user message to the chat

    setMessages(updatedMessages); // Update UI immediately
    setInput(''); // Clear input field
    setLoading(true); // Show loading state

    try {
      // Send request to backend API with user input and user email
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, email: user?.primaryEmailAddress?.emailAddress as string }),
      });

      const data = await res.json(); // Parse response
      const botReply = `${data.reply || data.message || 'No reply from model.'}`; // Fallback reply

      setMessages([...updatedMessages, botReply]); // Add bot reply to chat
    } catch (err) {
      // Handle API call errors
      setMessages([...updatedMessages, 'Error reaching the server.']);
    } finally {
      setLoading(false); // Remove loading state
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        // Chat window when open
        <div className="w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col max-h-96">
          {/* Chat header with close button */}
          <div
            className="bg-violet-950 text-white p-3 rounded-t-lg flex justify-between items-center cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <h2 className="font-medium flex items-center gap-2">
              {/* Chat Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="..." clipRule="evenodd" />
              </svg>
              Summa Assistant
            </h2>
            {/* Close Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="..." clipRule="evenodd" />
            </svg>
          </div>

          {/* Messages area */}
          <div
            ref={chatRef}
            className="flex-1 p-3 overflow-y-auto bg-gray-50"
            style={{ minHeight: "240px", maxHeight: "calc(100% - 110px)" }}
          >
            {/* If no messages, show a welcome prompt */}
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <svg xmlns="..." className="h-10 w-10 mb-2 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="..." />
                </svg>
                <p>How can I help you today?</p>
              </div>
            ) : (
              // Render messages
              messages.map((msg, idx) => (
                <div key={idx} className="mb-2">
                  {/* Show 'You' label for user's messages */}
                  {msg.startsWith('You:') && (
                    <div className="text-right text-slate-500 italic">You</div>
                  )}
                  {/* Style messages differently for user and bot */}
                  <div className={`${msg.startsWith('You:') ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block px-3 py-2 rounded-lg text-sm ${msg.startsWith('You:')
                      ? 'bg-violet-950 text-white'
                      : 'bg-gray-200 text-gray-800'
                      }`}>
                      {/* Remove 'You:' prefix from display */}
                      {msg.replace('You: ', '')}
                    </span>
                  </div>
                </div>
              ))
            )}
            {/* Show loading animation when waiting for bot reply */}
            {loading && (
              <div className="text-left">
                <span className="px-3 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm flex items-center gap-2">
                  <span className="flex space-x-1">
                    {/* Animated dots */}
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </span>
                  Assistant is typing ...
                </span>
              </div>
            )}
          </div>

          {/* Input field and send button */}
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
        // Chat closed button (floating button)
        <button
          onClick={() => setIsOpen(true)}
          className="bg-violet-950 text-white rounded-full p-4 shadow-lg hover:bg-violet-500 transition-all flex items-center justify-center"
          aria-label="Open chat"
        >
          {/* Chat icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="..." />
          </svg>
        </button>
      )}
    </div>
  );
}

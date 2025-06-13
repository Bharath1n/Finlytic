import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Homepage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const userMessage = { role: 'user', content: message };
    setChatHistory([...chatHistory, userMessage]);
    setMessage('');

    try {
      // Mock response (replace with OpenAI API call if key available)
      const response = { data: { content: `You asked: ${message}. Try asking about loan defaults or credit risks!` } };
      // For OpenAI, uncomment and add your API key:
      // const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      //   model: 'gpt-3.5-turbo',
      //   messages: [{ role: 'user', content: `Financial insights: ${message}` }],
      // }, {
      //   headers: { Authorization: `Bearer YOUR_API_KEY` },
      // });
      const botMessage = { role: 'assistant', content: response.data.content };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { role: 'assistant', content: 'Error: Could not connect to chatbot.' };
      setChatHistory((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex flex-col items-center justify-center text-white">
      <motion.h1
        className="text-5xl font-bold mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to FIN-LYTIC
      </motion.h1>
      <motion.p
        className="text-xl mb-8 text-center max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        A platform for financial insights and analysis. Here you can predict loan validation, assess credit risks, and learn more about financial models.
        and interact with our AI chatbot for personalized assistance.
      </motion.p>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <motion.button
          className="px-6 py-3 bg-white text-purple-600 rounded-full font-semibold"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link to="/dashboard">Go to Dashboard</Link>
        </motion.button>
        <motion.button
          className="px-6 py-3 bg-transparent border-2 border-white rounded-full font-semibold"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link to="/loan">Predict Loan Default</Link>
        </motion.button>
        <motion.button
          className="px-6 py-3 bg-transparent border-2 border-white rounded-full font-semibold"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link to="/credit-risk">Predict Credit Risk</Link>
        </motion.button>
        <motion.button
          className="px-6 py-3 bg-transparent border-2 border-white rounded-full font-semibold"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link to="/info">Learn More</Link>
        </motion.button>
        <motion.button
          className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleChat}
        >
          {isChatOpen ? 'Close Chat' : 'Talk to AI'}
        </motion.button>
      </div>

      {isChatOpen && (
        <motion.div
          className="fixed bottom-20 right-5 w-80 bg-white text-black rounded-lg shadow-lg p-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="h-64 overflow-y-auto mb-4 p-2 bg-gray-100 rounded">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <span
                  className={`inline-block p-2 rounded-lg ${
                    msg.role === 'user' ? 'bg-purple-200' : 'bg-gray-200'
                  }`}
                >
                  {msg.content}
                </span>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              className="flex-1 p-2 border rounded-l-lg focus:outline-none"
              placeholder="Ask about loans or risks..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              className="p-2 bg-purple-600 text-white rounded-r-lg"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Homepage;
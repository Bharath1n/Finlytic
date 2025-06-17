import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Trash2, ChevronRight } from 'lucide-react';
import { useTheme } from './ThemeContext';
import ReactMarkdown from 'react-markdown';

const Chatbot = ({ isFullPage = false }) => {
  const { theme } = useTheme();
  const [isChatOpen, setIsChatOpen] = useState(isFullPage);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('general');
  const [requestCount, setRequestCount] = useState(0);

  // Load chat history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem(`chatHistory_${mode}`);
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    } else {
      // Welcome message per mode
      const welcomeMessages = {
        general: '**Welcome to General Mode!** Ask about budgeting, credit scores, or financial basics. Try: "What is a credit score?"',
        loan_prediction: '**Loan Prediction Mode** Ask about loan default risks or provide details (e.g., Age: 30, Income: 50000) for a prediction. Try: "What increases loan default risk?"',
        credit_risk: '**Credit Risk Mode** Ask about credit risk or provide details (e.g., Age: 25, Income: 40000, Loan Intent: education) for an assessment. Try: "What is High Risk?"'
      };
      setChatHistory([{ role: 'assistant', content: welcomeMessages[mode] }]);
    }
  }, [mode]);

  // Save chat history to localStorage
  useEffect(() => {
    localStorage.setItem(`chatHistory_${mode}`, JSON.stringify(chatHistory));
  }, [chatHistory, mode]);

  const toggleChat = () => !isFullPage && setIsChatOpen(!isChatOpen);

  const clearChat = () => {
    setChatHistory([]);
    setError('');
    localStorage.removeItem(`chatHistory_${mode}`);
  };

  const parseInputData = (msg) => {
    const fields = {};
    const regex = /(\w+):\s*([^,]+)(?:,|$)/g;
    let match;
    while ((match = regex.exec(msg))) {
      fields[match[1].trim()] = match[2].trim();
    }
    return fields;
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    let prefixedMessage = message;
    let endpoint = '/chat/';
    let payload = { message };
    let isPrediction = false;

    // Check for prediction inputs
    if (mode === 'loan_prediction' && message.toLowerCase().includes('predict')) {
      const fields = parseInputData(message);
      if (Object.keys(fields).length >= 16) { // LoanInput has 16 fields
        endpoint = '/predict/';
        payload = fields;
        isPrediction = true;
      }
    } else if (mode === 'credit_risk' && message.toLowerCase().includes('assess')) {
      const fields = parseInputData(message);
      if (Object.keys(fields).length >= 11) { // CreditRiskInput has 11 fields
        endpoint = '/credit_risk/';
        payload = fields;
        isPrediction = true;
      }
    } else {
      if (mode === 'loan_prediction') {
        prefixedMessage = `Loan Default Prediction: ${message}`;
      } else if (mode === 'credit_risk') {
        prefixedMessage = `Credit Risk Assessment: ${message}`;
      }
      payload = { message: prefixedMessage };
    }

    const userMessage = { role: 'user', content: message };
    setChatHistory([...chatHistory, userMessage]);
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(`http://localhost:8000${endpoint}`, payload);
      let botMessage;
      if (isPrediction && endpoint === '/predict/') {
        botMessage = {
          role: 'assistant',
          content: `**Loan Prediction Result**  
          - **Prediction**: ${response.data.prediction === 0 ? 'No Default' : 'Default'}  
          - **Probability**: ${(response.data.probability * 100).toFixed(2)}%`
        };
      } else if (isPrediction && endpoint === '/credit_risk/') {
        botMessage = {
          role: 'assistant',
          content: `**Credit Risk Assessment**  
          - **Risk Category**: ${response.data.credit_risk_prediction}  
          - **Probability**: ${(response.data.credit_risk_probability * 100).toFixed(2)}%`
        };
      } else {
        botMessage = { role: 'assistant', content: response.data.content };
      }
      setChatHistory((prev) => [...prev, botMessage]);
      setRequestCount((prev) => prev + 1);
    } catch (error) {
      let errorMsg = 'Error: Could not connect to chatbot. Please try again later.';
      if (error.response?.status === 429) {
        errorMsg = 'Too many requests. Please wait a minute and try again.';
      } else if (error.response?.status === 400) {
        errorMsg = `Invalid input: ${error.response.data.detail}`;
      }
      const errorMessage = { role: 'assistant', content: errorMsg };
      setError(errorMsg);
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setChatHistory([]);
    setRequestCount(0);
  };

  const quickReplies = {
    general: ['What is a credit score?', 'How to budget?', 'Explain loans'],
    loan_prediction: ['List required inputs', 'Explain default risk', 'Sample prediction'],
    credit_risk: ['What is High Risk?', 'List required inputs', 'Sample assessment']
  };

  const handleQuickReply = (reply) => {
    setMessage(reply);
    sendMessage();
  };

  const chatWindow = (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className={`${isFullPage ? 'w-full max-w-5xl mx-auto h-[80vh] flex flex-col mt-12' : 'fixed bottom-24 right-8 w-96 max-h-[80vh]'} ${
        theme === 'light' ? 'bg-white text-gray-500' : 'bg-gray-800 text-gray-300'
      } rounded-2xl shadow-xl p-6 flex flex-col ${isFullPage ? '' : 'z-50'}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-blue-500 flex items-center">
          <MessageSquare className="mr-2 w-5 h-5" /> AI Financial Assistant
        </h3>
        {!isFullPage && (
          <button
            onClick={toggleChat}
            className={`${theme === 'light' ? 'text-gray-500 hover:text-red-500' : 'text-gray-300 hover:text-red-600'}`}
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Mode Toggle Buttons */}
      <div className="flex justify-center mb-4 space-x-2">
        {['general', 'loan_prediction', 'credit_risk'].map((m) => (
          <motion.button
            key={m}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleModeChange(m)}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
              mode === m
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                : theme === 'light'
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {m === 'general' ? 'General' : m === 'loan_prediction' ? 'Loan Prediction' : 'Credit Risk'}
          </motion.button>
        ))}
      </div>

      {/* Chat History */}
      <div
        className={`flex-1 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'} rounded-xl p-4 overflow-y-auto ${
          isFullPage ? 'max-h-[60vh]' : 'max-h-[50vh]'
        }`}
      >
        {chatHistory.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <span
              className={`inline-block p-3 rounded-xl ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : theme === 'light'
                  ? 'bg-white text-gray-500'
                  : 'bg-gray-600 text-gray-300'
              } max-w-[80%]`}
            >
              {msg.role === 'assistant' ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
            </span>
          </motion.div>
        ))}
        {isLoading && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 text-sm">
            Typing...
          </motion.p>
        )}
        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-500 text-sm mt-2">
            {error}
          </motion.p>
        )}
        {requestCount >= 4 && !isLoading && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-yellow-500 text-sm mt-2">
            One more question allowed this minute.
          </motion.p>
        )}
      </div>

      {/* Quick Reply Buttons */}
      <div className="flex flex-wrap gap-2 mt-2 mb-4">
        {quickReplies[mode].map((reply) => (
          <motion.button
            key={reply}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuickReply(reply)}
            className={`px-2 py-1 text-xs rounded-full ${
              theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {reply}
          </motion.button>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex mt-4">
        <input
          type="text"
          placeholder={
            mode === 'general'
              ? 'Ask about finance...'
              : mode === 'loan_prediction'
              ? 'Ask about loan default prediction or enter data (e.g., Age: 30, Income: 50000)...'
              : 'Ask about credit risk or enter data (e.g., Age: 25, Income: 40000)...'
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className={`flex-1 p-3 ${
            theme === 'light' ? 'bg-white border-gray-300 text-gray-500' : 'bg-gray-700 border-gray-600 text-gray-300'
          } border rounded-l-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
          disabled={isLoading}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          onClick={sendMessage}
          className={`p-3 bg-gradient-to-r ${
            theme === 'light' ? 'from-blue-500 to-blue-600' : 'from-blue-600 to-blue-700'
          } text-white rounded-r-full ${
            theme === 'light' ? 'hover:from-blue-600 hover:to-blue-700' : 'hover:from-blue-700 hover:to-blue-800'
          } transition disabled:bg-gray-500`}
          disabled={isLoading}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Clear Chat Button */}
      {chatHistory.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearChat}
          className={`mt-2 p-2 ${
            theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          } rounded-full text-sm flex items-center justify-center`}
        >
          <Trash2 className="w-4 h-4 mr-1" /> Clear Chat
        </motion.button>
      )}
    </motion.div>
  );

  return (
    <>
      {!isFullPage && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleChat}
          className={`fixed bottom-8 right-8 p-4 bg-gradient-to-r ${
            theme === 'light' ? 'from-blue-500 to-blue-600' : 'from-blue-600 to-blue-700'
          } text-white rounded-full shadow-lg ${
            theme === 'light' ? 'hover:from-blue-600 hover:to-blue-700' : 'hover:from-blue-700 hover:to-blue-800'
          } transition z-50`}
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      )}
      <AnimatePresence>{(isChatOpen || isFullPage) && chatWindow}</AnimatePresence>
    </>
  );
};

export default Chatbot;
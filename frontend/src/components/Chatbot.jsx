import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, MessageSquare, X, Trash2, ChevronRight, AlertTriangle } from 'lucide-react';
import { useTheme } from './ThemeContext';
import ReactMarkdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid';

const fraudFeatures = {
  V1: -2.312227, V2: 1.951992, V3: -1.609851, V4: 3.997906, V5: -0.522188,
  V6: -1.426545, V7: -2.537387, V8: 1.391657, V9: -2.770089, V10: -2.772272,
  V11: 3.202033, V12: -2.899907, V13: -0.595222, V14: -4.289254, V15: 0.389724,
  V16: -1.140747, V17: -2.830056, V18: -0.016822, V19: 0.416956, V20: 0.126911,
  V21: 0.517232, V22: -0.035049, V23: -0.465211, V24: 0.320198, V25: 0.044519,
  V26: 0.177840, V27: 0.261145, V28: -0.143276
};

const nonFraudFeatures = {
  V1: -1.359807, V2: -0.072781, V3: 2.536347, V4: 1.378155, V5: -0.338321,
  V6: 0.462388, V7: 0.239599, V8: 0.098698, V9: 0.363787, V10: 0.090794,
  V11: -0.551600, V12: -0.617801, V13: -0.991390, V14: -0.311169, V15: 1.468177,
  V16: -0.470401, V17: 0.207971, V18: 0.025791, V19: 0.403993, V20: 0.251412,
  V21: -0.018307, V22: 0.277838, V23: -0.110474, V24: 0.066928, V25: 0.128539,
  V26: -0.189115, V27: 0.133558, V28: -0.021053
};
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const Chatbot = ({ isFullPage = false }) => {
  const [theme, setTheme] = useState('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(isFullPage);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('general');
  const [requestCount, setRequestCount] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [sessionId] = useState(uuidv4());
  const [rateLimitTimer, setRateLimitTimer] = useState(null);
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  useEffect(() => {
    localStorage.setItem('sessionId', sessionId);
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/chat_history/${sessionId}/${mode}`);
        setChatHistory(response.data.messages.length ? response.data.messages : [{ role: 'assistant', content: welcomeMessages[mode] }]);
      } catch (err) {
        setChatHistory([{ role: 'assistant', content: welcomeMessages[mode] }]);
      }
    };
    fetchChatHistory();
  }, [mode, sessionId]);

  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 ${theme === 'light' ? 'bg-blue-200/30' : 'bg-blue-400/20'} rounded-full`}
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
          }}
          animate={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      ))}
    </div>
  );

  const GradientOrb = ({ delay = 0, scale = 1, color = "blue" }) => (
    <motion.div
      className={`absolute w-96 h-96 rounded-full opacity-20 blur-3xl ${
        color === "blue" ? "bg-blue-500" : 
        color === "purple" ? "bg-purple-500" : 
        "bg-pink-500"
      }`}
      animate={{
        scale: [scale, scale * 1.2, scale],
        opacity: [0.1, 0.3, 0.1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );

  const welcomeMessages = {
    general: '**Welcome to General Mode!** Ask about budgeting, credit scores, or financial tips. Try: "What is a credit score?"',
    loan_prediction: '**Loan Prediction Mode** Predict loan default risk by entering data (e.g., Age: 30, Income: 50000, LoanAmount: 10000, CreditScore: 700, MonthsEmployed: 12, NumCreditLines: 2, InterestRate: 5.0, LoanTerm: 36, DTIRatio: 0.3, Education: bachelor, EmploymentType: full-time, MaritalStatus: single, HasMortgage: no, HasDependents: no, LoanPurpose: auto, HasCoSigner: yes). Try: "List required inputs"',
    credit_risk: '**Credit Risk Mode** Assess credit risk by entering data (e.g., person_age: 25, person_income: 40000, person_home_ownership: rent, person_emp_length: 2, loan_intent: education, loan_grade: b, loan_amnt: 5000, loan_int_rate: 6.0, loan_percent_income: 0.2, cb_person_default_on_file: n, cb_person_cred_hist_length: 3). Try: "List required inputs"',
    fraud_detection: '**Fraud Detection Mode** Predict fraud risk by entering Time and Amount. V1-V28 are preset in the form at /fraud. Try: "List fraud inputs" or "Sample fraud prediction".'
  };

  const loanFields = [
    'Age', 'Income', 'LoanAmount', 'CreditScore', 'MonthsEmployed', 'NumCreditLines',
    'InterestRate', 'LoanTerm', 'DTIRatio', 'Education', 'EmploymentType', 'MaritalStatus',
    'HasMortgage', 'HasDependents', 'LoanPurpose', 'HasCoSigner'
  ];
  const creditRiskFields = [
    'person_age', 'person_income', 'person_home_ownership', 'person_emp_length',
    'loan_intent', 'loan_grade', 'loan_amnt', 'loan_int_rate', 'loan_percent_income',
    'cb_person_default_on_file', 'cb_person_cred_hist_length'
  ];
  const fraudFields = ['Time', 'Amount'];

  const validValues = {
    Education: ['high school', 'bachelor', "master's", 'phd'],
    EmploymentType: ['full-time', 'part-time', 'self-employed', 'unemployed'],
    MaritalStatus: ['single', 'married', 'divorced'],
    HasMortgage: ['yes', 'no'],
    HasDependents: ['yes', 'no'],
    LoanPurpose: ['auto', 'business', 'education', 'home', 'other'],
    HasCoSigner: ['yes', 'no'],
    person_home_ownership: ['rent', 'own', 'mortgage', 'other'],
    loan_intent: ['personal', 'education', 'medical', 'venture', 'homeimprovement', 'debtconsolidation'],
    loan_grade: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    cb_person_default_on_file: ['y', 'n']
  };

  const toggleChat = () => !isFullPage && setIsChatOpen(!isChatOpen);

  const clearChat = async () => {
    try {
      await axios.delete(`${backendUrl}/chat_history/${sessionId}/${mode}`);
      setChatHistory([{ role: 'assistant', content: welcomeMessages[mode] }]);
      setError('');
    } catch (err) {
      setError('Failed to clear chat history.');
    }
  };

  const parseInputData = (msg) => {
    const fields = {};
    const regex = /(\w+):\s*([^,]+)(?:,|$)/g;
    let match;
    while ((match = regex.exec(msg))) {
      const key = match[1].trim();
      const value = match[2].trim();
      fields[key] = isNaN(value) ? value.toLowerCase() : Number(value);
    }
    return fields;
  };

  const validateInputs = (fields, requiredFields, mode) => {
    const missing = requiredFields.filter(field => !(field in fields));
    if (missing.length > 0) {
      return `Missing required fields: ${missing.join(', ')}`;
    }

    const invalid = [];
    for (const field of requiredFields) {
      if (validValues[field]) {
        if (!validValues[field].includes(fields[field])) {
          invalid.push(`${field} must be one of ${validValues[field].join(', ')}`);
        }
      } else if (typeof fields[field] === 'number') {
        if (isNaN(fields[field]) || (field === 'Time' || field === 'Amount' ? fields[field] < 0 : false)) {
          invalid.push(`${field} must be a valid number ${field === 'Time' || field === 'Amount' ? '>= 0' : ''}`);
        }
      }
    }
    return invalid.length > 0 ? invalid.join('; ') : null;
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    let endpoint = '/chat/';
    let payload = { session_id: sessionId, user_id: null, mode, message };
    let isPrediction = false;

    const userMessage = { role: 'user', content: message };
    setChatHistory([...chatHistory, userMessage]);
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'loan_prediction' && message.toLowerCase().includes('predict')) {
        const fields = parseInputData(message);
        const validationError = validateInputs(fields, loanFields, mode);
        if (validationError) {
          throw new Error(validationError);
        }
        if (Object.keys(fields).length >= loanFields.length) {
          endpoint = '/predict/';
          payload = fields;
          isPrediction = true;
        } else {
          const botMessage = {
            role: 'assistant',
            content: `**Incomplete Loan Prediction Inputs**  
            Please provide all required fields:  
            - ${loanFields.join('\n- ')}  
            Example: Age: 30, Income: 50000, LoanAmount: 10000, CreditScore: 700, MonthsEmployed: 12, NumCreditLines: 2, InterestRate: 5.0, LoanTerm: 36, DTIRatio: 0.3, Education: bachelor, EmploymentType: full-time, MaritalStatus: single, HasMortgage: no, HasDependents: no, LoanPurpose: auto, HasCoSigner: yes`
          };
          setChatHistory((prev) => [...prev, botMessage]);
          setIsLoading(false);
          return;
        }
      } else if (mode === 'credit_risk' && message.toLowerCase().includes('assess')) {
        const fields = parseInputData(message);
        const validationError = validateInputs(fields, creditRiskFields, mode);
        if (validationError) {
          throw new Error(validationError);
        }
        if (Object.keys(fields).length >= creditRiskFields.length) {
          endpoint = '/credit_risk/';
          payload = fields;
          isPrediction = true;
        } else {
          const botMessage = {
            role: 'assistant',
            content: `**Incomplete Credit Risk Inputs**  
            Please provide all required fields:  
            - ${creditRiskFields.join('\n- ')}  
            Example: person_age: 25, person_income: 40000, person_home_ownership: rent, person_emp_length: 2, loan_intent: education, loan_grade: b, loan_amnt: 5000, loan_int_rate: 6.0, loan_percent_income: 0.2, cb_person_default_on_file: n, cb_person_cred_hist_length: 3`
          };
          setChatHistory((prev) => [...prev, botMessage]);
          setIsLoading(false);
          return;
        }
      } else if (mode === 'fraud_detection' && message.toLowerCase().includes('predict') && /Time:\s*\d+/.test(message) && /Amount:\s*[\d.]+/.test(message)) {
        const fields = parseInputData(message);
        const validationError = validateInputs(fields, fraudFields, mode);
        if (validationError) {
          throw new Error(validationError);
        }
        if (Object.keys(fields).length >= fraudFields.length) {
          endpoint = '/fraud/';
          payload = { ...fraudFeatures, ...fields };
          isPrediction = true;
        } else {
          const botMessage = {
            role: 'assistant',
            content: `**Incomplete Fraud Detection Inputs**  
            Please provide all required fields:  
            - ${fraudFields.join('\n- ')}  
            Note: V1-V28 are preset in the form at /fraud. Try the form or use: Time: 406, Amount: 0 for a fraud sample.`
          };
          setChatHistory((prev) => [...prev, botMessage]);
          setIsLoading(false);
          return;
        }
      }

      const response = await axios.post(`${backendUrl}${endpoint}`, payload);
      let botMessage;
      if (isPrediction && endpoint === '/predict/') {
        botMessage = {
          role: 'assistant',
          content: `**Loan Default Prediction**  
          - **Result**: ${response.data.prediction === 0 ? 'No Default' : 'Default'}  
          - **Probability**: ${(response.data.probability * 100).toFixed(2)}%  
          *Note*: A higher probability indicates greater risk of default.`
        };
      } else if (isPrediction && endpoint === '/credit_risk/') {
        botMessage = {
          role: 'assistant',
          content: `**Credit Risk Assessment**  
          - **Risk Category**: ${response.data.credit_risk_prediction}  
          - **Probability**: ${(response.data.credit_risk_probability * 100).toFixed(2)}%  
          *Note*: High (>70%), Medium (30-70%), Low (<30%) risk.`
        };
      } else if (isPrediction && endpoint === '/fraud/') {
        botMessage = {
          role: 'assistant',
          content: `**Fraud Detection Prediction**  
          - **Result**: ${response.data.fraud_prediction}  
          - **Probability**: ${(response.data.fraud_probability * 100).toFixed(2)}%  
          *Note*: A probability >10% indicates likely fraud.`
        };
      } else {
        botMessage = { role: 'assistant', content: response.data.content };
      }
      setChatHistory((prev) => [...prev, botMessage]);
      setRequestCount((prev) => prev + 1);
      setRetryCount(0);
      if (response.status === 429) {
        setRateLimitTimer(60);
      }
    } catch (error) {
      let errorMsg = 'Error: Could not process request. Please try again.';
      if (error.response?.status === 429) {
        errorMsg = 'Too many requests. Please wait a minute and try again.';
      } else if (error.response?.status === 400 || error.message) {
        errorMsg = `Invalid input: ${error.response?.data?.detail || error.message}`;
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
    setChatHistory([{ role: 'assistant', content: welcomeMessages[newMode] }]);
    setRequestCount(0);
    setError('');
    setRateLimitTimer(null);
  };

  const quickReplies = {
    general: ['What is a credit score?', 'How to budget?', 'Explain loans'],
    loan_prediction: ['List required inputs', 'Explain default risk', 'Sample prediction'],
    credit_risk: ['List required inputs', 'What is High Risk?', 'Sample assessment'],
    fraud_detection: ['List fraud inputs', 'Explain fraud prediction', 'Sample fraud prediction']
  };

  const handleQuickReply = (reply) => {
    if (reply === 'List required inputs') {
      const fields = mode === 'loan_prediction' ? loanFields : mode === 'credit_risk' ? creditRiskFields : fraudFields;
      const botMessage = {
        role: 'assistant',
        content: `**Required Inputs for ${mode === 'loan_prediction' ? 'Loan Prediction' : mode === 'credit_risk' ? 'Credit Risk' : 'Fraud Detection'}**  
        - ${fields.join('\n- ')}`
      };
      setChatHistory((prev) => [...prev, botMessage]);
    } else if (reply === 'Sample prediction' || reply === 'Sample assessment') {
      const sampleInput = mode === 'loan_prediction'
        ? 'Predict loan for Age: 30, Income: 50000, LoanAmount: 10000, CreditScore: 700, MonthsEmployed: 12, NumCreditLines: 2, InterestRate: 5.0, LoanTerm: 36, DTIRatio: 0.3, Education: bachelor, EmploymentType: full-time, MaritalStatus: single, HasMortgage: no, HasDependents: no, LoanPurpose: auto, HasCoSigner: yes'
        : 'Assess risk for person_age: 25, person_income: 40000, person_home_ownership: rent, person_emp_length: 2, loan_intent: education, loan_grade: b, loan_amnt: 5000, loan_int_rate: 6.0, loan_percent_income: 0.2, cb_person_default_on_file: n, cb_person_cred_hist_length: 3';
      setMessage(sampleInput);
      sendMessage();
    } else if (reply === 'List fraud inputs') {
      const botMessage = {
        role: 'assistant',
        content: '**Required Inputs for Fraud Detection**  \n- Time (seconds since first transaction)  \n- Amount (transaction amount in dollars)  \nNote: V1-V28 are preset in the form at /fraud.'
      };
      setChatHistory((prev) => [...prev, botMessage]);
    } else if (reply === 'Sample fraud prediction') {
      const sampleInput = 'Predict fraud for Time: 406, Amount: 0';
      setMessage(sampleInput);
      sendMessage();
    } else {
      setMessage(reply);
      sendMessage();
    }
  };
  const chatWindow = (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className={`
        ${isFullPage ? 'max-w-4xl mx-auto h-[75vh] flex flex-col mt-12' : 'fixed bottom-24 right-8 w-96 max-h-[80vh]'}
        ${theme === 'light' 
          ? 'bg-white/90 text-gray-700 border border-gray-200 shadow-2xl' 
          : 'bg-black/80 text-gray-300 border border-gray-700 shadow-black/40'}
        rounded-3xl p-6 flex flex-col z-50 backdrop-blur-md
      `}
      style={{ backdropFilter: 'blur(12px)' }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent flex items-center">
          <MessageSquare className="mr-2 w-6 h-6" />
          AI Financial Assistant
        </h3>
        {!isFullPage && (
          <motion.button
            onClick={toggleChat}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0.7 }}
            whileFocus={{ opacity: 1 }}
            className="text-gray-500 hover:text-red-500 focus:outline-none"
            aria-label="Close chat"
          >
            <X className="w-6 h-6" />
          </motion.button>
        )}
      </div>

      <div className={`flex justify-center mb-5 flex-wrap gap-2`}>
        {['general', 'loan_prediction', 'credit_risk', 'fraud_detection'].map((m) => (
          <motion.button
            key={m}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleModeChange(m)}
            className={`
              text-sm font-semibold rounded-full px-4 py-1
              transition-colors duration-300
              ${mode === m ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' :
                theme === 'light'
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
            `}
          >
            {m === 'general' ? 'General' : m === 'loan_prediction' ? 'Loan Prediction' : m === 'credit_risk' ? 'Credit Risk' : 'Fraud Detection'}
          </motion.button>
        ))}
      </div>

      <div
        className={`
          flex-1 overflow-y-auto rounded-2xl p-4
          ${theme === 'light' ? 'bg-white/60' : 'bg-black/40'}
          scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent
          ${isFullPage ? 'max-h-[60vh]' : 'max-h-[50vh]'}
        `}
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
              className={`
                inline-block p-3 rounded-2xl max-w-[80%]
                ${msg.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : theme === 'light'
                  ? 'bg-white shadow-inner text-gray-700'
                  : 'bg-gray-800 text-gray-300 shadow-inner'}
              `}
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {msg.role === 'assistant' ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
            </span>
          </motion.div>
        ))}
        {isLoading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} text-sm`}
          >
            Typing...
          </motion.p>
        )}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-500 text-sm mt-2"
          >
            {error}
          </motion.p>
        )}
        {rateLimitTimer && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-yellow-400 text-sm mt-2"
          >
            Too many requests. Please wait {rateLimitTimer} seconds.
          </motion.p>
        )}
        {requestCount >= 4 && !isLoading && !error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-yellow-400 text-sm mt-2"
          >
            One more request allowed this minute.
          </motion.p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-4 mb-4 justify-center">
        {quickReplies[mode].map((reply) => (
          <motion.button
            key={reply}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuickReply(reply)}
            className={`
              px-3 py-1 rounded-full text-xs font-medium
              ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
              shadow
            `}
          >
            {reply}
          </motion.button>
        ))}
      </div>

      <div className="flex mt-4">
        <input
          type="text"
          placeholder={
            mode === 'general'
              ? 'Ask about finance...'
              : mode === 'loan_prediction'
              ? 'Enter loan data or ask about predictions'
              : mode === 'credit_risk'
              ? 'Enter credit risk data or ask about risks'
              : 'Enter fraud data or ask about fraud'
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          disabled={isLoading}
          className={`
            flex-1 p-3 rounded-l-3xl border
            ${error ? 'border-red-500' : theme === 'light' ? 'border-gray-300 text-gray-700' : 'border-gray-600 text-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80 dark:bg-black/70
            placeholder-gray-400 placeholder-opacity-70
          `}
          style={{ backdropFilter: 'blur(10px)' }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={sendMessage}
          disabled={isLoading}
          className={`
            p-3 rounded-r-3xl text-white
            bg-gradient-to-r from-purple-600 to-pink-600
            hover:from-purple-700 hover:to-pink-700
            disabled:bg-gray-500 disabled:cursor-not-allowed
            transition-colors duration-300
          `}
          aria-label="Send message"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

      {chatHistory.length > 1 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearChat}
          className={`
            mt-4 p-2 rounded-full 
            ${theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
            flex items-center justify-center text-sm font-semibold shadow-md
            transition-colors duration-300
          `}
          aria-label="Clear chat"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Clear Chat
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
          className={`
            fixed bottom-8 right-8 p-4 rounded-full shadow-lg z-50
            bg-gradient-to-r from-purple-600 to-pink-600 text-white
            hover:from-purple-700 hover:to-pink-700 transition-colors duration-300
          `}
          aria-label="Open chat"
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      )}
      <AnimatePresence>{(isChatOpen || isFullPage) && chatWindow}</AnimatePresence>
    </>
  );
};

export default Chatbot;
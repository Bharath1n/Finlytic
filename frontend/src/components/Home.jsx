import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, ChevronRight, MessageSquare, CreditCard, Shield, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useTheme } from './ThemeContext'; // Added useTheme import

const Homepage = () => {
  const { theme } = useTheme(); // Access theme state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const userMessage = { role: "user", content: message };
    setChatHistory([...chatHistory, userMessage]);
    setMessage("");
    setError("");
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/chat/", { message });
      const botMessage = { role: "assistant", content: response.data.content };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { role: "assistant", content: "Error: Could not connect to chatbot. Please try again later." };
      setError("Failed to get response from chatbot.");
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen font-mono ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="min-h-screen flex flex-col items-center justify-center text-center"
      >
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold tracking-tight"
        >
          FIN-LYTIC
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className={`text-lg md:text-xl ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'} mt-6 max-w-2xl`}
        >
          AI-driven financial insights for smarter decisions.
        </motion.p>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 flex flex-wrap justify-center gap-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full text-lg flex items-center ${theme === 'light' ? 'hover:from-blue-600 hover:to-blue-700' : 'hover:from-blue-700 hover:to-blue-800'} transition shadow-lg`}
            onClick={toggleChat}
          >
            <MessageSquare className="mr-2 w-5 h-5" /> Chat with AI
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`bg-transparent border-2 ${theme === 'light' ? 'border-gray-300 text-gray-500 hover:bg-gray-100' : 'border-gray-600 text-gray-300 hover:bg-gray-800'} px-8 py-4 rounded-full text-lg flex items-center transition`}
          >
            <Link to="/dashboard" className="flex items-center">
              Explore Dashboard <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className={`py-24 px-8 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight"
        >
          Our Solutions
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Loan Default Prediction",
              desc: "Forecast loan defaults with precision using AI.",
              icon: <CreditCard className="w-8 h-8 text-blue-500" />,
            },
            {
              title: "Credit Risk Analysis",
              desc: "Assess credit risks instantly with real-time data.",
              icon: <Shield className="w-8 h-8 text-blue-500" />,
            },
            {
              title: "AI Financial Assistant",
              desc: "Get instant financial guidance via our smart chatbot.",
              icon: <Bot className="w-8 h-8 text-blue-500" />,
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.8 }}
              className={`${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600'} border rounded-2xl p-8 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-shadow`}
            >
              <div className="flex items-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className={`py-24 px-8 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight"
        >
          About FIN-LYTIC
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className={`text-lg ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'} max-w-3xl mx-auto text-center`}
        >
          Fin-Lytic delivers cutting-edge AI solutions to simplify financial decisions, empowering users with clarity and confidence.
        </motion.p>
      </section>

      {/* Contact Section */}
      <section className={`py-24 px-8 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight"
        >
          Connect with Us
        </motion.h2>
        <motion.form
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-md mx-auto space-y-6"
        >
          <input
            type="text"
            placeholder="Name"
            className={`w-full p-4 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-500' : 'bg-gray-700 border-gray-600 text-gray-300'} border rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <input
            type="email"
            placeholder="Email"
            className={`w-full p-4 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-500' : 'bg-gray-700 border-gray-600 text-gray-300'} border rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <textarea
            placeholder="Message"
            rows="4"
            className={`w-full p-4 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-500' : 'bg-gray-700 border-gray-600 text-gray-300'} border rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          ></textarea>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className={`w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-lg font-semibold ${theme === 'light' ? 'hover:from-blue-600 hover:to-blue-700' : 'hover:from-blue-700 hover:to-blue-800'} transition shadow-lg`}
          >
            Send <ChevronRight className="inline w-5 h-5 ml-2" />
          </motion.button>
        </motion.form>
      </section>

      {/* Chatbot */}
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`fixed bottom-8 right-8 w-80 ${theme === 'light' ? 'bg-white text-gray-500' : 'bg-gray-800 text-gray-300'} rounded-2xl shadow-xl p-6`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-blue-500 flex items-center">
              <Bot className="mr-2 w-5 h-5" /> AI Assistant
            </h3>
            <button onClick={toggleChat} className={`${theme === 'light' ? 'text-gray-500 hover:text-red-500' : 'text-gray-300 hover:text-red-600'}`}>
              <X size={24} />
            </button>
          </div>
          <div className={`h-64 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'} rounded-xl p-4 overflow-y-auto`}>
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`mb-3 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                <span
                  className={`inline-block p-3 rounded-full ${msg.role === "user" ? 'bg-blue-500 text-white' : theme === 'light' ? 'bg-white text-gray-500' : 'bg-gray-600 text-gray-300'}`}
                >
                  {msg.content}
                </span>
              </div>
            ))}
            {isLoading && <p className="text-center text-gray-500 text-lg">Loading...</p>}
            {error && <p className="text-center text-red-500 text-lg mt-2">{error}</p>}
          </div>
          <div className="flex mt-4">
            <input
              type="text"
              placeholder="Ask about loans or risks..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className={`flex-1 p-3 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-500' : 'bg-gray-700 border-gray-600 text-gray-300'} border rounded-l-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={isLoading}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              onClick={sendMessage}
              className={`p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-r-full ${theme === 'light' ? 'hover:from-blue-600 hover:to-blue-700' : 'hover:from-blue-700 hover:to-blue-800'} transition disabled:bg-gray-500`}
              disabled={isLoading}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Homepage;

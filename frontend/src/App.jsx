import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React, { useState, lazy, Suspense } from 'react';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Menu, X, ChevronRight, CreditCard, Shield, Bot, TrendingUp, Zap, Star, ArrowRight, Play, Users, Award, DollarSign, Github, Twitter, Linkedin, Mail } from "lucide-react";

const Home = lazy(() => import('./components/Home'));
const PredictionForm = lazy(() => import('./components/PredictionForm'));
const PredictionFormCreditRisk = lazy(() => import('./components/PredictionFormCreditRisk'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const FraudPredictionForm = lazy(() => import('./components/FraudPredictionForm'));
const Info = lazy(() => import('./components/Info'));
const Chatbot = lazy(() => import('./components/Chatbot'));

const FloatingChatbot = () => {
  const location = useLocation();
  if (location.pathname === '/chatbot') return null;
  return (
    <Suspense fallback={<div className="fixed bottom-6 right-6 w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>}>
      <Chatbot isFullPage={false} />
    </Suspense>
  );
};

const AppContent = () => {
  const [theme, setTheme] = useState('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
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


  return (
    <Router>
    <div className={`min-h-screen font-mono relative overflow-hidden ${theme === 'light' ? 'bg-gradient-to-br from-gray-50 via-white to-blue-50 text-black' : 'bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white'}`}>
          <FloatingElements />
          
          {/* Gradient Orbs */}
          <GradientOrb delay={0} scale={1} color="blue" />
          <GradientOrb delay={2} scale={0.8} color="purple" />
          <GradientOrb delay={4} scale={0.6} color="pink" />
    
          {/* Simplified Navigation */}
          <nav className="relative z-50 p-6">
            <motion.div 
              className={`backdrop-blur-xl ${theme === 'light' ? 'bg-white/20 border-white/20' : 'bg-black/20 border-white/10'} border rounded-2xl p-4 max-w-7xl mx-auto flex justify-between items-center`}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                FIN-LYTIC
              </motion.div>
              <div className="hidden md:flex space-x-8 items-center">
                {['Dashboard','Loan', 'Credit-Risk', 'Chatbot'].map((item, i) => (
                  <motion.a
                    key={item}
                    href={`${item.toLowerCase()}`}
                    className={`${theme === 'light' ? 'text-gray-700 hover:text-blue-600' : 'text-gray-300 hover:text-blue-400'} transition-colors relative group`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.5 }}
                    whileHover={{ y: -2 }}
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                  </motion.a>
                ))}
                <motion.button
                  onClick={toggleTheme}
                  className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-800 text-gray-200'} hover:scale-110 transition-all`}
                  whileHover={{ rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </motion.button>
              </div>
              
              {/* Mobile menu button */}
              <button
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </motion.div>
            
            {/* Mobile menu */}
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`md:hidden mt-4 ${theme === 'light' ? 'bg-white/90' : 'bg-black/90'} backdrop-blur-xl border ${theme === 'light' ? 'border-white/20' : 'border-white/10'} rounded-2xl p-4`}
              >
                {['Features', 'Solutions', 'Demo', 'About'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className={`block py-2 ${theme === 'light' ? 'text-gray-700 hover:text-blue-600' : 'text-gray-300 hover:text-blue-400'} transition-colors`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
              </motion.div>
            )}
          </nav>
          <Suspense fallback={<div className="text-center text-xl">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/loan" element={<PredictionForm />} />
              <Route path="/credit-risk" element={<PredictionFormCreditRisk />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/fraud-detection" element={<FraudPredictionForm />} />
              <Route path="/info" element={<Info />} />
              <Route path="/chatbot" element={<Chatbot isFullPage={true} />} />
            </Routes>
          </Suspense>
          <footer id="about" className={`${theme === 'light' ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' : 'bg-gradient-to-br from-black via-gray-900 to-blue-900'} text-white relative overflow-hidden`}>
        {/* Footer Content */}
        <div className="relative z-10 px-8 pt-20 pb-8">
          <div className="max-w-7xl mx-auto">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              {/* Brand Section */}
              <div className="col-span-1 md:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                    FIN-LYTIC
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
                    Revolutionizing financial intelligence with AI-powered predictions, analytics, and insights. Your trusted partner in financial decision making.
                  </p>
                  <div className="flex space-x-4">
                    {[
                      { icon: Github, href: "#" },
                      { icon: Twitter, href: "#" },
                      { icon: Linkedin, href: "#" },
                      { icon: Mail, href: "mailto:hello@fin-lytic.com" }
                    ].map((social, i) => (
                      <motion.a
                        key={i}
                        href={social.href}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 bg-white/10 hover:bg-blue-500 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/20"
                      >
                        <social.icon className="w-5 h-5" />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Quick Links */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4 className="text-xl font-semibold mb-6 text-blue-300">Quick Links</h4>
                  <ul className="space-y-3">
                    {['Dashboard', 'Loan Predictions', 'Credit Risk', 'AI Assistant', 'Analytics'].map((item, i) => (
                      <li key={i}>
                        <motion.a
                          href="#"
                          className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                          whileHover={{ x: 5 }}
                        >
                          <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {item}
                        </motion.a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-12"
            >
              <div className="text-center max-w-2xl mx-auto">
                <h4 className="text-2xl font-bold mb-4">Stay Updated</h4>
                <p className="text-gray-300 mb-6">Get the latest insights and updates from FIN-LYTIC delivered to your inbox.</p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Bottom Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center"
            >
              <div className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
                <p>&copy; 2025 FIN-LYTIC. All rights reserved.</p>
              </div>
              <div className="flex space-x-6 text-sm">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                    whileHover={{ y: -1 }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
          />
        </div>
      </footer>
    </div>
    </Router>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
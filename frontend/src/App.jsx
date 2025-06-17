import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './components/Home';
import PredictionForm from './components/PredictionForm';
import PredictionFormCreditRisk from './components/PredictionFormCreditRisk';
import Dashboard from './components/Dashboard';
import Info from './components/Info';
import Chatbot from './components/Chatbot';
import { ThemeProvider, ThemeToggle, useTheme } from './components/ThemeContext';

// Wrapper to conditionally render floating chatbot
const FloatingChatbot = () => {
  const location = useLocation();
  if (location.pathname === '/chatbot') return null;
  return <Chatbot isFullPage={false} />;
};

const AppContent = () => {
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Animation variants for mobile menu
  const menuVariants = {
    closed: { x: '100%', opacity: 0 },
    open: { x: 0, opacity: 1 },
  };

  return (
    <Router>
      <div className={`min-h-screen font-mono ${theme === 'light' ? 'bg-gradient-to-br from-indigo-50 to-purple-50' : 'bg-gradient-to-br from-gray-900 to-gray-800'}`}>
        <nav className={`fixed top-0 left-0 w-full z-50 py-6 px-8 ${theme === 'light' ? 'bg-white/95' : 'bg-gray-800/95'} backdrop-blur-lg rounded-b-2xl shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-shadow`}>
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Logo or Brand */}
            <Link to="/" className={`text-xl font-bold ${theme === 'light' ? 'text-blue-500' : 'text-blue-400'}`}>
              FIN-LYTIC
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-300'} hover:text-blue-500 transition text-lg flex items-center`}>
                HOME <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
              <Link to="/dashboard" className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-300'} hover:text-blue-500 transition text-lg flex items-center`}>
                DASHBOARD <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
              <Link to="/loan" className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-300'} hover:text-blue-500 transition text-lg flex items-center`}>
                LOAN PREDICTION <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
              <Link to="/credit-risk" className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-300'} hover:text-blue-500 transition text-lg flex items-center`}>
                CREDIT RISK <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
              <Link to="/chatbot" className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-300'} hover:text-blue-500 transition text-lg flex items-center`}>
                CHATBOT <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
              <Link to="/info" className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-300'} hover:text-blue-500 transition text-lg flex items-center`}>
                LEARN MORE <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
              <ThemeToggle />
            </div>
            {/* Hamburger Button */}
            <button className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-300'} md:hidden`} onClick={toggleMenu}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              transition={{ duration: 0.3 }}
              className={`fixed top-0 right-0 h-full w-3/4 max-w-xs z-60 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-8 flex flex-col space-y-6 shadow-lg md:hidden`}
            >
              <div className="flex justify-between items-center mb-6">
                <span className={`text-xl font-bold ${theme === 'light' ? 'text-blue-500' : 'text-blue-400'}`}>FIN-LYTIC</span>
                <button onClick={toggleMenu} className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
                  <X size={28} />
                </button>
              </div>
              <Link
                to="/"
                className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-300'} hover:text-blue-500 transition text-lg flex items-center`}
                onClick={toggleMenu}
              >
                HOME <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
              <Link
                to="/dashboard"
                className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-300'} hover:text-blue-500 transition text-lg flex items-center`}
                onClick={toggleMenu}
              >
                DASHBOARD <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
              <Link
                to="/loan"
                className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-300'} hover:text-blue-500 transition text-lg flex items-center`}
                onClick={toggleMenu}
              >
                LOAN PREDICTION <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
              <Link
                to="/credit-risk"
                className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-300'} hover:text-blue-500 transition text-lg flex items-center`}
                onClick={toggleMenu}
              >
                CREDIT RISK <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
              <Link
                to="/chatbot"
                className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-300'} hover:text-blue-500 transition text-lg flex items-center`}
                onClick={toggleMenu}
              >
                CHATBOT <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
              <Link
                to="/info"
                className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-300'} hover:text-blue-500 transition text-lg flex items-center`}
                onClick={toggleMenu}
              >
                LEARN MORE <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
              <div className="pt-4">
                <ThemeToggle />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay for Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-50 md:hidden"
            onClick={toggleMenu}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 py-8 mt-11">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/loan" element={<PredictionForm />} />
            <Route path="/credit-risk" element={<PredictionFormCreditRisk />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/info" element={<Info />} />
            <Route path="/chatbot" element={<Chatbot isFullPage={true} />} />
          </Routes>
        </div>
        <FloatingChatbot />
        <footer className={`py-12 px-8 text-center font-mono ${theme === 'light' ? 'bg-black text-white' : 'bg-gray-950 text-gray-300'}`}>
          <p className="text-lg">© 2025 Fin-Lytic. All rights reserved.</p>
          <div className="mt-4 space-x-8">
            <Link to="/info" className="hover:text-blue-500 text-lg">About</Link>
            <Link to="/contact" className="hover:text-blue-500 text-lg">Contact</Link>
            <Link to="/privacy" className="hover:text-blue-500 text-lg">Privacy</Link>
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
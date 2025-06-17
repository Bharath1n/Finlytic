import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useState } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import { motion } from 'framer-motion';
import Home from './components/Home';
import PredictionForm from './components/PredictionForm';
import PredictionFormCreditRisk from './components/PredictionFormCreditRisk';
import Dashboard from './components/Dashboard';
import Info from './components/Info';
import { ThemeProvider, ThemeToggle, useTheme } from './components/ThemeContext';

// Separate component to use useTheme within ThemeProvider
const AppContent = () => {
  const { theme } = useTheme(); // Now safely destructured within ThemeProvider
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <Router>
      <div className={`min-h-screen font-mono ${theme === 'light' ? 'bg-gradient-to-br from-indigo-50 to-purple-50' : 'bg-gradient-to-br from-gray-900 to-gray-800'}`}>
        <nav className={`fixed top-0 left-0 w-full z-50 py-6 px-8 ${theme === 'light' ? 'bg-white/95' : 'bg-gray-800/95'} backdrop-blur-lg rounded-b-2xl shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-shadow`}>
          <div className="max-w-7xl mx-auto flex justify-center items-center">
            <div className="flex items-center space-x-12">
              <div className="hidden md:flex space-x-8">
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
                <Link to="/info" className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-300'} hover:text-blue-500 transition text-lg flex items-center`}>
                  LEARN MORE <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
                <ThemeToggle className="top-4 right-16 md:right-4 z-50" />
              </div>
              {/* Uncommented button works with motion */}
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-r ${theme === 'light' ? 'from-blue-500 to-blue-600' : 'from-blue-600 to-blue-700'} text-white px-6 py-2 rounded-full text-lg flex items-center hover:from-blue-600 hover:to-blue-700 transition`}
              >
                Get Started <ChevronRight className="ml-2 w-4 h-4" />
              </motion.button> */}
              <button className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-300'} md:hidden`} onClick={toggleMenu}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`md:hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-8 flex flex-col space-y-6 mt-4 rounded-b-2xl shadow-lg`}
            >
              <Link to="/" className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-300'} hover:text-blue-500 transition text-lg flex items-center`} onClick={toggleMenu}>
                HOME <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
              <Link to="/dashboard" className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-300'} hover:text-blue-500 transition text-lg flex items-center`} onClick={toggleMenu}>
                DASHBOARD <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
              <Link to="/loan" className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-300'} hover:text-blue-500 transition text-lg flex items-center`} onClick={toggleMenu}>
                LOAN PREDICTION <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
              <Link to="/credit-risk" className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-300'} hover:text-blue-500 transition text-lg flex items-center`} onClick={toggleMenu}>
                CREDIT RISK <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
              <Link to="/info" className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-300'} hover:text-blue-500 transition text-lg flex items-center`} onClick={toggleMenu}>
                LEARN MORE <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-r ${theme === 'light' ? 'from-blue-500 to-blue-600' : 'from-blue-600 to-blue-700'} text-white px-6 py-2 rounded-full text-lg flex items-center hover:from-blue-600 hover:to-blue-700 transition`}
                onClick={toggleMenu}
              >
                Get Started <ChevronRight className="ml-2 w-4 h-4" />
              </motion.button> */}
            </motion.div>
          )}
        </nav>
        <div className="max-w-7xl mx-auto px-4 py-8 mt-11">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/loan" element={<PredictionForm />} />
            <Route path="/credit-risk" element={<PredictionFormCreditRisk />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/info" element={<Info />} />
          </Routes>
        </div>
      </div>
      {/* Footer */}
      <footer className={`py-12 px-8 text-center font-mono ${theme === 'light' ? 'bg-black text-white' : 'bg-gray-950 text-gray-300'}`}>
        <p className="text-lg">© 2025 Fin-Lytic. All rights reserved.</p>
        <div className="mt-4 space-x-8">
          <Link to="/info" className="hover:text-blue-500 text-lg">About</Link>
          <Link to="/contact" className="hover:text-blue-500 text-lg">Contact</Link>
          <Link to="/privacy" className="hover:text-blue-500 text-lg">Privacy</Link>
        </div>
      </footer>
    </Router>
    
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;

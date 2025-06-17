import React, { createContext, useContext, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion'; // Added missing import

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="static top-4 right-4 p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition shadow-lg"
    >
      {theme === 'light' ? <Moon className="w-5 h-7" /> : <Sun className="w-5 h-7" />}
    </motion.button>
  );
};
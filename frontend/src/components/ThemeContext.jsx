import React, { createContext, useContext, useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check for saved theme preference or default to 'dark'
    const savedTheme = localStorage.getItem('finlytic-theme');
    return savedTheme || 'dark';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('finlytic-theme', newTheme);
  };

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const themeConfig = {
    light: {
      background: 'from-gray-50 via-white to-blue-50',
      text: 'text-gray-900',
      card: 'bg-white/80 border-gray-200/50',
      input: 'bg-white/50 border-gray-200 text-gray-900',
      button: 'bg-blue-600 hover:bg-blue-700',
      accent: 'text-blue-600',
      muted: 'text-gray-500',
    },
    dark: {
      background: 'from-gray-900 via-black to-blue-900',
      text: 'text-gray-100',
      card: 'bg-gray-800/80 border-gray-700/50',
      input: 'bg-gray-800/50 border-gray-600 text-gray-100',
      button: 'bg-blue-600 hover:bg-blue-700',
      accent: 'text-blue-400',
      muted: 'text-gray-400',
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      config: themeConfig[theme] 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <motion.div
      className="fixed top-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.button
        onClick={toggleTheme}
        className={`group relative overflow-hidden p-4 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
          theme === 'light'
            ? 'bg-white/20 border-white/30 hover:bg-white/30 text-gray-800'
            : 'bg-black/20 border-white/20 hover:bg-black/30 text-gray-200'
        }`}
        whileHover={{ 
          scale: 1.1,
          rotate: [0, -10, 10, -10, 0],
          transition: { duration: 0.5 }
        }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Background glow effect */}
        <motion.div
          className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            theme === 'light'
              ? 'bg-gradient-to-r from-yellow-200/50 to-orange-200/50'
              : 'bg-gradient-to-r from-blue-500/30 to-purple-500/30'
          }`}
          initial={{ scale: 0 }}
          whileHover={{ scale: 1 }}
        />
        
        {/* Icon container */}
        <div className="relative z-10">
          <motion.div
            key={theme}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {theme === 'light' ? (
              <Moon className="w-6 h-6" />
            ) : (
              <Sun className="w-6 h-6" />
            )}
          </motion.div>
        </div>

        {/* Ripple effect */}
        <motion.div
          className={`absolute inset-0 rounded-2xl ${
            theme === 'light' ? 'bg-yellow-400' : 'bg-blue-400'
          }`}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 0, opacity: 0 }}
          whileTap={{
            scale: [0, 1.5, 2],
            opacity: [0.5, 0.3, 0],
            transition: { duration: 0.6 }
          }}
        />

        {/* Tooltip */}
        <motion.div
          className={`absolute -bottom-12 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            theme === 'light'
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-800'
          }`}
          initial={{ y: -10 }}
          animate={{ y: 0 }}
        >
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          <div
            className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-transparent ${
              theme === 'light' ? 'border-b-4 border-b-gray-800' : 'border-b-4 border-b-white'
            }`}
          />
        </motion.div>
      </motion.button>
    </motion.div>
  );
};
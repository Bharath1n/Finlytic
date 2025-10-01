import { BrowserRouter as Router, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Github, Twitter, Linkedin, Mail, ChevronDown, User, Settings, LogOut, Sparkles } from 'lucide-react';
import { authgearClient, initializeAuthgear } from './authgear';
import { SessionState } from '@authgear/web';
import Callback from './components/Callback';

// Lazy load components for better performance
const Home = lazy(() => import('./components/Home'));
const PredictionForm = lazy(() => import('./components/PredictionForm'));
const PredictionFormCreditRisk = lazy(() => import('./components/PredictionFormCreditRisk'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const FraudPredictionForm = lazy(() => import('./components/FraudPredictionForm'));
const Info = lazy(() => import('./components/Info'));
const Chatbot = lazy(() => import('./components/Chatbot'));

// Enhanced Loading component with theme support
const LoadingSpinner = () => {
  const { theme } = useTheme();
  return (
    <div className={`flex items-center justify-center min-h-screen ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50' 
        : 'bg-gradient-to-br from-slate-900 via-blue-950/50 to-indigo-950'
    }`}>
      <div className="relative">
        <div className={`w-16 h-16 rounded-full border-4 ${
          theme === 'light' 
            ? 'border-blue-100 border-t-blue-600' 
            : 'border-slate-700 border-t-blue-400'
        } animate-spin`}></div>
        <div className={`absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent ${
          theme === 'light' ? 'border-t-indigo-500' : 'border-t-purple-400'
        } animate-spin`} style={{ animationDelay: '0.15s' }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className={`w-6 h-6 ${
            theme === 'light' ? 'text-blue-600' : 'text-blue-400'
          } animate-pulse`} />
        </div>
      </div>
      <div className="ml-4">
        <p className={`text-lg font-semibold ${
          theme === 'light' ? 'text-slate-700' : 'text-slate-300'
        }`}>Loading...</p>
        <p className={`text-sm ${
          theme === 'light' ? 'text-slate-500' : 'text-slate-400'
        }`}>Please wait while we prepare your experience</p>
      </div>
    </div>
  );
};

// Enhanced Floating Chatbot Component
const FloatingChatbot = () => {
  const location = useLocation();
  const { theme } = useTheme();
  
  if (location.pathname === '/chatbot') return null;
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, duration: 0.5, type: "spring" }}
      className="fixed bottom-8 right-8 z-50"
    >
      <Suspense fallback={
        <div className={`w-14 h-14 ${
          theme === 'light' 
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600'
        } rounded-full animate-pulse shadow-lg`}></div>
      }>
        <Chatbot isFullPage={false} />
      </Suspense>
    </motion.div>
  );
};

// Enhanced Motion Link
const MotionLink = motion.create(Link);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authgearClient.sessionState === SessionState.Authenticated
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Wait for authgear to initialize
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsAuthenticated(authgearClient.sessionState === SessionState.Authenticated);
      } catch (error) {
        console.error('Auth state check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const onSessionStateChange = (container) => {
      setIsAuthenticated(container.sessionState === SessionState.Authenticated);
      setIsLoading(false);
    };

    authgearClient.delegate = { onSessionStateChange };
    checkAuthState();

    return () => {
      authgearClient.delegate = undefined;
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Main App Content
const AppContent = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPredictionDropdownOpen, setIsPredictionDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  // Initialize Authgear
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await initializeAuthgear();
        setIsAuthInitialized(true);
      } catch (error) {
        console.error('Failed to configure Authgear client:', error);
        setIsAuthInitialized(true); // Still set to true to prevent infinite loading
      }
    };

    initializeAuth();
  }, []);

  // Fetch user info when authenticated
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (authgearClient.sessionState === SessionState.Authenticated) {
        try {
          const info = await authgearClient.fetchUserInfo();
          setUserInfo(info);
        } catch (error) {
          console.error('Failed to fetch user info:', error);
          setUserInfo(null);
        }
      } else {
        setUserInfo(null);
      }
    };

    if (isAuthInitialized) {
      fetchUserInfo();
    }
  }, [authgearClient.sessionState, isAuthInitialized]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsPredictionDropdownOpen(false);
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mainNavItems = [
    { label: 'HOME', path: '/' },
    { label: 'DASHBOARD', path: '/dashboard' },
    { label: 'FIN AI', path: '/chatbot' },
    { label: 'INFO', path: '/info' },
  ];

  const predictionNavItems = [
    { label: 'LOAN DEFAULT', path: '/loan' },
    { label: 'CREDIT RISK', path: '/credit-risk' },
    { label: 'FRAUD', path: '/fraud-detection' },
  ];

  const handleLogin = async () => {
    try {
      // Dynamically determine the redirect URI based on current location
      const currentPort = window.location.port;
      const redirectURI = window.location.hostname === 'localhost'
        ? `http://localhost:${currentPort || '5173'}/callback`
        : 'https://finlytic.vercel.app/callback';
      
      console.log('Starting authentication with redirect URI:', redirectURI);
      
      await authgearClient.startAuthentication({
        redirectURI,
        prompt: 'login',
      });
    } catch (error) {
      console.error('Login failed:', error);
      
      // Provide more helpful error messages
      if (error.message?.includes('CORS')) {
        console.error('CORS error detected. Make sure the development server proxy is configured correctly.');
      } else if (error.message?.includes('Failed to fetch')) {
        console.error('Network error. Check your internet connection and Authgear configuration.');
      }
      
      // You might want to show a user-friendly error message here
      alert('Login failed. Please check your internet connection and try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await authgearClient.logout({
        force: true,
        redirectURI: window.location.origin,
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleManageAccount = () => {
    try {
      authgearClient.open("/settings");
    } catch (error) {
      console.error('Failed to open settings:', error);
    }
  };

  // Enhanced theme colors configuration
  const themeColors = {
    light: {
      bg: 'bg-gradient-to-br from-slate-50 via-white to-blue-50/50',
      navBg: 'bg-white/80 border-slate-200/50',
      text: 'text-slate-700',
      textSecondary: 'text-slate-600',
      textMuted: 'text-slate-500',
      hover: 'hover:text-blue-600',
      accent: 'from-blue-600 to-indigo-600',
      accentHover: 'from-blue-700 to-indigo-700',
      card: 'bg-white/70 border-slate-200/50',
      dropdown: 'bg-white/95 border-slate-200/50',
      shadow: 'shadow-lg shadow-slate-200/50',
    },
    dark: {
      bg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950/50',
      navBg: 'bg-slate-800/80 border-slate-700/50',
      text: 'text-slate-100',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-400',
      hover: 'hover:text-blue-400',
      accent: 'from-blue-500 to-purple-600',
      accentHover: 'from-blue-600 to-purple-700',
      card: 'bg-slate-800/70 border-slate-700/50',
      dropdown: 'bg-slate-800/95 border-slate-700/50',
      shadow: 'shadow-lg shadow-black/30',
    }
  };

  const colors = themeColors[theme];

  // Floating Elements Animation
  const FloatingElements = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 ${
            theme === 'light' ? 'bg-blue-200/20' : 'bg-blue-400/10'
          } rounded-full`}
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
          }}
          animate={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
          }}
          transition={{
            duration: Math.random() * 15 + 25,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );

  // Enhanced Gradient Orb with better positioning
  const GradientOrb = ({ delay = 0, scale = 1, color = 'blue', position = 'top-left' }) => {
    const positions = {
      'top-left': '-top-32 -left-32',
      'top-right': '-top-32 -right-32',
      'bottom-left': '-bottom-32 -left-32',
      'bottom-right': '-bottom-32 -right-32',
    };

    return (
      <motion.div
        className={`fixed w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none z-0 ${positions[position]} ${
          color === 'blue' ? 'bg-blue-500' : 
          color === 'purple' ? 'bg-purple-500' : 
          color === 'indigo' ? 'bg-indigo-500' :
          'bg-pink-500'
        }`}
        animate={{
          scale: [scale, scale * 1.1, scale],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          delay,
          ease: 'easeInOut',
        }}
      />
    );
  };

  if (!isAuthInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className={`min-h-screen font-sans relative ${colors.bg} ${colors.text} transition-all duration-500`}>
        {/* Background Elements */}
        <FloatingElements />
        <GradientOrb delay={0} scale={1} color="blue" position="top-left" />
        <GradientOrb delay={3} scale={0.8} color="purple" position="top-right" />
        <GradientOrb delay={6} scale={0.6} color="indigo" position="bottom-left" />

        {/* Enhanced Navigation */}
        <nav className="sticky top-0 z-40 p-4 backdrop-blur-xl">
          <motion.div
            className={`backdrop-blur-xl ${colors.navBg} border rounded-2xl p-4 max-w-7xl mx-auto flex justify-between items-center ${colors.shadow}`}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Enhanced Logo */}
            <motion.div
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                FIN-LYTIC
              </span>
            </motion.div>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden lg:flex space-x-8 items-center">
              {mainNavItems.map((item, i) => (
                <MotionLink
                  key={item.label}
                  to={item.path}
                  className={`${colors.text} ${colors.hover} transition-all duration-300 relative group font-medium`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  whileHover={{ y: -2 }}
                >
                  {item.label}
                  <motion.span 
                    className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </MotionLink>
              ))}

              {/* Enhanced Predictions Dropdown */}
              <div className="relative dropdown-container">
                <motion.button
                  onClick={() => setIsPredictionDropdownOpen(!isPredictionDropdownOpen)}
                  className={`${colors.text} ${colors.hover} transition-all duration-300 relative group flex items-center font-medium`}
                  whileHover={{ y: -2 }}
                >
                  PREDICTIONS
                  <motion.div
                    animate={{ rotate: isPredictionDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="ml-1 w-4 h-4" />
                  </motion.div>
                  <motion.span 
                    className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
                
                <AnimatePresence>
                  {isPredictionDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className={`absolute top-full left-0 mt-3 w-56 ${colors.dropdown} backdrop-blur-xl border rounded-xl ${colors.shadow} z-50 overflow-hidden`}
                    >
                      {predictionNavItems.map((item, index) => (
                        <MotionLink
                          key={item.label}
                          to={item.path}
                          onClick={() => setIsPredictionDropdownOpen(false)}
                          className={`${colors.text} ${colors.hover} block px-4 py-3 text-sm transition-all duration-200 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 first:rounded-t-xl last:rounded-b-xl`}
                          whileHover={{ x: 4 }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          {item.label}
                        </MotionLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Enhanced User Authentication Section */}
              {authgearClient.sessionState === SessionState.Authenticated && userInfo ? (
                <div className="relative dropdown-container">
                  <motion.button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className={`flex items-center space-x-3 p-3 rounded-xl ${colors.card} hover:scale-105 transition-all duration-300 border`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-2">
                      {userInfo.picture ? (
                        <img src={userInfo.picture} alt="User avatar" className="w-8 h-8 rounded-full ring-2 ring-blue-500/20" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className={`hidden md:block text-sm font-medium ${colors.text}`}>
                        {userInfo.name?.split(' ')[0] || 'User'}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isUserDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className={`absolute top-full right-0 mt-3 w-80 ${colors.dropdown} backdrop-blur-xl border rounded-xl ${colors.shadow} z-50 overflow-hidden`}
                      >
                        {/* User Info Section */}
                        <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
                          <div className="flex items-center space-x-3 mb-3">
                            {userInfo.picture ? (
                              <img src={userInfo.picture} alt="User avatar" className="w-12 h-12 rounded-full ring-2 ring-blue-500/20" />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className={`font-semibold ${colors.text} truncate`}>{userInfo.name || 'User'}</p>
                              <p className={`text-sm ${colors.textMuted} truncate`}>{userInfo.email}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="p-2">
                          <motion.button
                            onClick={() => {
                              handleManageAccount();
                              setIsUserDropdownOpen(false);
                            }}
                            className={`flex items-center w-full px-3 py-2 text-sm ${colors.text} hover:bg-slate-100/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors`}
                            whileHover={{ x: 4 }}
                          >
                            <Settings className="w-4 h-4 mr-3" />
                            MANAGE ACCOUNT
                          </motion.button>
                          
                          <motion.button
                            onClick={() => {
                              handleLogout();
                              setIsUserDropdownOpen(false);
                            }}
                            className={`flex items-center w-full px-3 py-2 text-sm ${colors.text} hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors mt-1`}
                            whileHover={{ x: 4 }}
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            SIGN OUT
                          </motion.button>
                        </div>
                        
                        <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-200/50 dark:border-slate-700/50">
                          <p className={`text-xs ${colors.textMuted} text-center`}>Secured by Authgear</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  onClick={handleLogin}
                  className={`bg-gradient-to-r ${colors.accent} hover:${colors.accentHover} text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  GET STARTED
                </motion.button>
              )}

              {/* Enhanced Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className={`p-3 rounded-xl ${colors.card} hover:scale-110 transition-all duration-300 border`}
                whileHover={{ rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle theme"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === 'light' ? 0 : 180 }}
                  transition={{ duration: 0.5 }}
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </motion.div>
              </motion.button>
            </div>

            {/* Enhanced Mobile Menu Button */}
            <motion.button 
              className="lg:hidden z-50 p-2 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Enhanced Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
                  onClick={() => setIsMenuOpen(false)}
                />
                
                {/* Menu Content */}
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className={`lg:hidden ${colors.dropdown} backdrop-blur-xl border rounded-xl ${colors.shadow} m-4 p-6 space-y-4 relative z-40`}
                >
                  {mainNavItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        className={`${colors.text} ${colors.hover} block transition-colors py-3 text-lg font-medium`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}

                  {/* Mobile Predictions */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: mainNavItems.length * 0.1 }}
                  >
                    <button
                      className={`${colors.text} ${colors.hover} transition-colors flex items-center py-3 text-lg font-medium w-full`}
                      onClick={() => setIsPredictionDropdownOpen(!isPredictionDropdownOpen)}
                    >
                      PREDICTIONS
                      <motion.div
                        animate={{ rotate: isPredictionDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="ml-2"
                      >
                        <ChevronDown className="w-5 h-5" />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {isPredictionDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 space-y-2 pl-4 overflow-hidden"
                        >
                          {predictionNavItems.map((item, index) => (
                            <motion.div
                              key={item.label}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link
                                to={item.path}
                                className={`${colors.textSecondary} ${colors.hover} block py-2 text-base`}
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {item.label}
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Mobile User Section */}
                  {authgearClient.sessionState === SessionState.Authenticated && userInfo ? (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (mainNavItems.length + 1) * 0.1 }}
                      className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50"
                    >
                      <div className="flex items-center space-x-3">
                        {userInfo.picture ? (
                          <img src={userInfo.picture} alt="User avatar" className="w-10 h-10 rounded-full ring-2 ring-blue-500/20" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div>
                          <p className={`font-semibold ${colors.text}`}>{userInfo.name || 'User'}</p>
                          <p className={`text-sm ${colors.textMuted}`}>{userInfo.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            handleManageAccount();
                            setIsMenuOpen(false);
                          }}
                          className={`flex items-center w-full py-2 text-base ${colors.text} ${colors.hover} transition-colors`}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          MANAGE ACCOUNT
                        </button>
                        
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                          }}
                          className={`flex items-center w-full py-2 text-base ${colors.text} hover:text-red-500 transition-colors`}
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          SIGN OUT
                        </button>
                      </div>
                      
                      <p className={`text-xs ${colors.textMuted} text-center pt-2 border-t border-slate-200/50 dark:border-slate-700/50`}>
                        Secured by Authgear
                      </p>
                    </motion.div>
                  ) : (
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (mainNavItems.length + 1) * 0.1 }}
                      onClick={() => {
                        handleLogin();
                        setIsMenuOpen(false);
                      }}
                      className={`w-full bg-gradient-to-r ${colors.accent} hover:${colors.accentHover} text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 mt-4`}
                    >
                      GET STARTED
                    </motion.button>
                  )}

                  {/* Mobile Theme Toggle */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (mainNavItems.length + 2) * 0.1 }}
                    className="flex justify-center pt-4 border-t border-slate-200/50 dark:border-slate-700/50"
                  >
                    <button
                      onClick={toggleTheme}
                      className={`p-3 rounded-xl ${colors.card} hover:scale-110 transition-all duration-300 border`}
                      aria-label="Toggle theme"
                    >
                      {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </nav>

        {/* Main Content with proper spacing */}
        <main className="relative z-10">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/loan" element={<ProtectedRoute><PredictionForm /></ProtectedRoute>} />
              <Route path="/credit-risk" element={<ProtectedRoute><PredictionFormCreditRisk /></ProtectedRoute>} />
              <Route path="/fraud-detection" element={<ProtectedRoute><FraudPredictionForm /></ProtectedRoute>} />
              <Route path="/info" element={<ProtectedRoute><Info /></ProtectedRoute>} />
              <Route path="/chatbot" element={<ProtectedRoute><Chatbot isFullPage={true} /></ProtectedRoute>} />
              <Route
                path="/login"
                element={
                  authgearClient.sessionState !== SessionState.Authenticated ? (
                    <div className="min-h-screen flex items-center justify-center p-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`${colors.card} backdrop-blur-xl border rounded-2xl p-8 max-w-md w-full text-center ${colors.shadow}`}
                      >
                        <div className="mb-6">
                          <Sparkles className={`w-16 h-16 mx-auto ${
                            theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                          } mb-4`} />
                          <h1 className={`text-2xl font-bold ${colors.text} mb-2`}>Welcome to FIN-LYTIC</h1>
                          <p className={`${colors.textMuted}`}>Sign in to access your financial insights dashboard</p>
                        </div>
                        
                        <motion.button
                          onClick={handleLogin}
                          className={`w-full bg-gradient-to-r ${colors.accent} hover:${colors.accentHover} text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          LOGIN WITH AUTHGEAR
                        </motion.button>
                        
                        <p className={`text-xs ${colors.textMuted} mt-6`}>
                          Secure authentication powered by Authgear
                        </p>
                      </motion.div>
                    </div>
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route path="/callback" element={<Callback />} />
            </Routes>
          </Suspense>
        </main>

        {/* Enhanced Footer */}
        <footer className={`relative mt-0 ${
          theme === 'light' 
            ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' 
            : 'bg-gradient-to-br from-black via-slate-900 to-blue-900'
        } text-white overflow-hidden`}>
          {/* ...existing footer code with enhanced styling... */}
          <div className="relative z-10 px-8 pt-20 pb-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1 md:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Sparkles className="w-8 h-8 text-blue-400" />
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        FIN-LYTIC
                      </h3>
                    </div>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-lg">
                      Revolutionizing financial intelligence with AI-powered predictions, analytics, and insights for the modern financial landscape.
                    </p>
                    <div className="flex space-x-4">
                      {[
                        { icon: Github, href: 'https://github.com/Bharath1n/Finlytic', label: 'GitHub' },
                        { icon: Twitter, href: 'https://x.com', label: 'Twitter' },
                        { icon: Linkedin, href: 'https://www.linkedin.com/in/bharath-n-780002250', label: 'LinkedIn' },
                        { icon: Mail, href: 'mailto:bharthn2508@gmail.com', label: 'Email' },
                      ].map((social, i) => (
                        <motion.a
                          key={i}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.label}
                          whileHover={{ scale: 1.1, y: -3 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-12 h-12 bg-white/10 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 rounded-xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-transparent"
                        >
                          <social.icon className="w-5 h-5" />
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                </div>
                
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <h4 className="text-xl font-semibold mb-6 text-blue-300">Quick Links</h4>
                    <ul className="space-y-4">
                      {[...mainNavItems, { label: 'PREDICTIONS', path: '#' }].map((item, i) => (
                        <li key={i}>
                          <motion.div
                            className="text-slate-400 hover:text-white transition-all duration-300 flex items-center group cursor-pointer"
                            whileHover={{ x: 8 }}
                          >
                            <ArrowRight className="w-4 h-4 mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0" />
                            <span className="group-hover:font-medium transition-all duration-300">
                              {item.label}
                            </span>
                          </motion.div>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <h4 className="text-xl font-semibold mb-6 text-blue-300">Contact Info</h4>
                    <div className="space-y-4 text-slate-400">
                      <p className="flex items-center">
                        <Mail className="w-4 h-4 mr-3 text-blue-400" />
                        bharthn2508@gmail.com
                      </p>
                      <p className="flex items-center">
                        <Github className="w-4 h-4 mr-3 text-blue-400" />
                        github.com/Bharath1n
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Newsletter Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-12"
              >
                <div className="text-center max-w-2xl mx-auto">
                  <h4 className="text-2xl font-bold mb-4">Stay Updated with FIN-LYTIC</h4>
                  <p className="text-slate-300 mb-8">Get the latest insights and updates on financial AI technology.</p>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Subscribe
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Copyright */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
                className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center"
              >
                <div className="text-slate-400 text-center md:text-left mb-4 md:mb-0">
                  <p>&copy; 2025 FIN-LYTIC. All rights reserved. Built with ❤️ for financial innovation.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-6 text-sm">
                  {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Support'].map((item, i) => (
                    <motion.a
                      key={i}
                      href="#"
                      className="text-slate-400 hover:text-white transition-colors duration-300 hover:underline"
                      whileHover={{ y: -1 }}
                    >
                      {item}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Enhanced Footer Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.3, 1], 
                opacity: [0.1, 0.3, 0.1],
                x: [0, 50, 0],
                y: [0, -30, 0]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
              animate={{ 
                scale: [1.2, 1, 1.2], 
                opacity: [0.1, 0.25, 0.1],
                x: [0, -40, 0],
                y: [0, 20, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
            />
          </div>
        </footer>
      </div>
      
      <FloatingChatbot />
    </Router>
  );
};

// Main App Component
const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
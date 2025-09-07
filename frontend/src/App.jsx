// App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import { motion } from 'framer-motion';
import { Menu, X, ArrowRight, Github, Twitter, Linkedin, Mail, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { authgearClient } from './authgear';
import { SessionState } from '@authgear/web';
import Callback from './components/Callback';

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

const MotionLink = motion(Link);

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(authgearClient.sessionState === SessionState.Authenticated);

  useEffect(() => {
    const onSessionStateChange = (container) => {
      setIsAuthenticated(container.sessionState === SessionState.Authenticated);
    };

    authgearClient.delegate = { onSessionStateChange };

    return () => {
      authgearClient.delegate = undefined;
    };
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppContent = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isPredictionDropdownOpen, setIsPredictionDropdownOpen] = React.useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = React.useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const config = {
      clientID: 'ca6581552d3e3e3a',
      endpoint: 'https://finylytic.authgear.cloud',
    };
    authgearClient.configure(config).catch((error) => {
      console.error('Failed to configure Authgear client:', error);
    });
  }, []);

  useEffect(() => {
    if (authgearClient.sessionState === SessionState.Authenticated) {
      authgearClient.fetchUserInfo()
        .then((info) => {
          setUserInfo(info);
        })
        .catch((error) => {
          console.error('Failed to fetch user info:', error);
        });
    } else {
      setUserInfo(null);
    }
  }, [authgearClient.sessionState]);

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

  const handleLogin = () => {
    const redirectURI = window.location.hostname === 'localhost'
      ? 'http://localhost:5173/callback'
      : 'https://finlytic.vercel.app/callback';
    authgearClient.startAuthentication({
      redirectURI,
      prompt: 'login',
    }).catch((error) => {
      console.error('Login failed:', error);
    });
  };

  const handleLogout = () => {
    authgearClient.logout({
      force: true,
      redirectURI: window.location.origin,
    }).catch((error) => {
      console.error('Logout failed:', error);
    });
  };

  const handleManageAccount = () => {
  authgearClient.open("/settings");
  };

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
            repeatType: 'reverse',
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );

  const GradientOrb = ({ delay = 0, scale = 1, color = 'blue' }) => (
    <motion.div
      className={`absolute w-96 h-96 rounded-full opacity-20 blur-3xl ${
        color === 'blue' ? 'bg-blue-500' : color === 'purple' ? 'bg-purple-500' : 'bg-pink-500'
      }`}
      animate={{
        scale: [scale, scale * 1.2, scale],
        opacity: [0.1, 0.3, 0.1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  );

  return (
    <Router>
      <div className={`min-h-screen font-serif relative overflow-hidden ${theme === 'light' ? 'bg-gradient-to-br from-gray-50 via-white to-blue-50 text-black' : 'bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white'}`}>
        <FloatingElements />
        <GradientOrb delay={0} scale={1} color="blue" />
        <GradientOrb delay={2} scale={0.8} color="purple" />
        <GradientOrb delay={4} scale={0.6} color="pink" />

        <nav className="relative z-50 p-0">
          <motion.div
            className={`backdrop-blur-lg ${theme === 'light' ? 'bg-white/20 border-white/20' : 'bg-black/20 border-white/10'} border rounded-2xl p-4 max-w-7xl mx-auto flex justify-between items-center`}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              FIN-LYTIC
            </motion.div>
            <div className="hidden md:flex space-x-8 items-center">
              {mainNavItems.map((item, i) => (
                <MotionLink
                  key={item.label}
                  to={item.path}
                  className={`${theme === 'light' ? 'text-gray-700 hover:text-blue-600' : 'text-gray-300 hover:text-blue-400'} transition-colors relative group`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.5 }}
                  whileHover={{ y: -2 }}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </MotionLink>
              ))}
              <motion.div
                className="relative"
                onClick={() => setIsPredictionDropdownOpen(!isPredictionDropdownOpen)}
                onClickStart={() => setIsPredictionDropdownOpen(true)}
                onClickEnd={() => setIsPredictionDropdownOpen(false)}
              >
                <MotionLink
                  className={`${theme === 'light' ? 'text-gray-700 hover:text-blue-600' : 'text-gray-300 hover:text-blue-400'} transition-colors relative group flex items-center`}
                  whileHover={{ y: -2 }}
                >
                  PREDICTIONS
                  <ChevronDown className="ml-1 w-4 h-4" />
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </MotionLink>
                {isPredictionDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute top-full left-0 mt-2 w-48 ${theme === 'light' ? 'bg-white/90' : 'bg-black/90'} backdrop-blur-xl border ${theme === 'light' ? 'border-white/20' : 'border-white/10'} rounded-xl shadow-lg z-50`}
                  >
                    {predictionNavItems.map((item) => (
                      <MotionLink
                        key={item.label}
                        to={item.path}
                        className={`${theme === 'light' ? 'text-gray-700 hover:text-blue-600' : 'text-gray-300 hover:text-blue-400'} block px-4 py-2 text-sm transition-colors`}
                        whileHover={{ backgroundColor: theme === 'light' ? '#f3f4f6' : '#2d3748' }}
                      >
                        {item.label}
                      </MotionLink>
                    ))}
                  </motion.div>
                )}
              </motion.div>
              {authgearClient.sessionState === SessionState.Authenticated && userInfo ? (
                <motion.div
                  className="relative"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  onClickStart={() => setIsUserDropdownOpen(true)}
                  onClickEnd={() => setIsUserDropdownOpen(false)}
                >
                  <motion.button
                    className={`flex items-center space-x-2 p-2 rounded-full ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-800 text-gray-200'} hover:scale-105 transition-all`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {userInfo.picture ? (
                      <img src={userInfo.picture} alt="User avatar" className="w-6 h-6 rounded-full" />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                    <ChevronDown className="w-4 h-4" />
                  </motion.button>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute top-full right-0 mt-2 w-80 ${theme === 'light' ? 'bg-white/90' : 'bg-black/90'} backdrop-blur-xl border ${theme === 'light' ? 'border-white/20' : 'border-white/10'} rounded-xl shadow-lg z-50 p-4`}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        {userInfo.picture ? (
                          <img src={userInfo.picture} alt="User avatar" className="w-10 h-10 rounded-full" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">{userInfo.name || 'User'}</p>
                          <p className="text-sm text-gray-500">{userInfo.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleManageAccount}
                        className="flex items-center w-full px-2 py-2 text-sm hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-md transition-colors"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        MANAGE ACCOUNT
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-2 py-2 text-sm hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-md transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        SIGN OUT
                      </button>
                      <p className="text-xs text-gray-500 mt-4 text-center">Secured by Authgear</p>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.button
                onClick={handleLogin}
                className={`${theme === 'light' ? 'text-gray-700 hover:text-blue-600' : 'text-gray-300 hover:text-blue-400'} transition-colors relative group font-semibold`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ y: -2 }}
              >
              GET STARTED
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </motion.button>

              )}
              <motion.button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-800 text-gray-200'} hover:scale-110 transition-all`}
                whileHover={{ rotate: 180 }}
                whileTap={{ scale: 0.9 }}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </motion.button>
            </div>
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </motion.div>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`md:hidden ${theme === 'light' ? 'bg-white/90' : 'bg-black/90'} backdrop-blur-xl border ${theme === 'light' ? 'border-white/20' : 'border-white/10'} rounded-xl shadow-lg m-4 p-4 space-y-4`}
            >
              {mainNavItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`${theme === 'light' ? 'text-gray-700 hover:text-blue-600' : 'text-gray-300 hover:text-blue-400'} block transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <motion.div
                className="relative"
              >
                <button
                  className={`${theme === 'light' ? 'text-gray-700 hover:text-blue-600' : 'text-gray-300 hover:text-blue-400'} transition-colors flex items-center`}
                  onClick={() => setIsPredictionDropdownOpen(!isPredictionDropdownOpen)}
                >
                  PREDICTIONS
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                {isPredictionDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 space-y-2"
                  >
                    {predictionNavItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.path}
                        className={`${theme === 'light' ? 'text-gray-700 hover:text-blue-600' : 'text-gray-300 hover:text-blue-400'} block px-4 py-2 text-sm`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </motion.div>
              {authgearClient.sessionState === SessionState.Authenticated && userInfo ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-6">
                    {userInfo.picture ? (
                      <img src={userInfo.picture} alt="User avatar" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{userInfo.name || 'User'}</p>
                      <p className="text-sm text-gray-500">{userInfo.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleManageAccount}
                    className="block w-full text-left py-2 text-sm hover:text-blue-600 transition-colors"
                  >
                    MANAGE ACCOUNT
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 text-sm hover:text-blue-600 transition-colors"
                  >
                    SIGN OUT
                  </button>
                  <p className="text-xs text-gray-500 text-center">Secured by Authgear</p>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className={`block py-2 ${theme === 'light' ? 'text-gray-700 hover:text-blue-600' : 'text-gray-300 hover:text-blue-400'} transition-colors`}
                >
                  GET STARTED
                </button>
              )}
            </motion.div>
          )}
        </nav>

        <Suspense fallback={<div className="text-center text-xl">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/loan"
              element={<ProtectedRoute><PredictionForm /></ProtectedRoute>}
            />
            <Route
              path="/credit-risk"
              element={<ProtectedRoute><PredictionFormCreditRisk /></ProtectedRoute>}
            />
            <Route
              path="/fraud-detection"
              element={<ProtectedRoute><FraudPredictionForm /></ProtectedRoute>}
            />
            <Route
              path="/info"
              element={<ProtectedRoute><Info /></ProtectedRoute>}
            />
            <Route
              path="/chatbot"
              element={<ProtectedRoute><Chatbot isFullPage={true} /></ProtectedRoute>}
            />
            <Route
              path="/login"
              element={
                authgearClient.sessionState !== SessionState.Authenticated ? (
                  <button onClick={handleLogin} className="text-blue-500">LOGIN WITH AUTHGEAR</button>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route path="/callback" element={<Callback />} />
          </Routes>
        </Suspense>

        <footer className={`${theme === 'light' ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' : 'bg-gradient-to-br from-black via-gray-900 to-blue-900'} text-white relative overflow-hidden`}>
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
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                      FIN-LYTIC
                    </h3>
                    <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
                      Revolutionizing financial intelligence with AI-powered predictions, analytics, and insights.
                    </p>
                    <div className="flex space-x-4">
                      {[
                        { icon: Github, href: 'https://github.com/Bharath1n/Finlytic' },
                        { icon: Twitter, href: 'https://x.com' },
                        { icon: Linkedin, href: 'https://www.linkedin.com/in/bharath-n-780002250' },
                        { icon: Mail, href: 'mailto:bharthn2508@gmail.com' },
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
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <h4 className="text-xl font-semibold mb-6 text-blue-300">Quick Links</h4>
                    <ul className="space-y-3">
                      {mainNavItems.map((item, i) => (
                        <li key={i}>
                          <motion.div
                            className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                            whileHover={{ x: 5 }}
                          >
                            <Link to={item.path} className="flex items-center">
                              <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                              {item.label}
                            </Link>
                          </motion.div>
                        </li>
                      ))}
                      <li>
                        <motion.div
                          className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                          whileHover={{ x: 5 }}
                        >
                          <span className="flex items-center">
                            <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                            PREDICTIONS
                          </span>
                          <ChevronDown className="w-4 h-4 ml-1" />
                        </motion.div>
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-12"
              >
                <div className="text-center max-w-2xl mx-auto">
                  <h4 className="text-2xl font-bold mb-4">Stay Updated</h4>
                  <p className="text-gray-300 mb-6">Get the latest insights and updates from FIN-LYTIC.</p>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600"
                    >
                      Subscribe
                    </motion.button>
                  </div>
                </div>
              </motion.div>
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
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            />
          </div>
        </footer>
      </div>
      <FloatingChatbot />
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
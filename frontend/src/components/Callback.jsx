// components/Callback.jsx - Enhanced Authentication Callback Component
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { authgearClient } from "../authgear";
import { useTheme } from "./ThemeContext";

const Callback = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      authgearClient.finishAuthentication()
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          console.error("Authentication callback error:", error);
          navigate("/login");
        });
    }, 1500); // Add a small delay for better UX

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'light' ? 'bg-gradient-to-br from-gray-50 via-white to-blue-50' : 'bg-gradient-to-br from-gray-900 via-black to-blue-900'}`}>
      <motion.div
        className="text-center p-12 glass border rounded-3xl max-w-md mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <TrendingUp className="w-10 h-10 text-white" />
        </motion.div>
        
        <motion.h1
          className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Completing Authentication
        </motion.h1>
        
        <motion.p
          className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-6`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Please wait while we securely sign you in...
        </motion.p>
        
        <motion.div
          className="flex justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Callback;
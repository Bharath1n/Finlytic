// UI Components Library for consistent styling across the application
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../ThemeContext';
import { Loader2 } from 'lucide-react';

// Button Components
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const { theme } = useTheme();
  
  const baseClasses = 'font-semibold rounded-xl transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 inline-flex items-center justify-center gap-2';
  
  const variants = {
    primary: `bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus:ring-blue-500/20`,
    secondary: theme === 'light' 
      ? 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 focus:ring-gray-500/20'
      : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-gray-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 focus:ring-gray-500/20',
    outline: theme === 'light'
      ? 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500/20'
      : 'border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900 focus:ring-blue-400/20',
    ghost: theme === 'light'
      ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 focus:ring-blue-500/20'
      : 'text-gray-300 hover:text-blue-400 hover:bg-blue-900/20 focus:ring-blue-400/20',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus:ring-red-500/20'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };
  
  const isDisabled = disabled || loading;
  
  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </motion.button>
  );
};

// Input Components
export const Input = ({ 
  label, 
  error, 
  hint,
  className = '',
  containerClassName = '',
  ...props 
}) => {
  const { theme } = useTheme();
  
  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          {label}
        </label>
      )}
      <input
        className={`form-input ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
      {hint && !error && (
        <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
          {hint}
        </p>
      )}
    </div>
  );
};

// Select Component
export const Select = ({ 
  label, 
  error, 
  hint,
  children,
  className = '',
  containerClassName = '',
  ...props 
}) => {
  const { theme } = useTheme();
  
  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          {label}
        </label>
      )}
      <select
        className={`form-select ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
      {hint && !error && (
        <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
          {hint}
        </p>
      )}
    </div>
  );
};

// Card Component
export const Card = ({ 
  children, 
  className = '',
  hover = true,
  ...props 
}) => {
  return (
    <motion.div
      className={`card ${hover ? 'hover:scale-[1.02]' : ''} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Modal/Dialog Component
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md',
  className = '' 
}) => {
  const { theme } = useTheme();
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`
            relative w-full ${sizes[size]} p-6 mx-auto
            ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}
            rounded-2xl shadow-2xl border
            ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}
            ${className}
          `}
        >
          {title && (
            <div className="mb-4">
              <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>
                {title}
              </h3>
            </div>
          )}
          {children}
        </motion.div>
      </div>
    </div>
  );
};

// Alert Component
export const Alert = ({ 
  type = 'info', 
  title, 
  children,
  onClose,
  className = '' 
}) => {
  const { theme } = useTheme();
  
  const types = {
    success: {
      bg: theme === 'light' ? 'bg-green-50' : 'bg-green-900/20',
      border: theme === 'light' ? 'border-green-200' : 'border-green-800',
      text: theme === 'light' ? 'text-green-800' : 'text-green-400',
      icon: '✅'
    },
    warning: {
      bg: theme === 'light' ? 'bg-yellow-50' : 'bg-yellow-900/20',
      border: theme === 'light' ? 'border-yellow-200' : 'border-yellow-800',
      text: theme === 'light' ? 'text-yellow-800' : 'text-yellow-400',
      icon: '⚠️'
    },
    error: {
      bg: theme === 'light' ? 'bg-red-50' : 'bg-red-900/20',
      border: theme === 'light' ? 'border-red-200' : 'border-red-800',
      text: theme === 'light' ? 'text-red-800' : 'text-red-400',
      icon: '❌'
    },
    info: {
      bg: theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20',
      border: theme === 'light' ? 'border-blue-200' : 'border-blue-800',
      text: theme === 'light' ? 'text-blue-800' : 'text-blue-400',
      icon: 'ℹ️'
    }
  };
  
  const config = types[type];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        ${config.bg} ${config.border} ${config.text}
        border rounded-xl p-4 relative
        ${className}
      `}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{config.icon}</span>
        <div className="flex-1">
          {title && <div className="font-semibold mb-1">{title}</div>}
          <div>{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-current opacity-50 hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Loading Spinner Component
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };
  
  return (
    <div className={`loading-spinner ${sizes[size]} ${className}`} />
  );
};

// Badge Component
export const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '' 
}) => {
  const { theme } = useTheme();
  
  const variants = {
    default: theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-800 text-gray-200',
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  return (
    <span className={`
      inline-flex items-center font-medium rounded-full
      ${variants[variant]} ${sizes[size]} ${className}
    `}>
      {children}
    </span>
  );
};

// Tooltip Component
export const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  
  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`
            absolute z-50 px-3 py-2 text-sm font-medium text-white
            bg-gray-900 rounded-lg shadow-lg pointer-events-none
            ${positions[position]}
          `}
        >
          {content}
        </motion.div>
      )}
    </div>
  );
};

// Progress Bar Component
export const ProgressBar = ({ 
  value, 
  max = 100, 
  color = 'blue',
  size = 'md',
  showLabel = false,
  className = '' 
}) => {
  const percentage = Math.round((value / max) * 100);
  
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600'
  };
  
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };
  
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-2">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          className={`${colors[color]} ${sizes[size]} rounded-full transition-all duration-500`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
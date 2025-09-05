import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';
import { Shield, RotateCcw } from 'lucide-react';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
function PredictionFormCreditRisk() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    person_age: '',
    person_income: '',
    person_home_ownership: 'rent',
    person_emp_length: '',
    loan_intent: 'personal',
    loan_grade: 'a',
    loan_amnt: '',
    loan_int_rate: '',
    loan_percent_income: '',
    cb_person_default_on_file: 'n',
    cb_person_cred_hist_length: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

    const validateField = (name, value) => {
    switch (name) {
      case 'person_age':
        return value < 18 || value > 100 ? 'Age must be between 18 and 100' : '';
      case 'person_income':
      case 'loan_amnt':
      case 'loan_int_rate':
      case 'person_emp_length':
      case 'cb_person_cred_hist_length':
        return value < 0 ? `${name.replace('_', ' ')} must be non-negative` : '';
      case 'loan_percent_income':
        return value < 0 || value > 1 ? 'Loan percent income must be between 0 and 1' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationErrors({ ...validationErrors, [name]: validateField(name, value) });
  };

  const handleReset = () => {
    setFormData({
      person_age: '',
      person_income: '',
      person_home_ownership: 'rent',
      person_emp_length: '',
      loan_intent: 'personal',
      loan_grade: 'a',
      loan_amnt: '',
      loan_int_rate: '',
      loan_percent_income: '',
      cb_person_default_on_file: 'n',
      cb_person_cred_hist_length: '',
    });
    setPrediction(null);
    setError('');
    setValidationErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setError('');
    setPrediction(null);
    setIsLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/credit_risk/`, formData,{timeout: 10000});
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred. Please check your inputs or ensure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`font-serif ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`rounded-2xl shadow-lg p-8 max-w-4xl mx-auto mt-12 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-shadow`}
        role="form"
        aria-label="Credit Risk Prediction Form"
      >
        <h2 className="text-3xl font-bold text-center mb-6 flex">
          <Shield className="mr-2 w-8 h-8 text-blue-500" /> CREDIT RISK
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-500">PERSONAL INFORMATION</h3>
            {[
              { name: 'person_age', label: 'Age', type: 'number', min: 18, max: 100 },
              { name: 'person_income', label: 'Income (Rs)', type: 'number', min: 0 },
              {
                name: 'person_home_ownership',
                label: 'Home Ownership',
                type: 'select',
                options: ['rent', 'own', 'mortgage', 'other'],
              },
              { name: 'person_emp_length', label: 'Employment Length (years)', type: 'number', min: 0 },
            ].map(({ name, label, type, min, max, options }) => (
              <div key={name}>
                <label className="block text-sm font-medium" htmlFor={name}>{label}</label>
                {type === 'select' ? (
                  <select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    className={`mt-1 w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-500' : 'bg-gray-700 border-gray-600 text-gray-300'} ${validationErrors[name] ? 'border-red-500' : ''}`}
                    aria-invalid={validationErrors[name] ? 'true' : 'false'}
                    aria-describedby={`${name}-error`}
                  >
                    {options.map((option) => (
                      <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    min={min}
                    max={max}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className={`mt-1 w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-500' : 'bg-gray-700 border-gray-600 text-gray-300'} ${validationErrors[name] ? 'border-red-500' : ''}`}
                    aria-invalid={validationErrors[name] ? 'true' : 'false'}
                    aria-describedby={`${name}-error`}
                  />
                )}
                {validationErrors[name] && (
                  <p id={`${name}-error`} className="text-red-500 text-xs mt-1">{validationErrors[name]}</p>
                )}
              </div>
            ))}
          </div>
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-500">LOAN DETAILS</h3>
            {[
              {
                name: 'loan_intent',
                label: 'Loan Intent',
                type: 'select',
                options: ['personal', 'education', 'medical', 'venture', 'homeimprovement', 'debtconsolidation'],
              },
              { name: 'loan_grade', label: 'Loan Grade', type: 'select', options: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] },
              { name: 'loan_amnt', label: 'Loan Amount (Rs)', type: 'number', min: 0 },
              { name: 'loan_int_rate', label: 'Loan Interest Rate (%)', type: 'number', min: 0, step: '0.01' },
              { name: 'loan_percent_income', label: 'Loan Percent of Income', type: 'number', min: 0, max: 1, step: '0.01' },
              { name: 'cb_person_default_on_file', label: 'Default on File', type: 'select', options: ['n', 'y'] },
              { name: 'cb_person_cred_hist_length', label: 'Credit History Length (years)', type: 'number', min: 0 },
            ].map(({ name, label, type, min, max, step, options }) => (
              <div key={name}>
                <label className="block text-sm font-medium" htmlFor={name}>{label}</label>
                {type === 'select' ? (
                  <select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    className={`mt-1 w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-500' : 'bg-gray-700 border-gray-600 text-gray-300'} ${validationErrors[name] ? 'border-red-500' : ''}`}
                    aria-invalid={validationErrors[name] ? 'true' : 'false'}
                    aria-describedby={`${name}-error`}
                  >
                    {options.map((option) => (
                      <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    min={min}
                    max={max}
                    step={step}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className={`mt-1 w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-500' : 'bg-gray-700 border-gray-600 text-gray-300'} ${validationErrors[name] ? 'border-red-500' : ''}`}
                    aria-invalid={validationErrors[name] ? 'true' : 'false'}
                    aria-describedby={`${name}-error`}
                  />
                )}
                {validationErrors[name] && (
                  <p id={`${name}-error`} className="text-red-500 text-xs mt-1">{validationErrors[name]}</p>
                )}
              </div>
            ))}
          </div>
          <div className="md:col-span-2 mt-6 flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className={`flex-1 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed ${theme === 'light' ? '' : 'hover:from-blue-700 hover:to-blue-800'}`}
              aria-label="Predict credit risk"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Predicting...
                </span>
              ) : (
                'Predict'
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleReset}
              className={`flex-1 p-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full font-semibold hover:from-gray-600 hover:to-gray-700 transition ${theme === 'light' ? '' : 'hover:from-gray-700 hover:to-gray-800'}`}
              aria-label="Reset form"
            >
              <RotateCcw className="inline w-5 h-5 mr-2" /> Reset
            </motion.button>
          </div>
        </form>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-red-100 text-red-700 text-center rounded-full animate-pulse"
            role="alert"
          >
            {error}
          </motion.div>
        )}
        {prediction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-4 p-6 rounded-2xl text-center ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}
            role="region"
            aria-label="Prediction Result"
          >
            <h3 className="text-lg font-semibold">Prediction Result</h3>
            <p className={`mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
              Credit Risk: {prediction.credit_risk_prediction}
            </p>
            <p className={`mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
              Risk Probability: {(prediction.credit_risk_probability * 100).toFixed(2)}%
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default PredictionFormCreditRisk;
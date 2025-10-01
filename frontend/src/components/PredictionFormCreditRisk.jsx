import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';
import { Shield, RotateCcw, Loader2, CheckCircle, XCircle, User, FileText, TrendingUp } from 'lucide-react';

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

    // Convert numeric fields to numbers before sending
    const payload = {
      ...formData,
      person_age: Number(formData.person_age),
      person_income: Number(formData.person_income),
      person_emp_length: Number(formData.person_emp_length),
      loan_amnt: Number(formData.loan_amnt),
      loan_int_rate: Number(formData.loan_int_rate),
      loan_percent_income: Number(formData.loan_percent_income),
      cb_person_cred_hist_length: Number(formData.cb_person_cred_hist_length),
    };

    try {
      console.log('Sending request to:', `${backendUrl}/credit_risk/`);
      console.log('Payload:', payload);
      
      const response = await axios.post(`${backendUrl}/credit_risk/`, payload, { 
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response:', response.data);
      setPrediction(response.data);
    } catch (err) {
      console.error('Request failed:', err);
      
      if (err.response) {
        // Server responded with error status
        setError(err.response.data?.detail || `Server error: ${err.response.status}`);
      } else if (err.request) {
        // Request was made but no response received
        setError('No response from server. Please ensure the backend is running.');
      } else {
        // Something else happened
        setError('Request failed: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen py-8 px-4 ${theme === 'light' ? 'bg-gradient-to-br from-gray-50 via-white to-blue-50' : 'bg-gradient-to-br from-gray-900 via-black to-blue-900'}`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Shield className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold gradient-text">Credit Risk Assessment</h1>
            </div>
            <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Advanced AI-powered credit risk evaluation with comprehensive analysis
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold gradient-text flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Age
                    </label>
                    <input
                      type="number"
                      name="person_age"
                      value={formData.person_age}
                      onChange={handleChange}
                      required
                      min="18"
                      max="100"
                      placeholder="Enter your age"
                      className="form-input"
                    />
                    {validationErrors.person_age && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.person_age}</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Annual Income (Rs)
                    </label>
                    <input
                      type="number"
                      name="person_income"
                      value={formData.person_income}
                      onChange={handleChange}
                      required
                      min="0"
                      placeholder="Enter your annual income"
                      className="form-input"
                    />
                    {validationErrors.person_income && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.person_income}</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Home Ownership
                    </label>
                    <select
                      name="person_home_ownership"
                      value={formData.person_home_ownership}
                      onChange={handleChange}
                      required
                      className="form-select"
                    >
                      <option value="rent">Rent</option>
                      <option value="own">Own</option>
                      <option value="mortgage">Mortgage</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Employment Length (years)
                    </label>
                    <input
                      type="number"
                      name="person_emp_length"
                      value={formData.person_emp_length}
                      onChange={handleChange}
                      required
                      min="0"
                      placeholder="Years of employment"
                      className="form-input"
                    />
                    {validationErrors.person_emp_length && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.person_emp_length}</p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Loan & Financial Details */}
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-semibold gradient-text flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Loan & Financial Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Loan Intent
                    </label>
                    <select
                      name="loan_intent"
                      value={formData.loan_intent}
                      onChange={handleChange}
                      required
                      className="form-select"
                    >
                      <option value="personal">Personal</option>
                      <option value="education">Education</option>
                      <option value="medical">Medical</option>
                      <option value="venture">Venture</option>
                      <option value="homeimprovement">Home Improvement</option>
                      <option value="debtconsolidation">Debt Consolidation</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Loan Grade
                    </label>
                    <select
                      name="loan_grade"
                      value={formData.loan_grade}
                      onChange={handleChange}
                      required
                      className="form-select"
                    >
                      <option value="a">Grade A</option>
                      <option value="b">Grade B</option>
                      <option value="c">Grade C</option>
                      <option value="d">Grade D</option>
                      <option value="e">Grade E</option>
                      <option value="f">Grade F</option>
                      <option value="g">Grade G</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Loan Amount (Rs)
                    </label>
                    <input
                      type="number"
                      name="loan_amnt"
                      value={formData.loan_amnt}
                      onChange={handleChange}
                      required
                      min="0"
                      placeholder="Enter loan amount"
                      className="form-input"
                    />
                    {validationErrors.loan_amnt && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.loan_amnt}</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      name="loan_int_rate"
                      value={formData.loan_int_rate}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="Enter interest rate"
                      className="form-input"
                    />
                    {validationErrors.loan_int_rate && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.loan_int_rate}</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Loan Percent of Income
                    </label>
                    <input
                      type="number"
                      name="loan_percent_income"
                      value={formData.loan_percent_income}
                      onChange={handleChange}
                      required
                      min="0"
                      max="1"
                      step="0.01"
                      placeholder="Ratio (0-1)"
                      className="form-input"
                    />
                    {validationErrors.loan_percent_income && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.loan_percent_income}</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Default on File
                    </label>
                    <select
                      name="cb_person_default_on_file"
                      value={formData.cb_person_default_on_file}
                      onChange={handleChange}
                      required
                      className="form-select"
                    >
                      <option value="n">No</option>
                      <option value="y">Yes</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Credit History Length (years)
                    </label>
                    <input
                      type="number"
                      name="cb_person_cred_hist_length"
                      value={formData.cb_person_cred_hist_length}
                      onChange={handleChange}
                      required
                      min="0"
                      placeholder="Years of credit history"
                      className="form-input"
                    />
                    {validationErrors.cb_person_cred_hist_length && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.cb_person_cred_hist_length}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center gap-4 pt-6">
              <motion.button
                type="submit"
                disabled={isLoading}
                className="btn-primary px-8 py-4 text-lg font-semibold min-w-[200px]"
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Assess Credit Risk
                  </div>
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={handleReset}
                className="btn-secondary px-6 py-4 text-lg font-semibold"
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </div>
              </motion.button>
            </div>
          </form>

          {/* Results */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            >
              <div className="flex items-center gap-2 text-red-800 dark:text-red-400">
                <XCircle className="w-5 h-5" />
                <h3 className="font-semibold">Error</h3>
              </div>
              <p className="mt-2 text-red-700 dark:text-red-300">{error}</p>
            </motion.div>
          )}

          {prediction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mt-8 p-6 rounded-xl border ${
                prediction.credit_risk_prediction === 'Low' 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : prediction.credit_risk_prediction === 'Medium'
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}
            >
              <div className={`flex items-center gap-2 ${
                prediction.credit_risk_prediction === 'Low' 
                  ? 'text-green-800 dark:text-green-400'
                  : prediction.credit_risk_prediction === 'Medium'
                  ? 'text-yellow-800 dark:text-yellow-400'
                  : 'text-red-800 dark:text-red-400'
              }`}>
                {prediction.credit_risk_prediction === 'Low' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : prediction.credit_risk_prediction === 'Medium' ? (
                  <Shield className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                <h3 className="font-semibold text-lg">Credit Risk Assessment</h3>
              </div>
              <div className="mt-4 space-y-2">
                <p className={`text-lg font-medium ${
                  prediction.credit_risk_prediction === 'Low' 
                    ? 'text-green-800 dark:text-green-300'
                    : prediction.credit_risk_prediction === 'Medium'
                    ? 'text-yellow-800 dark:text-yellow-300'
                    : 'text-red-800 dark:text-red-300'
                }`}>
                  Risk Level: {prediction.credit_risk_prediction} Risk
                </p>
                <p className={`${
                  prediction.credit_risk_prediction === 'Low' 
                    ? 'text-green-700 dark:text-green-400'
                    : prediction.credit_risk_prediction === 'Medium'
                    ? 'text-yellow-700 dark:text-yellow-400'
                    : 'text-red-700 dark:text-red-400'
                }`}>
                  Risk Probability: {(prediction.credit_risk_probability * 100).toFixed(2)}%
                </p>
                <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      prediction.credit_risk_prediction === 'Low' ? 'bg-green-500' :
                      prediction.credit_risk_prediction === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${prediction.credit_risk_probability * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default PredictionFormCreditRisk;
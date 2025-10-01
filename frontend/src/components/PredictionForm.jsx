import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';
import { CreditCard, Loader2, CheckCircle, XCircle, User, DollarSign, FileText, TrendingUp } from 'lucide-react';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function PredictionForm() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    Age: '',
    Income: '',
    LoanAmount: '',
    CreditScore: '',
    MonthsEmployed: '',
    NumCreditLines: '',
    InterestRate: '',
    LoanTerm: '',
    DTIRatio: '',
    Education: '',
    EmploymentType: '',
    MaritalStatus: '',
    HasMortgage: '',
    HasDependents: '',
    LoanPurpose: '',
    HasCoSigner: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPrediction(null);
    setIsLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/predict/`, formData);
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred. Please check your inputs or ensure the backend server is running.');
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
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <CreditCard className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold gradient-text">Loan Default Prediction</h1>
            </div>
            <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Get instant insights into loan default probability using advanced AI models
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
                      name="Age"
                      value={formData.Age}
                      onChange={handleChange}
                      required
                      min="18"
                      max="100"
                      placeholder="Enter your age"
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Education
                    </label>
                    <select
                      name="Education"
                      value={formData.Education}
                      onChange={handleChange}
                      required
                      className="form-select"
                    >
                      <option value="">Select Education Level</option>
                      <option value="high school">High School</option>
                      <option value="bachelor">Bachelor's Degree</option>
                      <option value="master's">Master's Degree</option>
                      <option value="phd">PhD</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Employment Type
                    </label>
                    <select
                      name="EmploymentType"
                      value={formData.EmploymentType}
                      onChange={handleChange}
                      required
                      className="form-select"
                    >
                      <option value="">Select Employment Type</option>
                      <option value="full-time">Full-Time</option>
                      <option value="part-time">Part-Time</option>
                      <option value="self-employed">Self-Employed</option>
                      <option value="unemployed">Unemployed</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Marital Status
                    </label>
                    <select
                      name="MaritalStatus"
                      value={formData.MaritalStatus}
                      onChange={handleChange}
                      required
                      className="form-select"
                    >
                      <option value="">Select Marital Status</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Months Employed
                    </label>
                    <input
                      type="number"
                      name="MonthsEmployed"
                      value={formData.MonthsEmployed}
                      onChange={handleChange}
                      required
                      min="0"
                      max="600"
                      placeholder="Number of months employed"
                      className="form-input"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Financial Information */}
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-semibold gradient-text flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Financial Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Annual Income
                    </label>
                    <input
                      type="number"
                      name="Income"
                      value={formData.Income}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="Annual income in Rupees"
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Loan Amount
                    </label>
                    <input
                      type="number"
                      name="LoanAmount"
                      value={formData.LoanAmount}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="Requested loan amount"
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Credit Score
                    </label>
                    <input
                      type="number"
                      name="CreditScore"
                      value={formData.CreditScore}
                      onChange={handleChange}
                      required
                      min="300"
                      max="850"
                      placeholder="Credit score (300-850)"
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Number of Credit Lines
                    </label>
                    <input
                      type="number"
                      name="NumCreditLines"
                      value={formData.NumCreditLines}
                      onChange={handleChange}
                      required
                      min="0"
                      placeholder="Number of credit lines"
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      DTI Ratio
                    </label>
                    <input
                      type="number"
                      name="DTIRatio"
                      value={formData.DTIRatio}
                      onChange={handleChange}
                      required
                      min="0"
                      max="1"
                      step="0.01"
                      placeholder="Debt-to-income ratio (0-1)"
                      className="form-input"
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Loan Details */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold gradient-text flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Loan Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    name="InterestRate"
                    value={formData.InterestRate}
                    onChange={handleChange}
                    required
                    min="0"
                    max="50"
                    step="0.01"
                    placeholder="Interest rate"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Loan Term (months)
                  </label>
                  <input
                    type="number"
                    name="LoanTerm"
                    value={formData.LoanTerm}
                    onChange={handleChange}
                    required
                    min="1"
                    max="600"
                    placeholder="Loan term in months"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Loan Purpose
                  </label>
                  <select
                    name="LoanPurpose"
                    value={formData.LoanPurpose}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    <option value="">Select Purpose</option>
                    <option value="auto">Auto</option>
                    <option value="business">Business</option>
                    <option value="education">Education</option>
                    <option value="home">Home</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Has Co-Signer
                  </label>
                  <select
                    name="HasCoSigner"
                    value={formData.HasCoSigner}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              {/* Additional Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Has Mortgage
                  </label>
                  <select
                    name="HasMortgage"
                    value={formData.HasMortgage}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Has Dependents
                  </label>
                  <select
                    name="HasDependents"
                    value={formData.HasDependents}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
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
                    Predict Default Risk
                  </div>
                )}
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
                prediction.prediction === 0 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
              }`}
            >
              <div className={`flex items-center gap-2 ${
                prediction.prediction === 0 
                  ? 'text-green-800 dark:text-green-400'
                  : 'text-yellow-800 dark:text-yellow-400'
              }`}>
                {prediction.prediction === 0 ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                <h3 className="font-semibold text-lg">Prediction Result</h3>
              </div>
              <div className="mt-4 space-y-2">
                <p className={`text-lg font-medium ${
                  prediction.prediction === 0 
                    ? 'text-green-800 dark:text-green-300'
                    : 'text-yellow-800 dark:text-yellow-300'
                }`}>
                  Status: {prediction.prediction === 0 ? 'Low Default Risk' : 'High Default Risk'}
                </p>
                <p className={`${
                  prediction.prediction === 0 
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-yellow-700 dark:text-yellow-400'
                }`}>
                  Default Probability: {(prediction.probability * 100).toFixed(2)}%
                </p>
                <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      prediction.prediction === 0 ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${prediction.probability * 100}%` }}
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

export default PredictionForm;
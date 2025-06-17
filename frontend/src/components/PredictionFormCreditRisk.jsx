import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPrediction(null);
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/credit_risk/', formData);
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred. Please check your inputs or ensure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`font-mono ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`rounded-2xl shadow-lg p-8 max-w-4xl mx-auto ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-shadow`}
      >
        <h2 className="text-3xl font-bold text-center mb-6 flex items-center justify-center">
          <Shield className="mr-2 w-8 h-8 text-blue-500" /> Credit Risk Assessment
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-500">Personal Information</h3>
            <div>
              <label className="block text-sm font-medium">Age</label>
              <input
                type="number"
                name="person_age"
                value={formData.person_age}
                onChange={handleChange}
                required
                min="18"
                max="100"
                placeholder="Enter age"
                className={`mt-1 w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-500' : 'bg-gray-700 border-gray-600 text-gray-300'}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Income (Rs)</label>
              <input
                type="number"
                name="person_income"
                value={formData.person_income}
                onChange={handleChange}
                required
                min="0"
                placeholder="Enter annual income"
                className={`mt-1 w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-500' : 'bg-gray-700 border-gray-600 text-gray-300'}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Home Ownership</label>
              <select
                name="person_home_ownership"
                value={formData.person_home_ownership}
                onChange={handleChange}
                required
                className={`mt-1 w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-500' : 'bg-gray-700 border-gray-600 text-gray-300'}`}
              >
                <option value="rent">Rent</option>
                <option value="own">Own</option>
                <option value="mortgage">Mortgage</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Employment Length (years)</label>
              <input
                type="number"
                name="person_emp_length"
                value={formData.person_emp_length}
                onChange={handleChange}
                required
                min="0"
                placeholder="Enter years employed"
                className={`mt-1 w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-500' : 'bg-gray-700 border-gray-600 text-gray-300'}`}
              />
            </div>
          </div>

          {/* Loan Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-500">Loan Details</h3>
            <div>
              <label className="block text-sm font-medium">Loan Intent</label>
              <select
                name="loan_intent"
                value={formData.loan_intent}
                onChange={handleChange}
                required
                className={`mt-1 w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-500' : 'bg-gray-700 border-gray-600 text-gray-300'}`}
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
              <label className="block text-sm font-medium">Loan Grade</label>
              <select
                name="loan_grade"
                value={formData.loan_grade}
                onChange={handleChange}
                required
                className={`mt-1 w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-500' : 'bg-gray-700 border-gray-600 text-gray-300'}`}
              >
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
                <option value="d">D</option>
                <option value="e">E</option>
                <option value="f">F</option>
                <option value="g">G</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Loan Amount (Rs)</label>
              <input
                type="number"
                name="loan_amnt"
                value={formData.loan_amnt}
                onChange={handleChange}
                required
                min="0"
                placeholder="Enter loan amount"
                className={`mt-1 w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-500' : 'bg-gray-700 border-gray-600 text-gray-300'}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Loan Interest Rate (%)</label>
              <input
                type="number"
                name="loan_int_rate"
                value={formData.loan_int_rate}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="Enter interest rate"
                className={`mt-1 w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-500' : 'bg-gray-700 border-gray-600 text-gray-300'}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Loan Percent of Income</label>
              <input
                type="number"
                name="loan_percent_income"
                value={formData.loan_percent_income}
                onChange={handleChange}
                required
                min="0"
                max="1"
                step="0.01"
                placeholder="Enter loan percent income"
                className={`mt-1 w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-500' : 'bg-gray-700 border-gray-600 text-gray-300'}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Default on File</label>
              <select
                name="cb_person_default_on_file"
                value={formData.cb_person_default_on_file}
                onChange={handleChange}
                required
                className={`mt-1 w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-500' : 'bg-gray-700 border-gray-600 text-gray-300'}`}
              >
                <option value="n">No</option>
                <option value="y">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Credit History Length (years)</label>
              <input
                type="number"
                name="cb_person_cred_hist_length"
                value={formData.cb_person_cred_hist_length}
                onChange={handleChange}
                required
                min="0"
                placeholder="Enter credit history length"
                className={`mt-1 w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-500' : 'bg-gray-700 border-gray-600 text-gray-300'}`}
              />
            </div>
          </div>

          <div className="md:col-span-2 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className={`w-full p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed ${theme === 'light' ? '' : 'hover:from-blue-700 hover:to-blue-800'}`}
            >
              {isLoading ? 'Predicting...' : 'Predict'}
            </motion.button>
          </div>
        </form>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-red-100 text-red-700 text-center rounded-full animate-pulse"
          >
            {error}
          </motion.div>
        )}
        {prediction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-4 p-6 rounded-2xl text-center ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}
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
import React, { useState } from 'react';
import axios from 'axios';

function PredictionFormCreditRisk() {
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
    <div className="bg-white rounded-xl shadow-xl p-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">Credit Risk Assessment</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-indigo-500">Personal Information</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              name="person_age"
              value={formData.person_age}
              onChange={handleChange}
              required
              min="18"
              max="100"
              placeholder="Enter age"
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Income (Rs)</label>
            <input
              type="number"
              name="person_income"
              value={formData.person_income}
              onChange={handleChange}
              required
              min="0"
              placeholder="Enter annual income"
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Home Ownership</label>
            <select
              name="person_home_ownership"
              value={formData.person_home_ownership}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="rent">Rent</option>
              <option value="own">Own</option>
              <option value="mortgage">Mortgage</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Employment Length (years)</label>
            <input
              type="number"
              name="person_emp_length"
              value={formData.person_emp_length}
              onChange={handleChange}
              required
              min="0"
              placeholder="Enter years employed"
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Loan Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-indigo-500">Loan Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Loan Intent</label>
            <select
              name="loan_intent"
              value={formData.loan_intent}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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
            <label className="block text-sm font-medium text-gray-700">Loan Grade</label>
            <select
              name="loan_grade"
              value={formData.loan_grade}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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
            <label className="block text-sm font-medium text-gray-700">Loan Amount (Rs)</label>
            <input
              type="number"
              name="loan_amnt"
              value={formData.loan_amnt}
              onChange={handleChange}
              required
              min="0"
              placeholder="Enter loan amount"
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Loan Interest Rate (%)</label>
            <input
              type="number"
              name="loan_int_rate"
              value={formData.loan_int_rate}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="Enter interest rate"
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Loan Percent of Income</label>
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
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default on File</label>
            <select
              name="cb_person_default_on_file"
              value={formData.cb_person_default_on_file}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="n">No</option>
              <option value="y">Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Credit History Length (years)</label>
            <input
              type="number"
              name="cb_person_cred_hist_length"
              value={formData.cb_person_cred_hist_length}
              onChange={handleChange}
              required
              min="0"
              placeholder="Enter credit history length"
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="md:col-span-2 mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Predicting...' : 'Predict'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 text-center rounded-md animate-pulse">
          {error}
        </div>
      )}
      {prediction && (
        <div className="mt-4 p-6 bg-gray-100 rounded-md text-center animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-800">Prediction Result</h3>
          <p className="mt-2 text-gray-600">
            Credit Risk: {prediction.credit_risk_prediction}
          </p>
          <p className="mt-1 text-gray-600">
            Risk Probability: {(prediction.credit_risk_probability * 100).toFixed(2)}%
          </p>
        </div>
      )}
    </div>
  );
}

export default PredictionFormCreditRisk;
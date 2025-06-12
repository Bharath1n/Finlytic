import React, { useState } from 'react';
import axios from 'axios';

function PredictionForm() {
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
      const response = await axios.post('http://localhost:8000/predict/', formData);
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred. Please check your inputs or ensure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">Loan Default Prediction</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-indigo-500">Personal Information</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              name="Age"
              value={formData.Age}
              onChange={handleChange}
              required
              min="18"
              max="100"
              placeholder="Enter age"
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Education</label>
            <select
              name="Education"
              value={formData.Education}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Education</option>
              <option value="high school">High School</option>
              <option value="bachelor">Bachelor's</option>
              <option value="master's">Master's</option>
              <option value="phd">PhD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Employment Type</label>
            <select
              name="EmploymentType"
              value={formData.EmploymentType}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Employment</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="self-employed">Self-employed</option>
              <option value="unemployed">Unemployed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Marital Status</label>
            <select
              name="MaritalStatus"
              value={formData.MaritalStatus}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Has Dependents</label>
            <select
              name="HasDependents"
              value={formData.HasDependents}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        {/* Financial Information */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-indigo-500">Financial Information</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Income</label>
            <input
              type="number"
              name="Income"
              value={formData.Income}
              onChange={handleChange}
              required
              min="0"
              placeholder="Enter annual income"
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Loan Amount</label>
            <input
              type="number"
              name="LoanAmount"
              value={formData.LoanAmount}
              onChange={handleChange}
              required
              min="0"
              placeholder="Enter loan amount"
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Credit Score</label>
            <input
              type="number"
              name="CreditScore"
              value={formData.CreditScore}
              onChange={handleChange}
              required
              min="300"
              max="850"
              placeholder="Enter credit score"
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Months Employed</label>
            <input
              type="number"
              name="MonthsEmployed"
              value={formData.MonthsEmployed}
              onChange={handleChange}
              required
              min="0"
              placeholder="Enter months employed"
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Credit Lines</label>
            <input
              type="number"
              name="NumCreditLines"
              value={formData.NumCreditLines}
              onChange={handleChange}
              required
              min="1"
              max="10"
              placeholder="Enter number of credit lines"
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
            <input
              type="number"
              name="InterestRate"
              value={formData.InterestRate}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="Enter interest rate"
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Loan Term (months)</label>
            <select
              name="LoanTerm"
              value={formData.LoanTerm}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Term</option>
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="36">36</option>
              <option value="48">48</option>
              <option value="60">60</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">DTI Ratio</label>
            <input
              type="number"
              name="DTIRatio"
              value={formData.DTIRatio}
              onChange={handleChange}
              required
              min="0"
              max="1"
              step="0.01"
              placeholder="Enter DTI ratio"
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>

        {/* Loan Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-indigo-500">Loan Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Has Mortgage</label>
            <select
              name="HasMortgage"
              value={formData.HasMortgage}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Loan Purpose</label>
            <select
              name="LoanPurpose"
              value={formData.LoanPurpose}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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
            <label className="block text-sm font-medium text-gray-700">Has Co-Signer</label>
            <select
              name="HasCoSigner"
              value={formData.HasCoSigner}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
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
            Default Prediction: {prediction.prediction === 0 ? 'Not Likely to Default' : 'Likely to Default'}
          </p>
          <p className="mt-1 text-gray-600">
            Default Probability: {(prediction.probability * 100).toFixed(2)}%
          </p>
        </div>
      )}
    </div>
  );
}

export default PredictionForm;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('loan_default');

  useEffect(() => {
    const fetchStats = async () => {
      setError('');
      setStats(null);
      try {
        const endpoint = mode === 'loan_default' ? '/stats/' : '/credit_risk_stats/';
        const response = await axios.get(`http://localhost:8000${endpoint}`);
        console.log(`Stats for ${mode}:`, response.data);
        setStats(response.data);
      } catch (err) {
        console.error(`Error fetching ${endpoint}:`, err);
        setError(`Failed to load ${mode === 'loan_default' ? 'loan default' : 'credit risk'} statistics. Please ensure the backend server is running.`);
      }
    };
    fetchStats();
  }, [mode]);

  const handleModeChange = (newMode) => {
    setStats(null); // Reset stats to trigger loading
    setMode(newMode);
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-xl p-8">
        <p className="text-red-700 text-center">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-xl shadow-xl p-8">
        <p className="text-gray-600 text-center">Loading...</p>
      </div>
    );
  }

  const generateBarChartData = (label, dataObj, color = '#4f46e5') => {
    console.log(`Generating chart for ${label}:`, dataObj);
    const safeDataObj = dataObj || {};
    return {
      labels: Object.keys(safeDataObj),
      datasets: [
        {
          label,
          data: Object.values(safeDataObj),
          backgroundColor: color,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
        {mode === 'loan_default' ? 'Loan Default Dataset Dashboard' : 'Credit Risk Dataset Dashboard'}
      </h2>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => handleModeChange('loan_default')}
          className={`px-4 py-2 mx-2 rounded-md font-semibold transition duration-300 ${
            mode === 'loan_default'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Loan Default
        </button>
        <button
          onClick={() => handleModeChange('credit_risk')}
          className={`px-4 py-2 mx-2 rounded-md font-semibold transition duration-300 ${
            mode === 'credit_risk'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Credit Risk
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-indigo-50 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Average Age</h3>
          <p className="text-2xl font-semibold text-indigo-600">{stats.averageAge?.toFixed(1) || 'N/A'}</p>
        </div>
        <div className="p-4 bg-indigo-50 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Average Income</h3>
          <p className="text-2xl font-semibold text-indigo-600">Rs {stats.averageIncome?.toLocaleString() || 'N/A'}</p>
        </div>
        <div className="p-4 bg-indigo-50 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Average Loan Amount</h3>
          <p className="text-2xl font-semibold text-indigo-600">Rs {stats.averageLoanAmount?.toLocaleString() || 'N/A'}</p>
        </div>
        <div className="p-4 bg-indigo-50 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Default Rate</h3>
          <p className="text-2xl font-semibold text-indigo-600">{stats.defaultRate?.toFixed(1) || 'N/A'}%</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Default Distribution</h3>
        <div className="h-64">
          <Pie
            data={{
              labels: ['Non-Defaulted', 'Defaulted'],
              datasets: [
                {
                  data: stats.defaultDistribution || [0, 0],
                  backgroundColor: ['#4f46e5', '#e11d48'],
                  borderColor: '#fff',
                  borderWidth: 1,
                },
              ],
            }}
            options={chartOptions}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mode === 'loan_default' ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Education Distribution</h3>
              <div className="h-64">
                <Bar data={generateBarChartData("Education", stats.educationDistribution)} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Loan Purpose Distribution</h3>
              <div className="h-64">
                <Bar data={generateBarChartData("Loan Purpose", stats.loanPurposeDistribution)} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Employment Type Distribution</h3>
              <div className="h-64">
                <Bar data={generateBarChartData("Employment Type", stats.employmentTypeDistribution)} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Marital Status Distribution</h3>
              <div className="h-64">
                <Bar data={generateBarChartData("Marital Status", stats.maritalStatusDistribution)} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">DTI Ratio Distribution</h3>
              <div className="h-64">
                <Bar data={generateBarChartData("DTI Ratio", stats.dtiDistribution)} options={chartOptions} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Home Ownership Distribution</h3>
              <div className="h-64">
                <Bar data={generateBarChartData("Home Ownership", stats.homeOwnershipDistribution)} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Loan Intent Distribution</h3>
              <div className="h-64">
                <Bar data={generateBarChartData("Loan Intent", stats.loanIntentDistribution)} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Loan Grade Distribution</h3>
              <div className="h-64">
                <Bar data={generateBarChartData("Loan Grade", stats.loanGradeDistribution)} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Default on File Distribution</h3>
              <div className="h-64">
                <Bar data={generateBarChartData("Default on File", stats.defaultOnFileDistribution)} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Loan Percent Income Distribution</h3>
              <div className="h-64">
                <Bar data={generateBarChartData("Loan Percent Income", stats.loanPercentIncomeDistribution)} options={chartOptions} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
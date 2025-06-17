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
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';
import { BarChart2, PieChart } from 'lucide-react';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const { theme } = useTheme();
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
  const generateBarChartData = (label, dataObj, color = '#4f46e5') => {
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
        labels: {
          color: theme === 'light' ? '#4b5563' : '#d1d5db',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme === 'light' ? '#4b5563' : '#d1d5db',
        },
      },
      y: {
        ticks: {
          color: theme === 'light' ? '#4b5563' : '#d1d5db',
        },
      },
    },
  };

  if (error) {
    return (
      <div className={`font-mono ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`rounded-2xl shadow-lg p-8 max-w-4xl mx-auto text-center ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}
        >
          <p className="text-red-700">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`font-mono ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`rounded-2xl shadow-lg p-8 max-w-4xl mx-auto text-center ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}
        >
          <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`font-mono ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`rounded-2xl shadow-lg p-8 max-w-6xl mx-auto ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-shadow`}
      >
        <h2 className="text-3xl font-bold text-center mb-6 flex items-center justify-center">
          <BarChart2 className="mr-2 w-8 h-8 text-blue-500" />
          {mode === 'loan_default' ? 'Loan Default Dataset Dashboard' : 'Credit Risk Dataset Dashboard'}
        </h2>

        <div className="flex justify-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleModeChange('loan_default')}
            className={`px-4 py-2 mx-2 rounded-full font-semibold transition duration-300 ${mode === 'loan_default' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            Loan Default
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleModeChange('credit_risk')}
            className={`px-4 py-2 mx-2 rounded-full font-semibold transition duration-300 ${mode === 'credit_risk' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            Credit Risk
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className={`p-4 rounded-2xl shadow-sm ${theme === 'light' ? 'bg-indigo-50' : 'bg-indigo-900'}`}>
            <h3 className="text-sm font-medium">Average Age</h3>
            <p className="text-2xl font-semibold text-blue-500">{stats.averageAge?.toFixed(1) || 'N/A'}</p>
          </div>
          <div className={`p-4 rounded-2xl shadow-sm ${theme === 'light' ? 'bg-indigo-50' : 'bg-indigo-900'}`}>
            <h3 className="text-sm font-medium">Average Income</h3>
            <p className="text-2xl font-semibold text-blue-500">Rs {stats.averageIncome?.toLocaleString() || 'N/A'}</p>
          </div>
          <div className={`p-4 rounded-2xl shadow-sm ${theme === 'light' ? 'bg-indigo-50' : 'bg-indigo-900'}`}>
            <h3 className="text-sm font-medium">Average Loan Amount</h3>
            <p className="text-2xl font-semibold text-blue-500">Rs {stats.averageLoanAmount?.toLocaleString() || 'N/A'}</p>
          </div>
          <div className={`p-4 rounded-2xl shadow-sm ${theme === 'light' ? 'bg-indigo-50' : 'bg-indigo-900'}`}>
            <h3 className="text-sm font-medium">Default Rate</h3>
            <p className="text-2xl font-semibold text-blue-500">{stats.defaultRate?.toFixed(1) || 'N/A'}%</p>
          </div>
        </div>

        <div className={`p-6 rounded-2xl shadow mb-8 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <PieChart className="mr-2 w-6 h-6 text-blue-500" /> Default Distribution
          </h3>
          <div className="h-64">
            <Pie
              data={{
                labels: ['Non-Defaulted', 'Defaulted'],
                datasets: [
                  {
                    data: stats.defaultDistribution || [0, 0],
                    backgroundColor: ['#4f46e5', '#e11d48'],
                    borderColor: theme === 'light' ? '#fff' : '#1f2937',
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
              <div className={`p-6 rounded-2xl shadow ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BarChart2 className="mr-2 w-6 h-6 text-blue-500" /> Education Distribution
                </h3>
                <div className="h-64">
                  <Bar data={generateBarChartData("Education", stats.educationDistribution)} options={chartOptions} />
                </div>
              </div>
              <div className={`p-6 rounded-2xl shadow ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BarChart2 className="mr-2 w-6 h-6 text-blue-500" /> Loan Purpose Distribution
                </h3>
                <div className="h-64">
                  <Bar data={generateBarChartData("Loan Purpose", stats.loanPurposeDistribution)} options={chartOptions} />
                </div>
              </div>
              <div className={`p-6 rounded-2xl shadow ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BarChart2 className="mr-2 w-6 h-6 text-blue-500" /> Employment Type Distribution
                </h3>
                <div className="h-64">
                  <Bar data={generateBarChartData("Employment Type", stats.employmentTypeDistribution)} options={chartOptions} />
                </div>
              </div>
              <div className={`p-6 rounded-2xl shadow ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BarChart2 className="mr-2 w-6 h-6 text-blue-500" /> Marital Status Distribution
                </h3>
                <div className="h-64">
                  <Bar data={generateBarChartData("Marital Status", stats.maritalStatusDistribution)} options={chartOptions} />
                </div>
              </div>
              <div className={`p-6 rounded-2xl shadow ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BarChart2 className="mr-2 w-6 h-6 text-blue-500" /> DTI Ratio Distribution
                </h3>
                <div className="h-64">
                  <Bar data={generateBarChartData("DTI Ratio", stats.dtiDistribution)} options={chartOptions} />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={`p-6 rounded-2xl shadow ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BarChart2 className="mr-2 w-6 h-6 text-blue-500" /> Home Ownership Distribution
                </h3>
                <div className="h-64">
                  <Bar data={generateBarChartData("Home Ownership", stats.homeOwnershipDistribution)} options={chartOptions} />
                </div>
              </div>
              <div className={`p-6 rounded-2xl shadow ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BarChart2 className="mr-2 w-6 h-6 text-blue-500" /> Loan Intent Distribution
                </h3>
                <div className="h-64">
                  <Bar data={generateBarChartData("Loan Intent", stats.loanIntentDistribution)} options={chartOptions} />
                </div>
              </div>
              <div className={`p-6 rounded-2xl shadow ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BarChart2 className="mr-2 w-6 h-6 text-blue-500" /> Loan Grade Distribution
                </h3>
                <div className="h-64">
                  <Bar data={generateBarChartData("Loan Grade", stats.loanGradeDistribution)} options={chartOptions} />
                </div>
              </div>
              <div className={`p-6 rounded-2xl shadow ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BarChart2 className="mr-2 w-6 h-6 text-blue-500" /> Default on File Distribution
                </h3>
                <div className="h-64">
                  <Bar data={generateBarChartData("Default on File", stats.defaultOnFileDistribution)} options={chartOptions} />
                </div>
              </div>
              <div className={`p-6 rounded-2xl shadow ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BarChart2 className="mr-2 w-6 h-6 text-blue-500" /> Loan Percent Income Distribution
                </h3>
                <div className="h-64">
                  <Bar data={generateBarChartData("Loan Percent Income", stats.loanPercentIncomeDistribution)} options={chartOptions} />
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
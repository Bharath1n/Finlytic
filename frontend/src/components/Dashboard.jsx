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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/stats/');
        setStats(response.data);
      } catch (err) {
        setError('Failed to load statistics. Please ensure the backend server is running.');
      }
    };
    fetchStats();
  }, []);

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

  // Reusable chart generator
  const generateBarChartData = (label, dataObj, color = '#4f46e5') => ({
    labels: Object.keys(dataObj),
    datasets: [
      {
        label,
        data: Object.values(dataObj),
        backgroundColor: color,
      },
    ],
  });

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
      <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">Loan Dataset Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-indigo-50 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Average Age</h3>
          <p className="text-2xl font-semibold text-indigo-600">{stats.averageAge.toFixed(1)}</p>
        </div>
        <div className="p-4 bg-indigo-50 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Average Income</h3>
          <p className="text-2xl font-semibold text-indigo-600">Rs {stats.averageIncome.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-indigo-50 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Average Loan Amount</h3>
          <p className="text-2xl font-semibold text-indigo-600">Rs {stats.averageLoanAmount.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-indigo-50 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Default Rate</h3>
          <p className="text-2xl font-semibold text-indigo-600">{stats.defaultRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Pie Chart: Default Distribution */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Default Distribution</h3>
        <div className="h-64">
          <Pie
            data={{
              labels: ['Non-Defaulted', 'Defaulted'],
              datasets: [
                {
                  data: stats.defaultDistribution,
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

      {/* Bar Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
};

export default Dashboard;

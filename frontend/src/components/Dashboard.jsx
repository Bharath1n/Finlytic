import React, { useState, useEffect, useRef } from 'react';
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
import { useTheme, ThemeToggle } from './ThemeContext';
import { motion } from 'framer-motion';
import { BarChart2, PieChart, Download, TrendingUp, Users, Award, DollarSign, ArrowRight, Home, Menu, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Link } from 'react-router-dom';
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Error Boundary Component
class ChartErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 text-center p-6 font-mono bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
          Error rendering chart: {this.state.error?.message || 'Unknown error'}
        </div>
      );
    }
    return this.props.children;
  }
}

const FloatingElements = ({ theme }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        className={`absolute w-2 h-2 ${theme === 'light' ? 'bg-blue-200/30' : 'bg-blue-400/20'} rounded-full`}
        initial={{
          x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
          y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
        }}
        animate={{
          x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
          y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
        }}
        transition={{
          duration: Math.random() * 10 + 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      />
    ))}
  </div>
);

const GradientOrb = ({ delay = 0, scale = 1, color = "blue" }) => (
  <motion.div
    className={`absolute w-96 h-96 rounded-full opacity-20 blur-3xl ${
      color === "blue" ? "bg-blue-500" : 
      color === "purple" ? "bg-purple-500" : 
      "bg-pink-500"
    }`}
    animate={{
      scale: [scale, scale * 1.2, scale],
      opacity: [0.1, 0.3, 0.1],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  />
);

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('loan_default');
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const dashboardRef = useRef(null);
  const chartRefs = useRef({});

  useEffect(() => {
    const fetchStats = async () => {
      setError('');
      setStats(null);
      try {
        const endpoint = mode === 'loan_default' ? '/stats/' : '/credit_risk_stats/';
        const response = await axios.get(`${backendUrl}${endpoint}`);
        setStats(response.data);
      } catch (err) {
        setError(`Failed to load ${mode === 'loan_default' ? 'loan default' : 'credit risk'} statistics. Please ensure the backend server is running.`);
      }
    };
    fetchStats();
  }, [mode]);

  // Cleanup charts on mode or stats change
  useEffect(() => {
    return () => {
      Object.values(chartRefs.current).forEach(chart => {
        if (chart) chart.destroy();
      });
      chartRefs.current = {};
    };
  }, [stats, mode]);

  const handleModeChange = (newMode) => {
    setStats(null);
    setMode(newMode);
  };
  const generateBarChartData = (label, dataObj, color = '#4f46e5') => {
    if (!dataObj || typeof dataObj !== 'object') {
      return { labels: [], datasets: [] };
    }
    const colors = label === 'Default'
      ? Object.keys(dataObj).map((_, i) => i === 0 ? '#3b82f6' : '#ef4444')
      : Array(Object.keys(dataObj).length).fill(color);
    return {
      labels: Object.keys(dataObj),
      datasets: [
        {
          label,
          data: Object.values(dataObj),
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
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
          font: { size: 14, family: 'monospace' },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme === 'light' ? '#4b5563' : '#d1d5db',
          font: { size: 12, family: 'monospace' },
        },
      },
      y: {
        ticks: {
          color: theme === 'light' ? '#4b5563' : '#d1d5db',
          font: { size: 12, family: 'monospace' },
        },
      },
    },
  };

  const exportToPDF = async (retryCount = 0) => {
  if (!stats) {
    setError('Cannot export PDF: Dashboard data is still loading.');
    return;
  }
  if (!dashboardRef.current && retryCount < 3) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return exportToPDF(retryCount + 1);
  }
  if (!dashboardRef.current) {
    setError('Dashboard reference not found. Please try again after the dashboard fully loads.');
    return;
  }
  setIsExportingPDF(true);
  setError('');
  try {
    // Ensure charts are fully rendered
    await new Promise(resolve => setTimeout(resolve, 2000)); // Increased delay

    // Temporarily disable icon hiding to avoid layout issues
    const icons = dashboardRef.current.querySelectorAll('svg');
    icons.forEach(icon => (icon.style.visibility = 'hidden')); // Use visibility instead of display

    const canvas = await html2canvas(dashboardRef.current, {
      scale: 2, // Higher resolution for better quality
      useCORS: true,
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
      logging: true,
      windowWidth: dashboardRef.current.scrollWidth,
      windowHeight: dashboardRef.current.scrollHeight,
      ignoreElements: (element) => element.tagName === 'CANVAS' && !element.classList.contains('chartjs-render-monitor'), // Avoid capturing hidden canvases
    });

    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    while (heightLeft > 0) {
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, Math.min(imgHeight, pdfHeight));
      heightLeft -= pdfHeight;
      position -= pdfHeight;
      if (heightLeft > 0) {
        pdf.addPage();
        position = 0; // Reset position for new page
      }
    }

    pdf.save(`dashboard_${mode}_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (err) {
    console.error('Export to PDF failed:', err);
    setError(`Failed to export PDF: ${err.message}. Please check console for details.`);
  } finally {
    const icons = dashboardRef.current?.querySelectorAll('svg');
    if (icons) icons.forEach(icon => (icon.style.visibility = ''));
    setIsExportingPDF(false);
  }
};

  const exportToCSV = () => {
    if (!stats) {
      setError('No data available to export.');
      return;
    }
    const headers = [
      'averageAge', 'averageIncome', 'averageLoanAmount', 'defaultRate',
      'defaultDistribution', 'educationDistribution', 'loanPurposeDistribution',
      'employmentTypeDistribution', 'maritalStatusDistribution', 'dtiDistribution',
      'homeOwnershipDistribution', 'loanIntentDistribution', 'loanGradeDistribution',
      'defaultOnFileDistribution', 'loanPercentIncomeDistribution'
    ].filter(key => stats[key] !== undefined);
    let csvContent = `data:text/csv;charset=utf-8,${headers.join(',')}\n`;
    const values = headers.map(key => {
      const value = stats[key];
      if (typeof value === 'object' && value !== null) {
        return `"${JSON.stringify(value).replace(/"/g, '')}"`;
      }
      return value;
    }).join(',');
    csvContent += `${values}\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dashboard_${mode}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <div className={`min-h-screen font-mono relative overflow-hidden ${theme === 'light' ? 'bg-gradient-to-br from-gray-50 via-white to-blue-50 text-black' : 'bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white'}`}>
        <FloatingElements theme={theme} />
        <GradientOrb delay={0} scale={1} color="blue" />
        <GradientOrb delay={2} scale={0.8} color="purple" />
        <GradientOrb delay={4} scale={0.6} color="pink" />
        <div className="relative z-50 p-6">
          <motion.div 
            className={`backdrop-blur-xl ${theme === 'light' ? 'bg-white/20 border-white/20' : 'bg-black/20 border-white/10'} border rounded-2xl p-4 max-w-7xl mx-auto flex justify-between items-center`}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              FIN-LYTIC
            </Link>
            {/* <div className="flex items-center space-x-6">
              <Link 
                to="/" 
                className={`flex items-center ${theme === 'light' ? 'text-gray-700 hover:text-blue-600' : 'text-gray-300 hover:text-blue-400'} transition-colors`}
              >
                <Home className="w-5 h-5 mr-2" />
                Home
              </Link>
              <ThemeToggle />
            </div> */}
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex items-center justify-center px-8"
        >
          <div className={`backdrop-blur-lg ${theme === 'light' ? 'bg-white/60 border-white/30' : 'bg-black/40 border-white/10'} border rounded-3xl p-8 max-w-2xl text-center shadow-2xl`}>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <BarChart2 className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Unable to Load Dashboard</h2>
            <p className="text-red-500 text-lg mb-6">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Retry
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!stats) {
    return (
      <>
      <FloatingElements theme={theme} />
        <GradientOrb delay={0} scale={1} color="blue" />
        <GradientOrb delay={2} scale={0.8} color="purple" />
        <GradientOrb delay={4} scale={0.6} color="pink" />
        {/* <div className="relative z-50 p-6">
          <motion.div 
            className={`backdrop-blur-xl ${theme === 'light' ? 'bg-white/20 border-white/20' : 'bg-black/20 border-white/10'} border rounded-2xl p-4 max-w-7xl mx-auto flex justify-between items-center`}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              FIN-LYTIC
            </Link>
            {/* <div className="flex items-center space-x-6">
              <Link 
                to="/" 
                className={`flex items-center ${theme === 'light' ? 'text-gray-700 hover:text-blue-600' : 'text-gray-300 hover:text-blue-400'} transition-colors`}
              >
                <Home className="w-5 h-5 mr-2" />
                Home
              </Link>
              <ThemeToggle />
            </div> */}
          {/* </motion.div>
        </div>*/}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex items-center justify-center px-8"
        > 
          <div className={`backdrop-blur-lg ${theme === 'light' ? 'bg-white/60 border-white/30' : 'bg-black/40 border-white/10'} border rounded-3xl p-8 max-w-md text-center shadow-2xl`}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
            >
              <TrendingUp className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-4">Loading Dashboard...</h2>
            <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
              Fetching analytics data...
            </p>
          </div>
        </motion.div>
      </>
    );
  }

  const chartKey = `${mode}-${JSON.stringify(stats).length}`;


  return (
    <div className={`min-h-screen font-display relative overflow-hidden ${theme === 'light' ? 'bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900' : 'bg-gradient-to-br from-gray-900 via-black to-blue-900 text-gray-100'}`}>
      <FloatingElements theme={theme} />
      <GradientOrb delay={0} scale={1} color="blue" />
      <GradientOrb delay={2} scale={0.8} color="purple" />
      <GradientOrb delay={4} scale={0.6} color="pink" />
      
      {/* Dashboard Content */}
      <div className="relative z-10 px-8 pb-32 pt-8" ref={dashboardRef}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-7xl mx-auto"
        >
          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mb-8"
            >
              <div className={`w-32 h-32 mx-auto rounded-full ${theme === 'light' ? 'bg-gradient-to-r from-blue-100 to-purple-100' : 'bg-gradient-to-r from-blue-900 to-purple-900'} flex items-center justify-center mb-8 relative`}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 border-2 border-dashed border-blue-400 rounded-full"
                />
                <BarChart2 className="w-12 h-12 text-blue-500" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-4xl md:text-6xl font-black tracking-tight mb-6"
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Analytics Dashboard
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className={`text-xl ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} max-w-3xl mx-auto mb-12`}
            >
              Real-time insights and comprehensive data visualization for {mode === 'loan_default' ? 'loan default predictions' : 'credit risk analysis'}
            </motion.p>
          </div>

          {/* Control Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleModeChange('loan_default')}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                mode === 'loan_default' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                  : `${theme === 'light' ? 'bg-white/60 text-gray-700 border border-white/30' : 'bg-black/40 text-gray-300 border border-white/10'} backdrop-blur-lg`
              }`}
            >
              Loan Default Analytics
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleModeChange('credit_risk')}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                mode === 'credit_risk' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                  : `${theme === 'light' ? 'bg-white/60 text-gray-700 border border-white/30' : 'bg-black/40 text-gray-300 border border-white/10'} backdrop-blur-lg`
              }`}
            >
              Credit Risk Analytics
            </motion.button>
            {/* <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToPDF}
              disabled={isExportingPDF}
              className={`px-6 py-3 rounded-2xl font-semibold flex items-center ${
                isExportingPDF 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
              } text-white transition-all duration-300`}
            >
              <Download className="w-4 h-4 mr-2" />
              {isExportingPDF ? 'Exporting...' : 'Export PDF'}
            </motion.button> */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToCSV}
              className="px-6 py-3 rounded-2xl font-semibold flex items-center bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </motion.button>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {[
              { 
                icon: Users, 
                value: stats.averageAge ? stats.averageAge.toFixed(1) : 'N/A', 
                label: 'Average Age',
                gradient: 'from-blue-500 to-cyan-400'
              },
              { 
                icon: DollarSign, 
                value: stats.averageIncome ? `₹${(stats.averageIncome / 1000).toFixed(0)}K` : 'N/A', 
                label: 'Average Income',
                gradient: 'from-green-500 to-emerald-400'
              },
              { 
                icon: TrendingUp, 
                value: stats.averageLoanAmount ? `₹${(stats.averageLoanAmount / 1000).toFixed(0)}K` : 'N/A', 
                label: 'Average Loan',
                gradient: 'from-purple-500 to-pink-400'
              },
              { 
                icon: Award, 
                value: stats.defaultRate ? `${stats.defaultRate.toFixed(1)}%` : 'N/A', 
                label: 'Default Rate',
                gradient: 'from-red-500 to-orange-400'
              }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.4 + i * 0.1, duration: 0.6 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group glass border rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
              >
                <motion.div
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                />
                
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className={`text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {stat.label}
                </h3>
                
                <p className="text-2xl font-bold group-hover:text-blue-500 transition-colors">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="space-y-12"
          >
            {/* Default Distribution Chart */}
            <div className="glass border rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-center mb-8">
                <PieChart className="w-8 h-8 text-blue-500 mr-3" />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Default Distribution Overview
                </h3>
              </div>
              <div className="h-96">
                <ChartErrorBoundary>
                  <Pie
                    key={`default-${chartKey}`}
                    data={generateBarChartData('Default', stats.defaultDistribution)}
                    options={chartOptions}
                    ref={(el) => {
                      if (el) chartRefs.current['default'] = el.chartInstance;
                    }}
                  />
                </ChartErrorBoundary>
              </div>
            </div>

            {/* Additional Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {mode === 'loan_default' && (
                <>
                  <div className="glass border rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500">
                    <div className="flex items-center mb-6">
                      <BarChart2 className="w-6 h-6 text-green-500 mr-3" />
                      <h4 className="text-xl font-semibold">Education Distribution</h4>
                    </div>
                    <div className="h-80">
                      <ChartErrorBoundary>
                        <Bar
                          key={`education-${chartKey}`}
                          data={generateBarChartData('Education', stats.educationDistribution, '#10b981')}
                          options={chartOptions}
                          ref={(el) => {
                            if (el) chartRefs.current['education'] = el.chartInstance;
                          }}
                        />
                      </ChartErrorBoundary>
                    </div>
                  </div>

                  <div className={`${theme === 'light' ? 'bg-white/60' : 'bg-black/40'} backdrop-blur-lg border ${theme === 'light' ? 'border-white/30' : 'border-white/10'} rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500`}>
                    <div className="flex items-center mb-6">
                      <BarChart2 className="w-6 h-6 text-yellow-500 mr-3" />
                      <h4 className="text-xl font-semibold">Loan Purpose Distribution</h4>
                    </div>
                    <div className="h-80">
                      <ChartErrorBoundary>
                        <Bar
                          key={`loanPurpose-${chartKey}`}
                          data={generateBarChartData('Loan Purpose', stats.loanPurposeDistribution, '#f59e0b')}
                          options={chartOptions}
                          ref={(el) => {
                            if (el) chartRefs.current['loanPurpose'] = el.chartInstance;
                          }}
                        />
                      </ChartErrorBoundary>
                    </div>
                  </div>

                  <div className={`${theme === 'light' ? 'bg-white/60' : 'bg-black/40'} backdrop-blur-lg border ${theme === 'light' ? 'border-white/30' : 'border-white/10'} rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500`}>
                    <div className="flex items-center mb-6">
                      <BarChart2 className="w-6 h-6 text-red-500 mr-3" />
                      <h4 className="text-xl font-semibold">Employment Type</h4>
                    </div>
                    <div className="h-80">
                      <ChartErrorBoundary>
                        <Bar
                          key={`employment-${chartKey}`}
                          data={generateBarChartData('Employment Type', stats.employmentTypeDistribution, '#ef4444')}
                          options={chartOptions}
                          ref={(el) => {
                            if (el) chartRefs.current['employment'] = el.chartInstance;
                          }}
                        />
                      </ChartErrorBoundary>
                    </div>
                  </div>

                  <div className={`${theme === 'light' ? 'bg-white/60' : 'bg-black/40'} backdrop-blur-lg border ${theme === 'light' ? 'border-white/30' : 'border-white/10'} rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500`}>
                    <div className="flex items-center mb-6">
                      <BarChart2 className="w-6 h-6 text-purple-500 mr-3" />
                      <h4 className="text-xl font-semibold">Marital Status</h4>
                    </div>
                    <div className="h-80">
                      <ChartErrorBoundary>
                        <Bar
                          key={`marital-${chartKey}`}
                          data={generateBarChartData('Marital Status', stats.maritalStatusDistribution, '#8b5cf6')}
                          options={chartOptions}
                          ref={(el) => {
                            if (el) chartRefs.current['marital'] = el.chartInstance;
                          }}
                        />
                      </ChartErrorBoundary>
                    </div>
                  </div>
                </>
              )}

              {mode === 'credit_risk' && (
                <>
                  <div className={`${theme === 'light' ? 'bg-white/60' : 'bg-black/40'} backdrop-blur-lg border ${theme === 'light' ? 'border-white/30' : 'border-white/10'} rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500`}>
                    <div className="flex items-center mb-6">
                      <BarChart2 className="w-6 h-6 text-green-500 mr-3" />
                      <h4 className="text-xl font-semibold">Home Ownership</h4>
                    </div>
                    <div className="h-80">
                      <ChartErrorBoundary>
                        <Bar
                          key={`homeOwnership-${chartKey}`}
                          data={generateBarChartData('Home Ownership', stats.homeOwnershipDistribution, '#10b981')}
                          options={chartOptions}
                          ref={(el) => {
                            if (el) chartRefs.current['homeOwnership'] = el.chartInstance;
                          }}
                        />
                      </ChartErrorBoundary>
                    </div>
                  </div>

                  <div className={`${theme === 'light' ? 'bg-white/60' : 'bg-black/40'} backdrop-blur-lg border ${theme === 'light' ? 'border-white/30' : 'border-white/10'} rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500`}>
                    <div className="flex items-center mb-6">
                      <BarChart2 className="w-6 h-6 text-yellow-500 mr-3" />
                      <h4 className="text-xl font-semibold">Loan Intent</h4>
                    </div>
                    <div className="h-80">
                      <ChartErrorBoundary>
                        <Bar
                          key={`loanIntent-${chartKey}`}
                          data={generateBarChartData('Loan Intent', stats.loanIntentDistribution, '#f59e0b')}
                          options={chartOptions}
                          ref={(el) => {
                            if (el) chartRefs.current['loanIntent'] = el.chartInstance;
                          }}
                        />
                      </ChartErrorBoundary>
                    </div>
                  </div>

                  <div className={`${theme === 'light' ? 'bg-white/60' : 'bg-black/40'} backdrop-blur-lg border ${theme === 'light' ? 'border-white/30' : 'border-white/10'} rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500`}>
                    <div className="flex items-center mb-6">
                      <BarChart2 className="w-6 h-6 text-red-500 mr-3" />
                      <h4 className="text-xl font-semibold">Loan Grade</h4>
                    </div>
                    <div className="h-80">
                      <ChartErrorBoundary>
                        <Bar
                          key={`loanGrade-${chartKey}`}
                          data={generateBarChartData('Loan Grade', stats.loanGradeDistribution, '#ef4444')}
                          options={chartOptions}
                          ref={(el) => {
                            if (el) chartRefs.current['loanGrade'] = el.chartInstance;
                          }}
                        />
                      </ChartErrorBoundary>
                    </div>
                  </div>

                  <div className={`${theme === 'light' ? 'bg-white/60' : 'bg-black/40'} backdrop-blur-lg border ${theme === 'light' ? 'border-white/30' : 'border-white/10'} rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500`}>
                    <div className="flex items-center mb-6">
                      <BarChart2 className="w-6 h-6 text-purple-500 mr-3" />
                      <h4 className="text-xl font-semibold">Default on File</h4>
                    </div>
                    <div className="h-80">
                      <ChartErrorBoundary>
                        <Bar
                          key={`defaultOnFile-${chartKey}`}
                          data={generateBarChartData('Default on File', stats.defaultOnFileDistribution, '#8b5cf6')}
                          options={chartOptions}
                          ref={(el) => {
                            if (el) chartRefs.current['defaultOnFile'] = el.chartInstance;
                          }}
                        />
                      </ChartErrorBoundary>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className={`mt-16 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20' : 'bg-gradient-to-r from-blue-800/30 to-purple-800/30'} backdrop-blur-sm border ${theme === 'light' ? 'border-white/30' : 'border-white/10'} rounded-3xl p-12 text-center`}
          >
            <h3 className="text-3xl font-bold mb-6">Ready to Make Predictions?</h3>
            <p className={`text-lg mb-8 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} max-w-2xl mx-auto`}>
              Use our AI-powered prediction tools to analyze loan defaults and assess credit risks with industry-leading accuracy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/loan">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                >
                  Predict Loan Default
                  <ArrowRight className="ml-2 w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/credit-risk">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                >
                  Analyze Credit Risk
                  <ArrowRight className="ml-2 w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
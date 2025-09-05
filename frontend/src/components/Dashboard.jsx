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
import { BarChart2, PieChart, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
        <div style={{ color: '#b91c1c', textAlign: 'center', padding: '1.5rem', fontFamily: 'monospace' }}>
          Error rendering chart: {this.state.error?.message || 'Unknown error'}
        </div>
      );
    }
    return this.props.children;
  }
}
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
        console.log(`Stats for ${mode}:`, response.data);
        setStats(response.data);
      } catch (err) {
        console.error(`Error fetching ${endpoint}:`, err);
        setError(`Failed to load ${mode === 'loan_default' ? 'loan default' : 'credit risk'} statistics. Please ensure the backend server is running.`);
      }
    };
    fetchStats();
  }, [mode]);

  useEffect(() => {
    if (dashboardRef.current) {
      console.log('dashboardRef is set:', dashboardRef.current);
    }
  }, [dashboardRef]);

  useEffect(() => {
    return () => {
      Object.values(chartRefs.current).forEach((chart) => {
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
      console.warn(`Invalid dataObj for ${label}:`, dataObj);
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
      console.warn(`Retry ${retryCount + 1}: dashboardRef not set, waiting 500ms`);
      await new Promise(resolve => setTimeout(resolve, 500));
      return exportToPDF(retryCount + 1);
    }
    if (!dashboardRef.current) {
      setError('Dashboard reference not found. Please try again after the dashboard fully loads.');
      console.error('dashboardRef.current is null after retries');
      return;
    }
    setIsExportingPDF(true);
    setError('');
    try {
      const icons = dashboardRef.current.querySelectorAll('svg');
      icons.forEach(icon => (icon.style.display = 'none'));

      await new Promise(resolve => setTimeout(resolve, 1000));
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 1,
        useCORS: true,
        backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
        logging: true,
        windowWidth: dashboardRef.current.scrollWidth,
        windowHeight: dashboardRef.current.scrollHeight,
      });

      console.log('Canvas generated:', canvas.width, 'x', canvas.height);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let position = 0;
      let remainingHeight = imgHeight;
      while (remainingHeight > 0) {
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        remainingHeight -= pdfHeight;
        position -= pdfHeight;
        if (remainingHeight > 0) pdf.addPage();
      }

      pdf.save(`dashboard_${mode}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err.message, err.stack);
      setError(`Failed to export PDF: ${err.message}. Please try again or check console for details.`);
    } finally {
      icons.forEach(icon => (icon.style.display = ''));
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
      <div style={{ fontFamily: 'monospace', backgroundColor: theme === 'light' ? '#ffffff' : '#111827', color: theme === 'light' ? '#000000' : '#ffffff', minHeight: '100vh', padding: '2rem' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem', maxWidth: '64rem', margin: '0 auto', textAlign: 'center', backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937' }}
        >
          <p style={{ color: '#b91c1c', fontSize: '1.125rem' }}>{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ fontFamily: 'monospace', backgroundColor: theme === 'light' ? '#ffffff' : '#111827', color: theme === 'light' ? '#000000' : '#ffffff', minHeight: '100vh', padding: '2rem' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem', maxWidth: '64rem', margin: '0 auto', textAlign: 'center', backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937' }}
        >
          <p style={{ fontSize: '1.125rem', color: theme === 'light' ? '#4b5563' : '#d1d5db' }}>Loading...</p>
        </motion.div>
      </div>
    );
  }

  const chartKey = `${mode}-${JSON.stringify(stats).length}`;

  return (
    <div style={{ fontFamily: 'monospace', backgroundColor: theme === 'light' ? '#ffffff' : '#111827', color: theme === 'light' ? '#000000' : '#ffffff', minHeight: '100vh', padding: '3rem 1.5rem' }}>
      <div ref={dashboardRef}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            borderRadius: '1rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            padding: '2.5rem',
            maxWidth: '96rem',
            margin: '0 auto',
            backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem', gap: '1rem', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleModeChange('loan_default')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: mode === 'loan_default' ? '#3b82f6' : theme === 'light' ? '#e5e7eb' : '#374151',
                color: mode === 'loan_default' ? '#ffffff' : theme === 'light' ? '#4b5563' : '#d1d5db',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
              }}
            >
              Loan Default
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleModeChange('credit_risk')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: mode === 'credit_risk' ? '#3b82f6' : theme === 'light' ? '#e5e7eb' : '#374151',
                color: mode === 'credit_risk' ? '#ffffff' : theme === 'light' ? '#4b5563' : '#d1d5db',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
              }}
            >
              Credit Risk
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToPDF}
              disabled={isExportingPDF}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: isExportingPDF ? '#6b7280' : '#ef4444',
                color: '#ffffff',
                borderRadius: '0.5rem',
                cursor: isExportingPDF ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                fontSize: '1rem',
                fontWeight: '500',
              }}
            >
              <Download style={{ marginRight: '0.75rem', width: '1.25rem', height: '1.25rem' }} />
              {isExportingPDF ? 'Exporting...' : 'Export to PDF'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToCSV}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: '#ffffff',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                fontSize: '1rem',
                fontWeight: '500',
              }}
            >
              <Download style={{ marginRight: '0.75rem', width: '1.25rem', height: '1.25rem' }} />
              Export to CSV
            </motion.button>
          </div>

          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart2 style={{ marginRight: '0.75rem', width: '2rem', height: '2rem', color: '#3b82f6' }} />
            {mode === 'loan_default' ? 'Loan Default Dataset Dashboard' : 'Credit Risk Dataset Dashboard'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
            <div style={{ backgroundColor: theme === 'light' ? '#f3f4f6' : '#1f2937', padding: '1.5rem', borderRadius: '0.75rem', minHeight: '8rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Average Age</h3>
              <p style={{ fontSize: '1.5rem', color: '#3b82f6' }}>{stats.averageAge ? stats.averageAge.toFixed(2) : 'N/A'}</p>
            </div>
            <div style={{ backgroundColor: theme === 'light' ? '#f3f4f6' : '#1f2937', padding: '1.5rem', borderRadius: '0.75rem', minHeight: '8rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Average Income</h3>
              <p style={{ fontSize: '1.5rem', color: '#3b82f6' }}>Rs {stats.averageIncome ? stats.averageIncome.toFixed(2) : 'N/A'}</p>
            </div>
            <div style={{ backgroundColor: theme === 'light' ? '#f3f4f6' : '#1f2937', padding: '1.5rem', borderRadius: '0.75rem', minHeight: '8rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Average Loan Amount</h3>
              <p style={{ fontSize: '1.5rem', color: '#3b82f6' }}>Rs {stats.averageLoanAmount ? stats.averageLoanAmount.toFixed(2) : 'N/A'}</p>
            </div>
            <div style={{ backgroundColor: theme === 'light' ? '#f3f4f6' : '#1f2937', padding: '1.5rem', borderRadius: '0.75rem', minHeight: '8rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Default Rate</h3>
              <p style={{ fontSize: '1.5rem', color: '#3b82f6' }}>{stats.defaultRate ? stats.defaultRate.toFixed(2) : 'N/A'}%</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(22rem, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            <div style={{ height: '22rem', padding: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', textAlign: 'center' }}>
                <PieChart style={{ display: 'inline-block', marginRight: '0.75rem', verticalAlign: 'middle', color: '#3b82f6' }} />
                Default Distribution
              </h3>
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
            {mode === 'loan_default' && (
              <>
                <div style={{ height: '22rem', padding: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', textAlign: 'center' }}>
                    <BarChart2 style={{ display: 'inline-block', marginRight: '0.75rem', verticalAlign: 'middle', color: '#3b82f6' }} />
                    Education Distribution
                  </h3>
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
                <div style={{ height: '22rem', padding: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', textAlign: 'center' }}>
                    <BarChart2 style={{ display: 'inline-block', marginRight: '0.75rem', verticalAlign: 'middle', color: '#3b82f6' }} />
                    Loan Purpose Distribution
                  </h3>
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
                <div style={{ height: '22rem', padding: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', textAlign: 'center' }}>
                    <BarChart2 style={{ display: 'inline-block', marginRight: '0.75rem', verticalAlign: 'middle', color: '#3b82f6' }} />
                    Employment Type Distribution
                  </h3>
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
                <div style={{ height: '22rem', padding: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', textAlign: 'center' }}>
                    <BarChart2 style={{ display: 'inline-block', marginRight: '0.75rem', verticalAlign: 'middle', color: '#3b82f6' }} />
                    Marital Status Distribution
                  </h3>
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
                <div style={{ height: '22rem', padding: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', textAlign: 'center' }}>
                    <BarChart2 style={{ display: 'inline-block', marginRight: '0.75rem', verticalAlign: 'middle', color: '#3b82f6' }} />
                    DTI Ratio Distribution
                  </h3>
                  <ChartErrorBoundary>
                    <Bar
                      key={`dti-${chartKey}`}
                      data={generateBarChartData('DTI Ratio', stats.dtiDistribution, '#14b8a6')}
                      options={chartOptions}
                      ref={(el) => {
                        if (el) chartRefs.current['dti'] = el.chartInstance;
                      }}
                    />
                  </ChartErrorBoundary>
                </div>
              </>
            )}
            {mode === 'credit_risk' && (
              <>
                <div style={{ height: '22rem', padding: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', textAlign: 'center' }}>
                    <BarChart2 style={{ display: 'inline-block', marginRight: '0.75rem', verticalAlign: 'middle', color: '#3b82f6' }} />
                    Home Ownership Distribution
                  </h3>
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
                <div style={{ height: '22rem', padding: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', textAlign: 'center' }}>
                    <BarChart2 style={{ display: 'inline-block', marginRight: '0.75rem', verticalAlign: 'middle', color: '#3b82f6' }} />
                    Loan Intent Distribution
                  </h3>
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
                <div style={{ height: '22rem', padding: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', textAlign: 'center' }}>
                    <BarChart2 style={{ display: 'inline-block', marginRight: '0.75rem', verticalAlign: 'middle', color: '#3b82f6' }} />
                    Loan Grade Distribution
                  </h3>
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
                <div style={{ height: '22rem', padding: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', textAlign: 'center' }}>
                    <BarChart2 style={{ display: 'inline-block', marginRight: '0.75rem', verticalAlign: 'middle', color: '#3b82f6' }} />
                    Default on File Distribution
                  </h3>
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
                <div style={{ height: '22rem', padding: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', textAlign: 'center' }}>
                    <BarChart2 style={{ display: 'inline-block', marginRight: '0.75rem', verticalAlign: 'middle', color: '#3b82f6' }} />
                    Loan Percent Income Distribution
                  </h3>
                  <ChartErrorBoundary>
                    <Bar
                      key={`loanPercentIncome-${chartKey}`}
                      data={generateBarChartData('Loan Percent Income', stats.loanPercentIncomeDistribution, '#14b8a6')}
                      options={chartOptions}
                      ref={(el) => {
                        if (el) chartRefs.current['loanPercentIncome'] = el.chartInstance;
                      }}
                    />
                  </ChartErrorBoundary>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
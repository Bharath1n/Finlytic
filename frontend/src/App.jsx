import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PredictionForm from './components/PredictionForm';
import Dashboard from './components/Dashboard';
import Info from './components/Info';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-indigo-600">Loan Risk Evaluator</h1>
              <div className="space-x-4">
                <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition duration-300">Predict</Link>
                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium transition duration-300">Dashboard</Link>
                <Link to="/info" className="text-gray-600 hover:text-indigo-600 font-medium transition duration-300">Info</Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<PredictionForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/info" element={<Info />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
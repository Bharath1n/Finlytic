import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';

const fraudFeatures = {
  V1: -2.312227, V2: 1.951992, V3: -1.609851, V4: 3.997906, V5: -0.522188,
  V6: -1.426545, V7: -2.537387, V8: 1.391657, V9: -2.770089, V10: -2.772272,
  V11: 3.202033, V12: -2.899907, V13: -0.595222, V14: -4.289254, V15: 0.389724,
  V16: -1.140747, V17: -2.830056, V18: -0.016822, V19: 0.416956, V20: 0.126911,
  V21: 0.517232, V22: -0.035049, V23: -0.465211, V24: 0.320198, V25: 0.044519,
  V26: 0.177840, V27: 0.261145, V28: -0.143276
};

const nonFraudFeatures = {
  V1: -1.359807, V2: -0.072781, V3: 2.536347, V4: 1.378155, V5: -0.338321,
  V6: 0.462388, V7: 0.239599, V8: 0.098698, V9: 0.363787, V10: 0.090794,
  V11: -0.551600, V12: -0.617801, V13: -0.991390, V14: -0.311169, V15: 1.468177,
  V16: -0.470401, V17: 0.207971, V18: 0.025791, V19: 0.403993, V20: 0.251412,
  V21: -0.018307, V22: 0.277838, V23: -0.110474, V24: 0.066928, V25: 0.128539,
  V26: -0.189115, V27: 0.133558, V28: -0.021053
};

const schema = yup.object({
  Time: yup.number().min(0).max(172792, 'Time cannot exceed 172792').required('Time is required'),
  Amount: yup.number().min(0).max(500, 'Amount cannot exceed $500').required('Amount is required'),
}).required();

const backendUrl = import.meta.env.VITE_BACKEND_URL;
function FraudPredictionForm() {
  const { theme } = useTheme();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { Time: 406, Amount: 0 } // Default to fraud sample
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');
  const [useFraudSample, setUseFraudSample] = useState(true);

  const onSubmit = async (data) => {
    setError('');
    setPrediction(null);
    try {
      const features = useFraudSample ? fraudFeatures : nonFraudFeatures;
      const inputData = { ...features, Time: data.Time, Amount: data.Amount };
      console.log('Sending to /fraud/:', inputData);
      const response = await axios.post(`${backendUrl}/fraud/`, inputData);
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred.');
    }
  };

  return (
    <div className={`font-serif ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`rounded-lg shadow-lg p-6 max-w-sm mx-auto mt-8 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}
      >
        <h2 className="text-xl font-bold text-center mb-4 flex items-center justify-center">
          <CreditCard className="mr-2 w-5 h-5 text-blue-500" /> Fraud Detection
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Sample Type</label>
            <select
              value={useFraudSample ? 'fraud' : 'non-fraud'}
              onChange={(e) => setUseFraudSample(e.target.value === 'fraud')}
              className={`mt-1 w-full p-2 border rounded-md ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-gray-300'}`}
            >
              <option value="fraud">Fraud Sample</option>
              <option value="non-fraud">Non-Fraud Sample</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Time (seconds)</label>
            <input
              type="number"
              {...register('Time')}
              className={`mt-1 w-full p-2 border rounded-md ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-gray-300'} ${errors.Time ? 'border-red-500' : ''}`}
            />
            {errors.Time && <p className="text-red-500 text-xs mt-1">{errors.Time.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              {...register('Amount')}
              className={`mt-1 w-full p-2 border rounded-md ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-gray-300'} ${errors.Amount ? 'border-red-500' : ''}`}
            />
            {errors.Amount && <p className="text-red-500 text-xs mt-1">{errors.Amount.message}</p>}
          </div>
          <p className="text-xs text-gray-500">V1-V28 are preset to {useFraudSample ? 'fraud' : 'non-fraud'} values.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Predicting...' : 'Predict'}
          </motion.button>
        </form>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-2 bg-red-100 text-red-700 text-center rounded-md"
          >
            {error}
          </motion.div>
        )}
        {prediction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-4 p-4 rounded-md text-center ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}
          >
            <h3 className="text-md font-semibold">Result</h3>
            <p>Fraud Prediction: {prediction.fraud_prediction}</p>
            <p>Fraud Probability: {(prediction.fraud_probability * 100).toFixed(2)}%</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default FraudPredictionForm;
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';
import { InfoIcon, CreditCard, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Info = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen font-serif ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
      {/* Info Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="py-24 px-8 pt-12"
      >
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center tracking-tight flex items-center justify-center"
        >
          <InfoIcon className="mr-2 w-8 h-8 text-blue-500" /> ABOUT FIN-LYTIC
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-8 mt-8"
        >
          <div className={`rounded-2xl shadow-lg p-8 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-shadow`}>
            <div className={`space-y-8 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
              {/* Loan Default Prediction Section */}
              <section>
                <h3 className="text-2xl font-semibold mb-4 flex items-center">
                  <CreditCard className="mr-2 w-6 h-6 text-blue-500" /> Loan Default Prediction
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold">Model Overview</h4>
                    <p>
                      The Loan Default Prediction model uses a Random Forest Classifier trained on a dataset of loan applications. It predicts whether a borrower is likely to default based on 16 features, including personal, financial, and loan-related attributes.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Key Features</h4>
                    <ul className="list-disc pl-5">
                      <li><strong>Age:</strong> Borrower's age (18–69).</li>
                      <li><strong>Income:</strong> Annual income in Rs.</li>
                      <li><strong>Credit Score:</strong> Credit score (300–850).</li>
                      <li><strong>Loan Purpose:</strong> Purpose of the loan (e.g., Auto, Business, Home).</li>
                      <li><strong>DTI Ratio:</strong> Debt-to-Income ratio (0–1).</li>
                      <li><strong>Education:</strong> Educational attainment (High School, Bachelor's, Master's, PhD).</li>
                      <li><strong>Employment Type:</strong> Full-time, Part-time, Self-employed, or Unemployed.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Interpreting Predictions</h4>
                    <p>
                      - <strong>Prediction:</strong> 0 (Not Likely to Default) or 1 (Likely to Default).<br />
                      - <strong>Probability:</strong> The likelihood of default (0–100%). A higher probability indicates a greater risk of default.
                    </p>
                  </div>
                </div>
              </section>

              {/* Credit Risk Assessment Section */}
              <section>
                <h3 className="text-2xl font-semibold mb-4 flex items-center">
                  <Shield className="mr-2 w-6 h-6 text-blue-500" /> Credit Risk Assessment
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold">Model Overview</h4>
                    <p>
                      The Credit Risk Assessment model uses a Random Forest Classifier trained on a dataset of loan applications. It evaluates the risk of loan default based on 11 features, focusing on borrower demographics, loan characteristics, and credit history.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Key Features</h4>
                    <ul className="list-disc pl-5">
                      <li><strong>Age:</strong> Borrower's age (18–100).</li>
                      <li><strong>Income:</strong> Annual income in Rs.</li>
                      <li><strong>Home Ownership:</strong> Rent, Own, Mortgage, or Other.</li>
                      <li><strong>Loan Intent:</strong> Purpose of the loan (e.g., Personal, Education, Medical).</li>
                      <li><strong>Loan Grade:</strong> Loan quality rating (A to G).</li>
                      <li><strong>Default on File:</strong> Whether the borrower has a prior default (Yes/No).</li>
                      <li><strong>Credit History Length:</strong> Duration of credit history in years.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Interpreting Predictions</h4>
                    <p>
                      - <strong>Risk Category:</strong> Low Risk (probability &lt; 30%), Medium Risk (probability 30%–70%), High Risk (probability &gt; 70%).<br />
                      - <strong>Probability:</strong> The likelihood of default (0–100%). A higher probability indicates a higher risk of default.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Info;
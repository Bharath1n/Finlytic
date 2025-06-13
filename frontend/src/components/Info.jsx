import React from 'react';

const Info = () => {
  return (
    <div className="bg-white rounded-xl shadow-xl p-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">About Financial Risk Prediction Models</h2>
      <div className="space-y-8 text-gray-600">
        {/* Loan Default Prediction Section */}
        <section>
          <h3 className="text-2xl font-semibold text-indigo-500 mb-4">Loan Default Prediction</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-700">Model Overview</h4>
              <p>
                The Loan Default Prediction model uses a Random Forest Classifier trained on a dataset of loan applications. It predicts whether a borrower is likely to default based on 16 features, including personal, financial, and loan-related attributes.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-700">Key Features</h4>
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
              <h4 className="text-lg font-semibold text-gray-700">Interpreting Predictions</h4>
              <p>
                - <strong>Prediction:</strong> 0 (Not Likely to Default) or 1 (Likely to Default).<br />
                - <strong>Probability:</strong> The likelihood of default (0–100%). A higher probability indicates a greater risk of default.
              </p>
            </div>
          </div>
        </section>

        {/* Credit Risk Assessment Section */}
        <section>
          <h3 className="text-2xl font-semibold text-indigo-500 mb-4">Credit Risk Assessment</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-700">Model Overview</h4>
              <p>
                The Credit Risk Assessment model uses a Random Forest Classifier trained on a dataset of loan applications. It evaluates the risk of loan default based on 11 features, focusing on borrower demographics, loan characteristics, and credit history.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-700">Key Features</h4>
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
              <h4 className="text-lg font-semibold text-gray-700">Interpreting Predictions</h4>
              <p>
                - <strong>Risk Category:</strong> Low Risk (probability lesser than 30%), Medium Risk (probability between 30% and 70%), High Risk (probability greater than 70%).
              <br />
                - <strong>Probability:</strong> The likelihood of default (0–100%). A higher probability indicates a higher risk of default.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Info;
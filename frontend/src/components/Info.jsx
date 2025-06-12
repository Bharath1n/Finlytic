import React from 'react';

const Info = () => {
  return (
    <div className="bg-white rounded-xl shadow-xl p-8 animate-fade-in">
      <div className="">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">About Loan Default Prediction</h2>
      <div className="space-y-6 text-gray-600">
        <section>
          <h3 className="text-xl font-semibold text-indigo-500">Model Overview</h3>
          <p>
            The prediction model uses a Random Forest Classifier trained on a dataset of loan applications.
            It predicts whether a borrower is likely to default based on 16 features, including income, credit score, and loan purpose.
          </p>
        </section>
        <section>
          <h3 className="text-xl font-semibold text-indigo-500">Key Features</h3>
          <ul className="list-disc pl-5">
            <li><strong>Age:</strong> Borrower's age (18–69).</li>
            <li><strong>Income:</strong> Annual income in Rs.</li>
            <li><strong>Credit Score:</strong> Credit score (300–850).</li>
            <li><strong>Loan Purpose:</strong> Purpose of the loan (e.g., Auto, Business, Home).</li>
            <li><strong>DTI Ratio:</strong> Debt-to-Income ratio (0–1).</li>
          </ul>
        </section>
        <section>
          <h3 className="text-xl font-semibold text-indigo-500">Interpreting Predictions</h3>
          <p>
            - <strong>Prediction:</strong> 0 (Not Likely to Default) or 1 (Likely to Default).
            <br />
            - <strong>Probability:</strong> The likelihood of default (0–100%). A higher probability indicates higher risk.
          </p>
        </section>
      </div>
    </div>
    </div>
  );
};

export default Info;
BEGIN TRANSACTION;
CREATE TABLE chat_messages (
	id INTEGER NOT NULL, 
	session_id VARCHAR NOT NULL, 
	user_id VARCHAR, 
	mode VARCHAR NOT NULL, 
	role VARCHAR NOT NULL, 
	content TEXT NOT NULL, 
	created_at TIMESTAMP, 
	PRIMARY KEY (id)
);
INSERT INTO "chat_messages" VALUES(1,'1b0d9918-f492-4fc5-9f92-d9b4eb5b1a98',NULL,'loan_prediction','user','Explain default risk','2025-06-21 21:33:02.970162');
INSERT INTO "chat_messages" VALUES(2,'1b0d9918-f492-4fc5-9f92-d9b4eb5b1a98',NULL,'loan_prediction','assistant','## Default Risk Explained

**Default risk** is the risk that a borrower will be unable to make the required payments on their debt obligations. This means they may fail to repay the **principal** or **interest** of a loan.

*   **Impact:** Default risk affects lenders, investors, and the overall economy.
*   **Assessment:** Lenders assess default risk using factors like credit history, income, and assets.
*   **Mitigation:** Lenders may charge higher interest rates to compensate for higher default risk.','2025-06-21 21:33:05.571943');
INSERT INTO "chat_messages" VALUES(3,'1b0d9918-f492-4fc5-9f92-d9b4eb5b1a98',NULL,'credit_risk','user','What is High Risk?','2025-06-21 21:33:20.993821');
INSERT INTO "chat_messages" VALUES(4,'1b0d9918-f492-4fc5-9f92-d9b4eb5b1a98',NULL,'credit_risk','assistant','I''m a financial assistant and can help with questions about budgeting, credit scores, and loans. Could you please clarify if you''re asking about high-risk investments or high-risk loans? If not, perhaps I can help with a different financial topic.','2025-06-21 21:33:21.898342');
INSERT INTO "chat_messages" VALUES(5,'1b0d9918-f492-4fc5-9f92-d9b4eb5b1a98',NULL,'credit_risk','user','What is High Risk?','2025-06-21 21:33:37.723222');
INSERT INTO "chat_messages" VALUES(6,'1b0d9918-f492-4fc5-9f92-d9b4eb5b1a98',NULL,'credit_risk','assistant','I''m an AI Financial Assistant. My expertise is in areas like **budgeting**, **credit scores**, and **loans**. I can provide guidance on these topics. Perhaps I can help you understand the risk associated with investments or loans?','2025-06-21 21:33:38.626315');
INSERT INTO "chat_messages" VALUES(7,'1b0d9918-f492-4fc5-9f92-d9b4eb5b1a98',NULL,'credit_risk','user','loans','2025-06-21 21:33:55.725807');
INSERT INTO "chat_messages" VALUES(8,'1b0d9918-f492-4fc5-9f92-d9b4eb5b1a98',NULL,'credit_risk','assistant','## Loan Basics Explained

**Loans** are essentially borrowed funds that you agree to repay over a specific period, typically with added **interest**.

Here''s a quick breakdown:

*   You receive a sum of money (**principal**) from a lender.
*   You make regular payments (monthly, quarterly, etc.) that include both the principal and **interest**.
*   The **interest rate** is the cost of borrowing the money, expressed as a percentage.
*   The **loan term** is the length of time you have to repay the loan.','2025-06-21 21:33:56.933932');
INSERT INTO "chat_messages" VALUES(9,'ec492e92-b590-43ec-ae0f-f625a83277cd',NULL,'general','user','What is a credit score?','2025-07-03 20:10:37.968872');
INSERT INTO "chat_messages" VALUES(10,'ec492e92-b590-43ec-ae0f-f625a83277cd',NULL,'general','assistant','## Credit Score Explained

A **credit score** is a numerical representation of your creditworthiness. It is a number typically ranging from 300 to 850. This score helps lenders assess the risk associated with lending you money. A higher score generally indicates a lower risk.','2025-07-03 20:10:39.214124');
INSERT INTO "chat_messages" VALUES(11,'ec492e92-b590-43ec-ae0f-f625a83277cd',NULL,'general','user','How to budget?','2025-07-03 20:10:43.645019');
INSERT INTO "chat_messages" VALUES(12,'ec492e92-b590-43ec-ae0f-f625a83277cd',NULL,'general','assistant','## Budgeting Basics

Budgeting is a crucial tool for managing your finances effectively. Here''s a simple approach:

*   **Track your income:** Determine all sources of your income (salary, investments, etc.).
*   **Track your expenses:** Monitor where your money goes. Use budgeting apps, spreadsheets, or notebooks.
*   **Categorize expenses:** Group expenses into categories like housing, food, transportation, entertainment.
*   **Create a plan:** Allocate funds to each category, ensuring essential needs are covered first.
*   **Review and adjust:** Regularly review your budget and make adjustments as needed to stay on track.','2025-07-03 20:10:45.254659');
INSERT INTO "chat_messages" VALUES(13,'ec492e92-b590-43ec-ae0f-f625a83277cd',NULL,'general','user','Explain loans','2025-07-03 20:10:50.703375');
INSERT INTO "chat_messages" VALUES(14,'ec492e92-b590-43ec-ae0f-f625a83277cd',NULL,'general','assistant','## Loan Basics Explained

**Loans** are borrowed funds that you agree to repay over a specified period, along with **interest**. Here''s a breakdown:

*   **Principal:** The original amount of money borrowed.
*   **Interest:** The cost of borrowing the money, expressed as a percentage (**interest rate**).
*   **Repayment Schedule:** The agreed-upon timeline for repaying the loan, including the frequency (e.g., monthly) and amount of payments.
*   **Loan Term:** The total length of time you have to repay the loan.','2025-07-03 20:10:56.724344');
INSERT INTO "chat_messages" VALUES(15,'ec492e92-b590-43ec-ae0f-f625a83277cd',NULL,'general','user','how to do savings','2025-07-03 20:11:10.748577');
INSERT INTO "chat_messages" VALUES(16,'ec492e92-b590-43ec-ae0f-f625a83277cd',NULL,'general','assistant','## Saving Money: A Quick Guide

Saving money is all about spending less than you earn and putting the difference aside for future use. Here''s a simple approach:

*   **Track Your Spending:** Understand where your money is going each month. Use a budgeting app, spreadsheet, or even a notebook.
*   **Create a Budget:** Plan your spending. Allocate funds for essential expenses (housing, food, transportation), debt repayment, and savings.
*   **Set Savings Goals:** Define what you''re saving *for* (emergency fund, down payment, retirement). This provides motivation.
*   **Automate Savings:** Set up automatic transfers from your checking account to your savings account regularly.
*   **Reduce Expenses:** Identify areas where you can cut back on spending. Even small changes can add up over time.
*   **Increase Income:** Explore opportunities to earn more money, such as a side hustle or asking for a raise.','2025-07-03 20:11:12.730974');
INSERT INTO "chat_messages" VALUES(17,'ef2196c6-3218-4120-ae29-899124441b0f',NULL,'general','user','Explain loans','2025-07-03 20:51:53.633395');
INSERT INTO "chat_messages" VALUES(18,'ef2196c6-3218-4120-ae29-899124441b0f',NULL,'general','assistant','## Loan Basics Explained

**Loans** are essentially borrowed funds that you agree to repay over a specific period, usually with added **interest**.

Here''s a breakdown:

*   You receive an initial sum of money (**principal**).
*   You make regular payments (**installments**) over a set timeframe (**loan term**).
*   Each payment covers a portion of the **principal** and the **interest**.
*   **Interest** is the cost of borrowing the money, expressed as an annual percentage rate (**APR**).','2025-07-03 20:51:56.299185');
INSERT INTO "chat_messages" VALUES(19,'ef2196c6-3218-4120-ae29-899124441b0f',NULL,'general','user','how to do savings','2025-07-03 20:52:04.024762');
INSERT INTO "chat_messages" VALUES(20,'ef2196c6-3218-4120-ae29-899124441b0f',NULL,'general','assistant','## Savings Strategies

Here''s how to improve your savings:

*   **Budgeting:** Track your income and expenses to identify areas where you can cut back.
*   **Set Goals:** Determine specific savings targets (e.g., emergency fund, down payment).
*   **Automate Savings:** Schedule automatic transfers from your checking account to a savings account.
*   **Reduce Expenses:** Look for ways to lower your bills (e.g., negotiate insurance rates, cut subscriptions).
*   **Increase Income:** Explore opportunities to earn extra money (e.g., freelance work, selling unused items).','2025-07-03 20:52:05.423892');
INSERT INTO "chat_messages" VALUES(21,'ef2196c6-3218-4120-ae29-899124441b0f',NULL,'general','user','how do i start investing and where','2025-07-03 20:52:30.850401');
INSERT INTO "chat_messages" VALUES(22,'ef2196c6-3218-4120-ae29-899124441b0f',NULL,'general','assistant','Investing involves risk, and it''s important to understand your risk tolerance before starting. This is general information, not financial advice.

## Starting to Invest

Here''s a basic guide to getting started with investing:

*   **Determine Your Risk Tolerance:** Are you comfortable with the possibility of losing money in exchange for higher potential returns, or do you prefer safer, lower-return investments?
*   **Set Financial Goals:** What are you saving for? (e.g., retirement, down payment on a house). This will influence your investment timeline and strategy.
*   **Choose an Investment Account:** Options include:
    *   **Brokerage Accounts:** Allow you to buy and sell stocks, bonds, mutual funds, and ETFs.
    *   **Retirement Accounts:** (e.g., 401(k), IRA) Offer tax advantages for retirement savings.
*   **Research Investment Options:**
    *   **Stocks:** Represent ownership in a company. Higher risk, higher potential reward.
    *   **Bonds:** Loans to a government or corporation. Lower risk, lower potential reward.
    *   **Mutual Funds:** Pools of money invested in a diversified portfolio of stocks, bonds, or other assets.
    *   **Exchange-Traded Funds (ETFs):** Similar to mutual funds but trade like stocks.
*   **Start Small:** You don''t need a lot of money to begin. Many brokers allow you to buy fractional shares of stocks.
*   **Invest Regularly:** Consider setting up automatic investments to take advantage of dollar-cost averaging.

## Where to Invest

Consider these platforms:

*   **Online Brokers:** (e.g., Fidelity, Charles Schwab, Vanguard, Robinhood) Offer low-cost trading and a wide range of investment options.
*   **Robo-Advisors:** (e.g., Betterment, Wealthfront) Provide automated investment management based on your risk tolerance and financial goals.
*   **Financial Advisors:** Offer personalized advice and investment management services. (Fees may apply.)

Remember to do your research and choose a platform that aligns with your needs and investment goals. Consult with a financial professional for personalized advice.','2025-07-03 20:52:34.036849');
CREATE TABLE credit_risk_stats (
	id INTEGER NOT NULL, 
	"averageAge" FLOAT NOT NULL, 
	"averageIncome" FLOAT NOT NULL, 
	"averageLoanAmount" FLOAT NOT NULL, 
	"defaultRate" FLOAT NOT NULL, 
	"defaultDistribution" TEXT NOT NULL, 
	"homeOwnershipDistribution" TEXT NOT NULL, 
	"loanIntentDistribution" TEXT NOT NULL, 
	"loanGradeDistribution" TEXT NOT NULL, 
	"defaultOnFileDistribution" TEXT NOT NULL, 
	"loanPercentIncomeDistribution" TEXT NOT NULL, 
	PRIMARY KEY (id)
);
INSERT INTO "credit_risk_stats" VALUES(1,40.2,82000.0,18000.0,10.8,'{"Non-Defaulted": 892, "Defaulted": 108}','{"Own": 400, "Rent": 400, "Mortgage": 200}','{"Debt Consolidation": 500, "Home Improvement": 300, "Medical": 200}','{"A": 300, "B": 400, "C": 200, "D": 100}','{"No": 900, "Yes": 100}','{"0-0.2": 600, "0.2-0.4": 300, "0.4-0.6": 100, "0.6-0.8": 0, "0.8-1.0": 0}');
CREATE TABLE loan_default_stats (
	id INTEGER NOT NULL, 
	"averageAge" FLOAT NOT NULL, 
	"averageIncome" FLOAT NOT NULL, 
	"averageLoanAmount" FLOAT NOT NULL, 
	"defaultRate" FLOAT NOT NULL, 
	"defaultDistribution" TEXT NOT NULL, 
	"educationDistribution" TEXT NOT NULL, 
	"loanPurposeDistribution" TEXT NOT NULL, 
	"employmentTypeDistribution" TEXT NOT NULL, 
	"maritalStatusDistribution" TEXT NOT NULL, 
	"dtiDistribution" TEXT NOT NULL, 
	PRIMARY KEY (id)
);
INSERT INTO "loan_default_stats" VALUES(1,35.5,75000.0,15000.0,12.5,'{"Non-Defaulted": 875, "Defaulted": 125}','{"High School": 300, "Bachelor": 400, "Master": 200, "PhD": 100}','{"Home": 400, "Car": 300, "Personal": 200, "Education": 100}','{"Full-Time": 600, "Part-Time": 200, "Self-Employed": 100, "Unemployed": 100}','{"Single": 500, "Married": 400, "Divorced": 100}','{"0-0.2": 600, "0.2-0.4": 300, "0.4-0.6": 100, "0.6-0.8": 0, "0.8-1.0": 0}');
CREATE TABLE predictions (
	id INTEGER NOT NULL, 
	user_id VARCHAR, 
	model_type VARCHAR NOT NULL, 
	input_data TEXT NOT NULL, 
	prediction VARCHAR NOT NULL, 
	probability FLOAT NOT NULL, 
	created_at TIMESTAMP, 
	PRIMARY KEY (id)
);
CREATE INDEX ix_predictions_id ON predictions (id);
CREATE INDEX ix_predictions_user_id ON predictions (user_id);
CREATE INDEX ix_chat_messages_session_id ON chat_messages (session_id);
CREATE INDEX ix_chat_messages_id ON chat_messages (id);
CREATE INDEX ix_chat_messages_user_id ON chat_messages (user_id);
CREATE INDEX ix_loan_default_stats_id ON loan_default_stats (id);
CREATE INDEX ix_credit_risk_stats_id ON credit_risk_stats (id);
COMMIT;

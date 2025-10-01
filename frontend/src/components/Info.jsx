import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';
import { InfoIcon, CreditCard, Shield, Brain, TrendingUp, BarChart3, Zap, Target, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Info = () => {
  const { theme } = useTheme();

  // Floating Elements Component
  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
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
            repeatType: 'reverse',
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );

  // Gradient Orb Component
  const GradientOrb = ({ delay = 0, scale = 1, color = "blue", position = "top-left" }) => {
    const positionClasses = {
      "top-left": "top-0 left-0",
      "top-right": "top-0 right-0", 
      "bottom-left": "bottom-0 left-0",
      "bottom-right": "bottom-0 right-0",
      "center": "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    };

    return (
      <motion.div
        className={`absolute w-96 h-96 rounded-full opacity-20 blur-3xl ${positionClasses[position]} ${
          color === "blue" ? "bg-blue-500" : 
          color === "purple" ? "bg-purple-500" : 
          color === "pink" ? "bg-pink-500" :
          "bg-green-500"
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
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const modelStats = [
    { icon: Brain, label: "ML Models", value: "2", color: "text-blue-500" },
    { icon: Target, label: "Accuracy", value: "85%", color: "text-green-500" },
    { icon: Users, label: "Features", value: "27", color: "text-purple-500" },
    { icon: Award, label: "Predictions", value: "1M+", color: "text-orange-500" }
  ];

  return (
    <div className={`min-h-screen font-display relative overflow-hidden ${theme === 'light' ? 'bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900' : 'bg-gradient-to-br from-gray-900 via-black to-blue-900 text-gray-100'}`}>
      {/* Background Elements */}
      <FloatingElements />
      <GradientOrb delay={0} scale={0.8} color="blue" position="top-left" />
      <GradientOrb delay={2} scale={0.6} color="purple" position="top-right" />
      <GradientOrb delay={4} scale={0.9} color="pink" position="bottom-left" />
      <GradientOrb delay={1} scale={0.7} color="green" position="bottom-right" />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="pt-20 pb-12 px-8"
        >
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-6">
                <InfoIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                About FIN-LYTIC
              </h1>
              <p className={`text-xl mt-4 max-w-3xl mx-auto ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                Advanced AI-powered financial risk assessment platform delivering precise predictions and comprehensive analytics
              </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            >
              {modelStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={fadeInUp}
                  className={`p-6 rounded-2xl ${theme === 'light' ? 'bg-white/70 backdrop-blur-sm' : 'bg-gray-800/70 backdrop-blur-sm'} 
                    border ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'} 
                    hover:shadow-xl hover:scale-105 transition-all duration-300`}
                >
                  <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Models Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="px-8 pb-16"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Loan Default Prediction Card */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className={`rounded-3xl p-8 ${theme === 'light' ? 'bg-white/80 backdrop-blur-sm' : 'bg-gray-800/80 backdrop-blur-sm'} 
                  border ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}
                  hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all duration-500 hover:scale-[1.02]`}
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 mr-4">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Loan Default Prediction</h3>
                </div>

                <div className="space-y-6">
                  <div className={`p-4 rounded-xl ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20'} border ${theme === 'light' ? 'border-blue-200' : 'border-blue-800'}`}>
                    <h4 className="text-lg font-semibold mb-2 flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-blue-500" />
                      Model Overview
                    </h4>
                    <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} leading-relaxed`}>
                      Advanced Random Forest Classifier leveraging 16 comprehensive features to predict loan default probability with 85% accuracy.
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl ${theme === 'light' ? 'bg-green-50' : 'bg-green-900/20'} border ${theme === 'light' ? 'border-green-200' : 'border-green-800'}`}>
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
                      Key Features
                    </h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {[
                        { label: "Age", range: "18–69" },
                        { label: "Income", range: "Annual Rs." },
                        { label: "Credit Score", range: "300–850" },
                        { label: "Loan Purpose", range: "Auto, Business, Home" },
                        { label: "DTI Ratio", range: "0–1" },
                        { label: "Education", range: "HS to PhD" },
                        { label: "Employment", range: "Full/Part/Self" }
                      ].map((feature, idx) => (
                        <div key={idx} className="flex justify-between items-center py-1">
                          <span className="font-medium">{feature.label}:</span>
                          <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{feature.range}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl ${theme === 'light' ? 'bg-purple-50' : 'bg-purple-900/20'} border ${theme === 'light' ? 'border-purple-200' : 'border-purple-800'}`}>
                    <h4 className="text-lg font-semibold mb-2 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
                      Prediction Output
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span><strong>0:</strong> Not Likely to Default</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span><strong>1:</strong> Likely to Default</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span><strong>Probability:</strong> Risk percentage (0–100%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Credit Risk Assessment Card */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className={`rounded-3xl p-8 ${theme === 'light' ? 'bg-white/80 backdrop-blur-sm' : 'bg-gray-800/80 backdrop-blur-sm'} 
                  border ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}
                  hover:shadow-[0_0_40px_rgba(147,51,234,0.3)] transition-all duration-500 hover:scale-[1.02]`}
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 mr-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Credit Risk Assessment</h3>
                </div>

                <div className="space-y-6">
                  <div className={`p-4 rounded-xl ${theme === 'light' ? 'bg-purple-50' : 'bg-purple-900/20'} border ${theme === 'light' ? 'border-purple-200' : 'border-purple-800'}`}>
                    <h4 className="text-lg font-semibold mb-2 flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-purple-500" />
                      Model Overview
                    </h4>
                    <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} leading-relaxed`}>
                      Sophisticated Random Forest Classifier analyzing 11 critical features to evaluate comprehensive credit risk profiles.
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl ${theme === 'light' ? 'bg-pink-50' : 'bg-pink-900/20'} border ${theme === 'light' ? 'border-pink-200' : 'border-pink-800'}`}>
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-pink-500" />
                      Key Features
                    </h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {[
                        { label: "Age", range: "18–100" },
                        { label: "Income", range: "Annual Rs." },
                        { label: "Home Ownership", range: "Rent/Own/Mortgage" },
                        { label: "Loan Intent", range: "Personal/Education/Medical" },
                        { label: "Loan Grade", range: "A to G" },
                        { label: "Default History", range: "Yes/No" },
                        { label: "Credit History", range: "Years" }
                      ].map((feature, idx) => (
                        <div key={idx} className="flex justify-between items-center py-1">
                          <span className="font-medium">{feature.label}:</span>
                          <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{feature.range}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl ${theme === 'light' ? 'bg-orange-50' : 'bg-orange-900/20'} border ${theme === 'light' ? 'border-orange-200' : 'border-orange-800'}`}>
                    <h4 className="text-lg font-semibold mb-2 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-orange-500" />
                      Risk Categories
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span><strong>Low Risk:</strong> Probability &lt; 30%</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <span><strong>Medium Risk:</strong> Probability 30%–70%</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span><strong>High Risk:</strong> Probability &gt; 70%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Technology Stack Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="px-8 pb-20"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className={`rounded-3xl p-8 ${theme === 'light' ? 'bg-white/80 backdrop-blur-sm' : 'bg-gray-800/80 backdrop-blur-sm'} 
                border ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}
                hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all duration-500`}
            >
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 mr-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Powered by Advanced AI</h3>
              </div>
              
              <p className={`text-lg mb-6 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Built with cutting-edge machine learning algorithms and modern web technologies to deliver fast, accurate, and reliable financial predictions.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                {['Python', 'Scikit-learn', 'Random Forest', 'React', 'TailwindCSS', 'Framer Motion'].map((tech, index) => (
                  <span
                    key={tech}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      theme === 'light' 
                        ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200' 
                        : 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 text-blue-300 border border-blue-700'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Info;
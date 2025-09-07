// Home.jsx
import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CreditCard, Shield, Bot, TrendingUp, Zap, Star, ArrowRight, Play, Users, Award, DollarSign } from 'lucide-react';
import { useTheme } from './ThemeContext';

const Homepage = () => {
  const { theme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      x.set(e.clientX / window.innerWidth - 0.5);
      y.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  const FloatingElements = () => (
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
            repeatType: 'reverse',
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );

  const GradientOrb = ({ delay = 0, scale = 1, color = 'blue' }) => (
    <motion.div
      className={`absolute w-96 h-96 rounded-full opacity-20 blur-3xl ${
        color === 'blue' ? 'bg-blue-500' : color === 'purple' ? 'bg-purple-500' : 'bg-pink-500'
      }`}
      animate={{ scale: [scale, scale * 1.2, scale], opacity: [0.1, 0.3, 0.1] }}
      transition={{ duration: 8, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );

  return (
    <div className={`relative ${theme === 'light' ? 'bg-gradient-to-br from-gray-50 via-white to-blue-50 text-black' : 'bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white'}`}>
      <FloatingElements />
      <GradientOrb delay={0} scale={1} color="blue" />
      <GradientOrb delay={2} scale={0.8} color="red" />
      <GradientOrb delay={4} scale={0.6} color="white" />

      <motion.section
        className="min-h-screen flex flex-col items-center justify-center text-center px-8 relative z-10 mt-0 pt-0"
        style={{ y: y1, opacity }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8"
        >
          <div className={`w-32 h-32 mx-auto rounded-full ${theme === 'light' ? 'bg-gradient-to-r from-blue-100 to-purple-100' : 'bg-gradient-to-r from-blue-900 to-purple-900'} flex items-center justify-center mb-8 relative`}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-2 border-2 border-dashed border-blue-400 rounded-full"
            />
            <TrendingUp className="w-12 h-12 text-blue-500" />
          </div>
        </motion.div>
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-5xl md:text-8xl font-black tracking-tight mb-6"
        >
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            FIN-LYTIC
          </span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="space-y-4 mb-12"
        >
          <p className={`text-xl md:text-2xl ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} max-w-3xl leading-relaxed`}>
            Revolutionary AI-powered financial intelligence platform
          </p>
          <p className={`text-lg ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} max-w-2xl`}>
            Predict. Analyze. Optimize. Your financial future starts here.
          </p>
        </motion.div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-6 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl shadow-blue-500/25 relative overflow-hidden"
          >
            <Link to="/dashboard" className="flex items-center relative z-10">
              <Play className="mr-2 w-5 h-5" />
              Launch Dashboard
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              whileHover={{ scale: 1.1 }}
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`px-8 py-4 rounded-2xl text-lg font-semibold border-2 backdrop-blur-sm transition-all duration-300 ${
              theme === 'light'
                ? 'border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'
                : 'border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-900/20'
            }`}
          >
            Watch Demo
          </motion.button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl"
        >
          {[
            { icon: Users, value: '10K+', label: 'Active Users' },
            { icon: Award, value: '99.9%', label: 'Accuracy' },
            { icon: DollarSign, value: '$50M+', label: 'Analyzed' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              className={`${theme === 'light' ? 'bg-white/40' : 'bg-black/40'} backdrop-blur-lg rounded-2xl p-6 border ${theme === 'light' ? 'border-white/20' : 'border-white/10'}`}
            >
              <stat.icon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <section id="features" className={`py-32 px-8 relative ${theme === 'light' ? 'bg-gradient-to-r from-blue-50 to-purple-50' : 'bg-gradient-to-r from-blue-900/20 to-purple-900/20'}`}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-20">
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Powerful Solutions
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className={`text-xl ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} max-w-3xl mx-auto`}
            >
              Advanced AI algorithms designed to revolutionize your financial decision-making process
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Loan Default Prediction',
                desc: 'Advanced ML models predict loan defaults with 99.9% accuracy using comprehensive risk analysis',
                icon: CreditCard,
                gradient: 'from-blue-500 to-cyan-400',
                delay: 0.2,
              },
              {
                title: 'Credit Risk Analysis',
                desc: 'Real-time credit risk assessment with instant scoring and detailed risk breakdown reports',
                icon: Shield,
                gradient: 'from-purple-500 to-pink-400',
                delay: 0.4,
              },
              {
                title: 'AI Financial Assistant',
                desc: 'Intelligent chatbot providing personalized financial guidance and instant expert consultation',
                icon: Bot,
                gradient: 'from-pink-500 to-red-400',
                delay: 0.6,
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: feature.delay, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`group ${theme === 'light' ? 'bg-white/60' : 'bg-black/40'} backdrop-blur-lg border ${theme === 'light' ? 'border-white/30' : 'border-white/10'} rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden`}
              >
                <motion.div
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                />
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-500 transition-colors">{feature.title}</h3>
                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} leading-relaxed mb-6`}>{feature.desc}</p>
                <motion.div
                  className="flex items-center text-blue-500 font-semibold group-hover:translate-x-2 transition-transform duration-300"
                  whileHover={{ x: 5 }}
                >
                  <Link to={feature.title === 'Loan Default Prediction' ? '/loan' : feature.title === 'Credit Risk Analysis' ? '/credit-risk' : '/chatbot'}>
                    Learn More <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="demo" className={`py-32 px-8 ${theme === 'light' ? 'bg-gradient-to-l from-gray-50 to-blue-50' : 'bg-gradient-to-l from-gray-900 to-blue-900'} relative overflow-hidden`}>
        <motion.div style={{ y: y2 }} className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-8"
          >
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              See It In Action
            </span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className={`${theme === 'light' ? 'bg-white/60' : 'bg-black/40'} backdrop-blur-lg rounded-3xl p-12 border ${theme === 'light' ? 'border-white/30' : 'border-white/10'} shadow-2xl`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-left">
                <h3 className="text-3xl font-bold">Real-Time Analytics</h3>
                <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  Experience the power of our AI-driven platform with live data visualization and instant insights.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
                >
                  Try Interactive Demo
                </motion.button>
              </div>
              <motion.div
                className={`${theme === 'light' ? 'bg-gradient-to-br from-blue-100 to-purple-100' : 'bg-gradient-to-br from-blue-900 to-purple-900'} rounded-2xl p-8 relative`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className={`h-4 ${theme === 'light' ? 'bg-white/50' : 'bg-white/20'} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.random() * 60 + 40}%` }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                    />
                  ))}
                </div>
                <motion.div
                  className="absolute top-4 right-4 w-8 h-8 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className={`py-32 px-8 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-800 to-purple-800'} text-white relative overflow-hidden`}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-8"
          >
            Ready to Transform Your Financial Future?
          </motion.h2>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-xl mb-12 text-blue-100"
          >
            Join thousands of users who trust FIN-LYTIC for their financial intelligence needs
          </motion.p>
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white text-purple-600 px-8 py-4 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center"
            >
              <Link to="/dashboard" className="flex items-center">
                Get Started Free
                <Zap className="ml-2 w-5 h-5" />
              </Link>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Schedule Demo
            </motion.button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Homepage;
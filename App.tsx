import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, BarChart3, Search } from 'lucide-react';
import Aurora from './components/Aurora';
import Footer from './components/Footer';
import SortApp from './SortApp';
import SearchApp from './SearchApp';

type Route = 'home' | 'sorting' | 'searching';

const App: React.FC = () => {
  const [route, setRoute] = useState<Route>('home');

  // Hash-based routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') as Route;
      if (hash === 'sorting' || hash === 'searching') {
        setRoute(hash);
      } else {
        setRoute('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigate = (to: Route) => {
    window.location.hash = to === 'home' ? '' : to;
    setRoute(to);
  };

  if (route === 'sorting') {
    return <SortApp onBack={() => navigate('home')} />;
  }

  if (route === 'searching') {
    return <SearchApp onBack={() => navigate('home')} />;
  }

  // ─── Homepage ─────────────────────────────────────────────

  const cards = [
    {
      title: 'Sorting Algorithms',
      subtitle: 'Visualize & Analyze',
      description: 'Watch Bubble Sort, Quick Sort, Merge Sort and more step through your data in real-time with complexity analysis.',
      icon: BarChart3,
      route: 'sorting' as Route,
      algorithms: ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort', 'Heap Sort'],
      gradient: 'from-[#03A63C] to-[#04D939]',
      glow: 'rgba(4, 217, 57, 0.15)',
    },
    {
      title: 'Searching Algorithms',
      subtitle: 'Visualize & Analyze',
      description: 'Trace through Linear Search, Binary Search, Jump Search, and more with step-by-step cell highlighting.',
      icon: Search,
      route: 'searching' as Route,
      algorithms: ['Linear Search', 'Binary Search', 'Jump Search', 'Exponential Search'],
      gradient: 'from-[#04D939] to-[#03A63C]',
      glow: 'rgba(3, 166, 60, 0.15)',
    },
  ];

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
  };

  return (
    <div className="min-h-screen bg-[#012340] text-white relative overflow-hidden">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0 opacity-40">
        <Aurora
          colorStops={['#012340', '#03A63C', '#04D939']}
          amplitude={1.2}
          blend={0.6}
          speed={0.3}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -30, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="pt-16 md:pt-24 pb-8 text-center px-4"
        >
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-[#03A63C] to-[#04D939] bg-clip-text text-transparent tracking-tight mb-4">
            TraceLab
          </h1>
          <p className="text-white/40 text-base md:text-lg font-light tracking-wide max-w-xl mx-auto leading-relaxed">
            Interactive algorithm visualizer with real-time step tracing & AI-powered complexity analysis
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="flex-1 flex items-start justify-center px-4 md:px-8 pb-12"
        >
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {cards.map((card) => (
              <motion.button
                key={card.route}
                variants={fadeUp}
                onClick={() => navigate(card.route)}
                className="group relative text-left w-full bg-white/[0.04] backdrop-blur-sm rounded-2xl border border-white/[0.06] p-6 md:p-8 shadow-2xl cursor-pointer transition-all duration-300 hover:bg-white/[0.07] hover:border-white/[0.12] hover:scale-[1.02] active:scale-[0.99]"
                style={{
                  boxShadow: `0 0 60px ${card.glow}`,
                }}
              >
                {/* Top Row */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                    <card.icon className="w-6 h-6 text-[#012340]" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-[#04D939] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-1">
                  {card.title}
                </h2>
                <span className="text-xs font-semibold text-[#03A63C] uppercase tracking-widest">
                  {card.subtitle}
                </span>

                {/* Description */}
                <p className="text-white/50 text-sm md:text-base mt-4 leading-relaxed">
                  {card.description}
                </p>

                {/* Algorithm Tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {card.algorithms.map((algo) => (
                    <span
                      key={algo}
                      className="px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-medium text-white/40 group-hover:text-white/60 group-hover:border-white/10 transition-colors"
                    >
                      {algo}
                    </span>
                  ))}
                </div>

                {/* Bottom glow line */}
                <div className={`absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-40 transition-opacity duration-500`}></div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <Footer />
      </div>
    </div>
  );
};

export default App;
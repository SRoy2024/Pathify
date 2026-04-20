import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Loader2, Zap, Calendar, Users, Briefcase, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Animated counter hook
const useAnimatedCounter = (target, duration = 1200) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const startTime = performance.now();
    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease out
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return count;
};

const Dashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  const [activeCollabs, setActiveCollabs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => { fetchDashboardData(); }, []);

  // Cursor spotlight
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };
    el.addEventListener('mousemove', handler);
    return () => el.removeEventListener('mousemove', handler);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const userRes = await axiosInstance.get('/auth/me');
      setUser(userRes.data);

      const [eventsRes, collabsRes, postsRes] = await Promise.all([
        axiosInstance.get('/clubs/events'),
        axiosInstance.get('/collaborations'),
        axiosInstance.get('/posts')
      ]);

      setTotalPosts(postsRes.data.length);
      const userEvents = eventsRes.data.filter(e => e.participants.includes(userRes.data._id));
      const userCollabs = collabsRes.data.filter(c => c.createdBy._id === userRes.data._id || c.applicants.includes(userRes.data._id));
      setUpcomingEvents(userEvents);
      setActiveCollabs(userCollabs);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      await axiosInstance.post('/seed');
      await fetchDashboardData();
    } catch (error) {
      console.error('Error seeding:', error);
    } finally {
      setSeeding(false);
    }
  };

  const pointsCount = useAnimatedCounter(user?.points || 0);
  const collabCount = useAnimatedCounter(activeCollabs.length);
  const eventCount = useAnimatedCounter(upcomingEvents.length);
  const postCount = useAnimatedCounter(totalPosts);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, filter: 'blur(10px)' },
    show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div 
      ref={containerRef}
      className="space-y-8 max-w-6xl mx-auto spotlight-container"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Hero Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-600 mb-2">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-5xl font-black tracking-tighter leading-[1.1]">
            Welcome back,<br/>
            <span className="text-gradient">{user?.name || 'Student'}</span>
          </h1>
        </div>
        
        <motion.button
          onClick={handleSeedData}
          disabled={seeding}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="btn-premium text-white px-6 py-3 rounded-2xl font-semibold flex items-center disabled:opacity-50 text-sm self-start"
        >
          {seeding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
          Populate Data
        </motion.button>
      </motion.div>

      {/* Bento Stats Grid */}
      <div className="bento-grid">
        {/* Points - Large */}
        <motion.div variants={itemVariants} className="glow-card p-7 span-2 flex flex-col justify-between cursor-pointer" onClick={() => navigate('/feed')}>
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              boxShadow: '0 0 30px rgba(245, 158, 11, 0.2)',
            }}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Gamification</span>
          </div>
          <div className="mt-6">
            <p className="text-6xl font-black text-white tracking-tighter count-animate">{pointsCount}</p>
            <p className="text-sm text-slate-500 mt-1">Total Points Earned</p>
          </div>
        </motion.div>

        {/* Collabs */}
        <motion.div variants={itemVariants} className="glow-card p-7 flex flex-col justify-between cursor-pointer" onClick={() => navigate('/collaboration')}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
            boxShadow: '0 0 24px rgba(99, 102, 241, 0.2)',
          }}>
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div className="mt-4">
            <p className="text-4xl font-black text-white tracking-tighter count-animate">{collabCount}</p>
            <p className="text-xs text-slate-500 mt-1">Active Collabs</p>
          </div>
        </motion.div>

        {/* Events */}
        <motion.div variants={itemVariants} className="glow-card p-7 flex flex-col justify-between cursor-pointer" onClick={() => navigate('/clubs')}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            boxShadow: '0 0 24px rgba(168, 85, 247, 0.2)',
          }}>
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="mt-4">
            <p className="text-4xl font-black text-white tracking-tighter count-animate">{eventCount}</p>
            <p className="text-xs text-slate-500 mt-1">Upcoming Events</p>
          </div>
        </motion.div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
            <p className="text-xs text-slate-600">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Collaborations */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="pulse-dot" style={{ background: '#8b5cf6' }}></div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Active Projects</h2>
              </div>
              <button onClick={() => navigate('/collaboration')} className="text-[11px] font-medium text-slate-600 hover:text-violet-400 transition-colors flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            {activeCollabs.length === 0 ? (
              <div className="glow-card p-10 text-center">
                <Briefcase className="w-8 h-8 text-slate-800 mx-auto mb-3" />
                <p className="text-xs text-slate-600">No active projects</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeCollabs.map((collab, i) => (
                  <motion.div 
                    key={collab._id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="glow-card p-5 cursor-pointer group"
                    onClick={() => navigate('/collaboration')}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-slate-200 truncate group-hover:text-white transition-colors">{collab.title}</h4>
                        <p className="text-[11px] text-slate-600 mt-1 truncate">{collab.description}</p>
                      </div>
                      <span className="ml-3 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md" style={{
                        background: collab.createdBy._id === user?._id ? 'rgba(139, 92, 246, 0.1)' : 'rgba(6, 182, 212, 0.1)',
                        color: collab.createdBy._id === user?._id ? '#a78bfa' : '#22d3ee',
                      }}>
                        {collab.createdBy._id === user?._id ? 'Owner' : 'Member'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Upcoming Events */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="pulse-dot" style={{ background: '#ec4899' }}></div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Upcoming Events</h2>
              </div>
              <button onClick={() => navigate('/clubs')} className="text-[11px] font-medium text-slate-600 hover:text-pink-400 transition-colors flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            {upcomingEvents.length === 0 ? (
              <div className="glow-card p-10 text-center">
                <Calendar className="w-8 h-8 text-slate-800 mx-auto mb-3" />
                <p className="text-xs text-slate-600">No upcoming events</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event, i) => (
                  <motion.div 
                    key={event._id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="glow-card p-5 cursor-pointer group"
                    onClick={() => navigate('/clubs')}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-slate-200 truncate group-hover:text-white transition-colors">{event.title}</h4>
                        <p className="text-[11px] text-slate-600 mt-1">{event.clubId?.name || 'Campus Event'}</p>
                      </div>
                      <span className="ml-3 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md" style={{
                        background: 'rgba(236, 72, 153, 0.1)',
                        color: '#f472b6',
                      }}>
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;

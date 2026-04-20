import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Users, Loader2, CheckCircle, Sparkles, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Clubs = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await axiosInstance.get('/clubs/events');
      setEvents(res.data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleGenerateRandomEvents = async () => {
    setGenerating(true);
    try {
      await axiosInstance.post('/clubs/events/random');
      fetchEvents();
    } catch (error) { console.error(error); }
    finally { setGenerating(false); }
  };

  const handleApply = async (eventId) => {
    try {
      await axiosInstance.post(`/clubs/events/${eventId}/apply`);
      fetchEvents();
    } catch (error) {
      alert(error.response?.data?.message || 'Error');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, filter: 'blur(10px)' },
    show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const gradients = [
    'linear-gradient(135deg, #7c3aed, #6366f1)',
    'linear-gradient(135deg, #ec4899, #f43f5e)',
    'linear-gradient(135deg, #06b6d4, #3b82f6)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #10b981, #06b6d4)',
  ];

  const daysUntil = (date) => {
    const days = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  };

  return (
    <motion.div className="space-y-6 max-w-5xl mx-auto" variants={containerVariants} initial="hidden" animate="show">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">
            Campus <span className="text-gradient">Events</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1 uppercase tracking-widest font-medium">Discover what's coming up</p>
        </div>
        <motion.button
          onClick={handleGenerateRandomEvents}
          disabled={generating}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="btn-premium text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center disabled:opacity-50"
        >
          {generating ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
          Generate Events
        </motion.button>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
        </div>
      ) : events.length === 0 ? (
        <motion.div variants={itemVariants} className="glow-card p-16 text-center">
          <Calendar className="w-8 h-8 text-slate-800 mx-auto mb-3" />
          <p className="text-xs text-slate-600">No events yet. Generate some!</p>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event, i) => {
            const isApplied = user && event.participants.includes(user._id);
            const gradient = gradients[i % gradients.length];

            return (
              <motion.div 
                key={event._id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="glow-card p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Color accent bar */}
                  <div className="w-full h-1 rounded-full mb-5 opacity-60" style={{ background: gradient }}></div>
                  
                  <h2 className="text-lg font-bold text-white tracking-tight">{event.title}</h2>
                  <p className="text-[11px] font-semibold mt-1 mb-3" style={{
                    color: gradient.includes('#ec4899') ? '#f472b6' : gradient.includes('#06b6d4') ? '#22d3ee' : '#a78bfa',
                  }}>
                    {event.clubId?.name || 'Campus Club'}
                  </p>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{event.description}</p>
                </div>
                
                <div className="mt-5">
                  <div className="flex items-center gap-4 text-[11px] text-slate-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {daysUntil(event.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {event.participants?.length || 0}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleApply(event._id)}
                    disabled={isApplied}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex justify-center items-center ${
                      isApplied ? 'cursor-not-allowed' : ''
                    }`}
                    style={isApplied ? {
                      background: 'rgba(16, 185, 129, 0.06)',
                      border: '1px solid rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                    } : {
                      background: gradient,
                      boxShadow: `0 0 20px ${gradient.includes('#ec4899') ? 'rgba(236,72,153,0.2)' : gradient.includes('#06b6d4') ? 'rgba(6,182,212,0.2)' : 'rgba(124,58,237,0.2)'}`,
                      color: '#fff',
                    }}
                  >
                    {isApplied ? <><CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Registered</> : 'Register Now'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Clubs;

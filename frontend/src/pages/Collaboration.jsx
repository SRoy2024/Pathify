import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Users, Loader2, Send, Code, CheckCircle, Briefcase, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Collaboration = () => {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({ title: '', description: '', skillsRequired: '' });

  useEffect(() => { fetchCollaborations(); }, []);

  const fetchCollaborations = async () => {
    try {
      const res = await axiosInstance.get('/collaborations');
      setCollaborations(res.data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    setSubmitting(true);
    try {
      const skillsArray = formData.skillsRequired.split(',').map(s => s.trim()).filter(Boolean);
      await axiosInstance.post('/collaborations', { ...formData, skillsRequired: skillsArray });
      setFormData({ title: '', description: '', skillsRequired: '' });
      setShowForm(false);
      fetchCollaborations();
    } catch (error) { console.error(error); }
    finally { setSubmitting(false); }
  };

  const handleApply = async (id) => {
    try {
      await axiosInstance.post(`/collaborations/${id}/apply`);
      fetchCollaborations();
    } catch (error) { alert(error.response?.data?.message || 'Error'); }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, filter: 'blur(10px)' },
    show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const skillColors = ['#a78bfa', '#f472b6', '#22d3ee', '#34d399', '#fbbf24', '#fb923c'];

  return (
    <motion.div className="space-y-6 max-w-5xl mx-auto" variants={containerVariants} initial="hidden" animate="show">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">
            Find <span className="text-gradient">Teammates</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1 uppercase tracking-widest font-medium">Project collaborations</p>
        </div>
        <motion.button
          onClick={() => setShowForm(!showForm)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="btn-premium text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center"
        >
          {showForm ? <><X className="w-3.5 h-3.5 mr-1.5" /> Cancel</> : <><Code className="w-3.5 h-3.5 mr-1.5" /> Post Project</>}
        </motion.button>
      </motion.div>

      {/* Modal-style Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="glow-card p-6 overflow-hidden"
          >
            <form onSubmit={handlePostSubmit} className="space-y-3">
              <input type="text" required placeholder="Project name" className="input-premium w-full text-sm" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              <textarea required className="input-premium w-full resize-none text-sm" rows="2" placeholder="Describe what you're building..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              <input type="text" placeholder="Skills needed (comma separated)" className="input-premium w-full text-sm" value={formData.skillsRequired} onChange={(e) => setFormData({...formData, skillsRequired: e.target.value})} />
              <div className="flex justify-end pt-1">
                <button type="submit" disabled={submitting || !formData.title.trim() || !formData.description.trim()} className="btn-premium text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center disabled:opacity-20">
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Send className="w-3.5 h-3.5 mr-1.5" />}
                  Publish
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards */}
      <motion.div variants={itemVariants}>
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
          </div>
        ) : collaborations.length === 0 ? (
          <div className="glow-card p-16 text-center">
            <Briefcase className="w-8 h-8 text-slate-800 mx-auto mb-3" />
            <p className="text-xs text-slate-600">No projects posted yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collaborations.map((collab, i) => {
              const isOwner = user && collab.createdBy._id === user._id;
              const isApplied = user && collab.applicants?.includes(user._id);

              return (
                <motion.div 
                  key={collab._id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="glow-card p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-base font-bold text-white tracking-tight leading-tight flex-1">{collab.title}</h2>
                      {isOwner && (
                        <span className="ml-2 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md flex-shrink-0" style={{
                          background: 'rgba(139, 92, 246, 0.1)',
                          color: '#a78bfa',
                        }}>You</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mb-2">by {collab.createdBy.name}</p>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{collab.description}</p>
                    
                    {collab.skillsRequired?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {collab.skillsRequired.map((skill, idx) => (
                          <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{
                            background: `${skillColors[idx % skillColors.length]}0D`,
                            color: skillColors[idx % skillColors.length],
                            border: `1px solid ${skillColors[idx % skillColors.length]}1A`,
                          }}>{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                    <span className="text-[11px] text-slate-700 flex items-center gap-1">
                      <Users className="w-3 h-3" /> {collab.applicants?.length || 0} interested
                    </span>
                    
                    {!isOwner && (
                      <button
                        onClick={() => handleApply(collab._id)}
                        disabled={isApplied}
                        className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-300 flex items-center ${isApplied ? 'cursor-not-allowed' : ''}`}
                        style={isApplied ? {
                          background: 'rgba(16, 185, 129, 0.06)',
                          border: '1px solid rgba(16, 185, 129, 0.15)',
                          color: '#34d399',
                        } : {
                          background: 'rgba(139, 92, 246, 0.1)',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                          color: '#a78bfa',
                        }}
                      >
                        {isApplied ? <><CheckCircle className="w-3 h-3 mr-1" /> Applied</> : 'Apply'}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Collaboration;

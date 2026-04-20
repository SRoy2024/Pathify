import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Loader2, MessageSquare, Heart, Send, Trash2, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get('/posts');
      setPosts(res.data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setSubmitting(true);
    try {
      const res = await axiosInstance.post('/posts', { content: newPost });
      setPosts([res.data, ...posts]);
      setNewPost('');
    } catch (error) { console.error(error); }
    finally { setSubmitting(false); }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      setPosts(posts.filter(p => p._id !== postId));
    } catch (error) { console.error(error); }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, filter: 'blur(10px)' },
    show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <motion.div className="max-w-2xl mx-auto space-y-6" variants={containerVariants} initial="hidden" animate="show">
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-black tracking-tighter">
          Campus <span className="text-gradient">Feed</span>
        </h1>
        <p className="text-xs text-slate-600 mt-1 uppercase tracking-widest font-medium">What's happening today</p>
      </motion.div>

      {/* Compose */}
      <motion.div variants={itemVariants} className="glow-card p-5">
        <form onSubmit={handlePostSubmit}>
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold text-white" style={{
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <textarea
                className="input-premium w-full resize-none text-sm"
                rows="2"
                placeholder="Share something with your campus..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submitting || !newPost.trim()}
                  className="btn-premium text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center disabled:opacity-20"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Send className="w-3.5 h-3.5 mr-1.5" />}
                  Post
                </button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Posts */}
      <motion.div variants={itemVariants} className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
          </div>
        ) : posts?.length > 0 ? (
          <AnimatePresence>
            {posts.map((post, i) => (
              <motion.div 
                key={post._id} 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
                transition={{ delay: i * 0.04 }}
                className="glow-card p-5 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{
                      background: `linear-gradient(135deg, hsl(${(post.author?.name?.charCodeAt(0) || 0) * 3}, 70%, 55%), hsl(${(post.author?.name?.charCodeAt(0) || 0) * 3 + 40}, 70%, 55%))`,
                    }}>
                      {post.author?.name?.charAt(0)}
                    </div>
                    <div className="ml-2.5">
                      <h3 className="font-semibold text-xs text-slate-200">{post.author?.name}</h3>
                      <p className="text-[10px] text-slate-700">{timeAgo(post.createdAt)}</p>
                    </div>
                  </div>
                  {user?._id === post.author?._id && (
                    <button onClick={() => handleDeletePost(post._id)} className="text-slate-800 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mt-3 whitespace-pre-wrap">{post.content}</p>
                <div className="flex items-center gap-4 mt-4 pt-3 text-[11px] text-slate-700" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                  <button className="flex items-center hover:text-pink-400 transition-all group/btn">
                    <Heart className="w-3.5 h-3.5 mr-1 group-hover/btn:scale-125 transition-transform" />
                    {post.likes?.length || 0}
                  </button>
                  <button className="flex items-center hover:text-violet-400 transition-all group/btn">
                    <MessageSquare className="w-3.5 h-3.5 mr-1 group-hover/btn:scale-125 transition-transform" />
                    {post.comments?.length || 0}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="glow-card p-16 text-center">
            <Flame className="w-8 h-8 text-slate-800 mx-auto mb-3" />
            <p className="text-xs text-slate-600">Nothing here yet. Start the conversation!</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Feed;

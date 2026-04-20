import { useState } from 'react';
import axiosInstance from '../api/axios';
import { Loader2, Sparkles, Target } from 'lucide-react';

const AICareerBuddy = () => {
  const [goal, setGoal] = useState('');
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateRoadmap = async (e) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setLoading(true);
    try {
      const res = await axiosInstance.post('/ai/roadmap', { goal, currentYear: '3rd Year' });
      setRoadmap(res.data.roadmap);
    } catch (error) {
      console.error('Error generating roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
          <Sparkles className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">AI Career Buddy</h1>
          <p className="text-slate-400 mt-1">Get a personalized roadmap for your dream career</p>
        </div>
      </div>

      <div className="glass-card p-8">
        <form onSubmit={generateRoadmap} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">What is your career goal?</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Target className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-slate-100 text-lg"
                placeholder="e.g. Software Engineer, Data Scientist, Product Manager"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading || !goal.trim()}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-xl transition-all font-medium shadow-lg shadow-indigo-500/25 flex items-center disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
            Generate Roadmap
          </button>
        </form>
      </div>

      {roadmap && (
        <div className="space-y-6 mt-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
          {roadmap.map((step, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-indigo-500 text-slate-100 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                {index + 1}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-6 rounded-2xl border border-slate-700 shadow-xl">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-indigo-400 text-lg">{step.month}</h3>
                </div>
                <p className="text-slate-300">{step.task}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AICareerBuddy;

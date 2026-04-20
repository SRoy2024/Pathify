import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Bell, Menu, UserCircle } from 'lucide-react';

const Topbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-slate-700/50 bg-slate-800/40 backdrop-blur-xl lg:hidden">
      <div className="flex items-center">
        <button className="mr-4 text-slate-400 hover:text-slate-100">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gradient">Pathify</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-slate-400 hover:text-slate-100 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2">
          <UserCircle className="w-8 h-8 text-slate-400" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;

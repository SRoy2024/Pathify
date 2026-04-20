import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Rss, Users, Tent, Bot, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Feed', path: '/feed', icon: Rss },
  { name: 'Collaborate', path: '/collaboration', icon: Users },
  { name: 'Events', path: '/clubs', icon: Tent },
  { name: 'AI Buddy', path: '/ai-buddy', icon: Bot },
];

const Sidebar = () => {
  const { logout, user } = useContext(AuthContext);

  return (
    <aside className="w-[260px] flex-shrink-0 hidden lg:flex flex-col" style={{
      background: 'rgba(8, 8, 14, 0.95)',
      borderRight: '1px solid rgba(255, 255, 255, 0.03)',
    }}>
      {/* Logo */}
      <div className="h-20 flex items-center px-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center relative" style={{
            background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
            boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)',
          }}>
            <span className="text-white text-sm font-black">P</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-gradient">Pathify</span>
          <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md" style={{
            background: 'rgba(139, 92, 246, 0.12)',
            color: '#a78bfa',
          }}>Beta</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="w-[17px] h-[17px] mr-3 flex-shrink-0" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="flex items-center px-3 py-3 rounded-xl" style={{ background: 'rgba(139, 92, 246, 0.04)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
          }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="ml-2.5 overflow-hidden flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-600 truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2 mt-1 text-slate-600 hover:text-red-400 rounded-lg transition-all duration-300 hover:bg-red-500/4 text-xs"
        >
          <LogOut className="w-3.5 h-3.5 mr-2.5" />
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

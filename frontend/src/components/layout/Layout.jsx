import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ParticleBackground from '../ParticleBackground';

const Layout = () => {
  return (
    <>
      <ParticleBackground />
      <div className="flex h-screen text-white overflow-hidden relative z-10">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6 lg:p-10">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;

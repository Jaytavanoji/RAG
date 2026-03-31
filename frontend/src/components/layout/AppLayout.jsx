import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary-container selection:text-white">
      <Sidebar />
      <main className="ml-64 min-h-screen relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-container/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-primary-container/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <Topbar />
        
        <div className="relative z-10">
          <Outlet />
        </div>

        {/* Visual Polish: Kinetic Grain Texture */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100]" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCR4zwfSbGsAgwgbjfEsD2309i2DAKKapXo6YtHMAQvWVzIBaOT1vhJX5ndnbOWUC7jR24xGfhdiHCuFMJauR9HWWPNrdZ579aqHAj4N3zS1UI3Z7EyJEW5iMuIFAlNUozd4eoOq-tBnjw7_8qay6oQzCJkRsORA326pqQmXh_iN_kpF088G_mcDHiTmAEuL8fCilMASHrQ0XBZXgmZ4UjW1bS6RMOv8HN3iX6wx1I6hoZNMQHmagfrww_1B2a2uJLbrcQhWwZ21Z_M')" }}
        ></div>
      </main>
    </div>
  );
};

export default AppLayout;

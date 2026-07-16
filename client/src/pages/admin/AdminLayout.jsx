import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogOut, Home, FileText, Mail, Settings, Menu, X } from "lucide-react";

function Sidebar({ isOpen, onClose }) {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      isActive 
        ? "bg-blue-600 text-white shadow-md" 
        : "text-gray-600 hover:bg-gray-100"
    }`;
  
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/30 md:hidden z-40" onClick={onClose} />}
      <aside className={`fixed md:relative w-64 h-screen bg-white border-r border-gray-200 transition-transform z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">ScanX</div>
            <button onClick={onClose} className="md:hidden text-gray-500"><X size={20} /></button>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          <NavLink to="dashboard" onClick={onClose} className={linkClass}>
            <Home size={18} /> <span className="text-sm font-medium">Dashboard</span>
          </NavLink>
          <NavLink to="case-studies" onClick={onClose} className={linkClass}>
            <FileText size={18} /> <span className="text-sm font-medium">Case Studies</span>
          </NavLink>
          <NavLink to="submissions" onClick={onClose} className={linkClass}>
            <Mail size={18} /> <span className="text-sm font-medium">Submissions</span>
          </NavLink>
          <NavLink to="settings" onClick={onClose} className={linkClass}>
            <Settings size={18} /> <span className="text-sm font-medium">Settings</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("adminToken");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    if (!adminToken) navigate('/admin/login');
  }, [adminToken, navigate]);

  function logout() { 
    localStorage.removeItem('adminToken'); 
    navigate('/admin/login'); 
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <div className="flex-1" />
            <button 
              onClick={logout} 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-medium"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </header>
        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

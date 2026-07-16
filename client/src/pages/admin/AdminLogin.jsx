import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, AlertCircle } from "lucide-react";
import api from "../../lib/api.js";

export default function AdminLogin(){
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    if(!pw){ setErr("Enter password"); return }
    
    setIsLoading(true);
    setErr("");
    
    try {
      const res = await api.post('/admin/login', { password: pw });
      const data = res.data;
      if (data && data.token) { 
        localStorage.setItem('adminToken', data.token); 
        navigate('/admin/dashboard'); 
      }
      else setErr(data.message || 'Login failed');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Invalid password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-4">
            <span className="text-2xl font-bold text-white">ScanX</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 text-sm mt-2">Secure access to your dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {err && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{err}</p>
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Admin Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
              <input 
                id="password"
                type="password" 
                value={pw} 
                onChange={e => setPw(e.target.value)}
                placeholder="Enter your admin password" 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isLoading}
                autoFocus
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </>
            ) : (
              <>
                <Lock size={18} />
                Enter Admin Panel
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-6">
          © 2024 ScanX. All rights reserved.
        </p>
      </div>
    </div>
  );
}

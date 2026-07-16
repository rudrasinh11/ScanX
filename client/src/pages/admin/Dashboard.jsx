import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Users, FileText, Mail, TrendingUp, Radio } from "lucide-react";
import api from "../../lib/api.js";

export default function Dashboard() {
  const [clients, setClients] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [contactedCount, setContactedCount] = useState(0);
  const [caseStudyCount, setCaseStudyCount] = useState(0);

  useEffect(() => {
    // Socket connection for live clients
    const base = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const socketBase = base.replace(/\/api\/?$/i, "");
    const socket = io(socketBase);
    socket.on("clients", (list) => setClients(list || []));
    
    // Fetch initial data
    const token = localStorage.getItem('adminToken');
    
    api.get('/admin/clients', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setClients(r.data.clients || []))
      .catch(() => {});

    api.get('/contact?page=1&limit=100', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        setSubmissions(r.data.items || []);
        setContactedCount((r.data.items || []).filter(s => s.status === 'contacted').length);
      })
      .catch(() => {});

    // TODO: Fetch case studies count when endpoint available
    // api.get('/case-studies?page=1&limit=1', { headers: { Authorization: `Bearer ${token}` } })
    //   .then(r => setCaseStudyCount(r.data.total || 0))
    //   .catch(() => {});

    return () => socket.disconnect();
  }, []);

  const totalSubmissions = submissions.length;
  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const convertedCount = submissions.filter(s => s.status === 'converted').length;

  const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-transparent hover:shadow-md transition-shadow" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && <p className="text-xs text-gray-500 mt-1">{trend}</p>}
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>
          <Icon size={24} style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your ScanX performance and activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          icon={Radio} 
          label="Connected Clients" 
          value={clients.length}
          color="#3B82F6"
          trend="Live now"
        />
        <StatCard 
          icon={Mail} 
          label="Total Submissions" 
          value={totalSubmissions}
          color="#10B981"
        />
        <StatCard 
          icon={TrendingUp} 
          label="Pending" 
          value={pendingCount}
          color="#F59E0B"
        />
        <StatCard 
          icon={Users} 
          label="Contacted" 
          value={contactedCount}
          color="#8B5CF6"
        />
        <StatCard 
          icon={FileText} 
          label="Converted" 
          value={convertedCount}
          color="#06B6D4"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Clients - Takes up 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Radio size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Live Connected Clients</h2>
            <span className="ml-auto px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              {clients.length} active
            </span>
          </div>
          
          {clients.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-gray-400 mb-2">
                <Radio size={32} className="mx-auto opacity-50" />
              </div>
              <p className="text-gray-500 text-sm">No clients currently connected</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {clients.map((c, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-gray-500">
                        {new Date(c.connectedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  {c.submission ? (
                    <div className="space-y-2">
                      <div className="font-semibold text-gray-900">{c.submission.name}</div>
                      <div className="text-sm text-gray-600">{c.submission.businessName}</div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-2">
                        <div>📧 {c.submission.email}</div>
                        <div>📱 {c.submission.phone || '-'}</div>
                        <div>🏢 {c.submission.industry || '-'}</div>
                        <div>⭐ {c.submission.status}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">No submission data provided</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Submission Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-yellow-700">Pending</span>
              <span className="text-2xl font-bold text-yellow-600">{pendingCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-700">Contacted</span>
              <span className="text-2xl font-bold text-blue-600">{contactedCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-700">Converted</span>
              <span className="text-2xl font-bold text-green-600">{convertedCount}</span>
            </div>
            {totalSubmissions > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-600">Conversion Rate</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {((convertedCount / totalSubmissions) * 100).toFixed(1)}%
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Submissions */}
      {submissions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Submissions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Business</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {submissions.slice(0, 5).map((s, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-900">{s.name}</td>
                    <td className="py-3 text-gray-600">{s.businessName || '-'}</td>
                    <td className="py-3 text-gray-600">{s.email}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        s.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        s.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

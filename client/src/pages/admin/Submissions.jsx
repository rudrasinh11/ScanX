import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown, Eye, CheckCircle, Trash2, Download, X, Pencil, Send } from "lucide-react";
import api from "../../lib/api.js";
import { toast } from "../../lib/toast.js";

const STATUS_COLORS = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-100' },
  contacted: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100' },
  converted: { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100' },
};

export default function Submissions(){
  const [subs, setSubs] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showDetail, setShowDetail] = useState(false);
  const [detail, setDetail] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [filterStatus, setFilterStatus] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [industries, setIndustries] = useState(new Set());
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchPage(); }, [page, q, sortBy, sortOrder, filterStatus, filterIndustry]);

  function openDetail(s) { setDetail(s); setShowDetail(true); }
  function startEdit(s) { setEditing({ ...s }); setShowDetail(false); }

  async function markContacted(id) {
    try {
      const token = localStorage.getItem('adminToken');
      await api.patch(`/contact/${id}/status`, { status: 'contacted' }, { headers: { Authorization: `Bearer ${token}` } });
      fetchPage();
      toast.success('Client marked as contacted.');
    } catch(e) { console.error(e); }
  }

  async function changeStatus(id, status) {
    try {
      const token = localStorage.getItem('adminToken');
      await api.patch(`/contact/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchPage();
      toast.success(`Status changed to ${status}.`);
    } catch (e) { toast.error(e.response?.data?.message || 'Could not update status.'); }
  }

  async function approveAndEmail(id) {
    if (!confirm('Approve this request and send the confirmation email to the client?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await api.post(`/contact/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Approval email sent to the client.');
      fetchPage();
    } catch (e) { toast.error(e.response?.data?.message || 'Could not send approval email.'); }
  }

  async function saveEdit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      await api.patch(`/contact/${editing._id}`, editing, { headers: { Authorization: `Bearer ${token}` } });
      setEditing(null);
      fetchPage();
      toast.success('Client details saved.');
    } catch (e) { toast.error(e.response?.data?.message || 'Could not save client details.'); }
    finally { setSaving(false); }
  }

  async function deleteSubmission(id) {
    if(!confirm('Delete this submission?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await api.delete(`/contact/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchPage();
      setSelectedIds(s => { s.delete(id); return new Set(s); });
      toast.success('Submission deleted.');
    } catch(e) { toast.error(e.response?.data?.message || 'Could not delete submission.'); }
  }

  async function bulkDelete() {
    if(selectedIds.size === 0) return;
    if(!confirm(`Delete ${selectedIds.size} submission(s)?`)) return;
    try {
      const token = localStorage.getItem('adminToken');
      for(const id of selectedIds) {
        await api.delete(`/contact/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      }
      setSelectedIds(new Set());
      fetchPage();
      toast.success('Selected submissions deleted.');
    } catch(e) { toast.error(e.response?.data?.message || 'Could not delete selected submissions.'); }
  }

  async function bulkMarkContacted() {
    if(selectedIds.size === 0) return;
    try {
      const token = localStorage.getItem('adminToken');
      for(const id of selectedIds) {
        await api.patch(`/contact/${id}/status`, { status: 'contacted' }, { headers: { Authorization: `Bearer ${token}` } });
      }
      setSelectedIds(new Set());
      fetchPage();
      toast.success('Selected submissions marked as contacted.');
    } catch(e) { toast.error(e.response?.data?.message || 'Could not update selected submissions.'); }
  }

  function exportCSV() {
    const lines = ["name,businessName,website,instagram,industry,biggestChallenge,goals,email,phone,status,createdAt"];
    subs.forEach(s => {
      lines.push([s.name,s.businessName,s.website,s.instagram,s.industry,s.biggestChallenge,s.goals,s.email,s.phone,s.status,s.createdAt].map(v=>`"${String(v||'').replace(/"/g,'""')}"`).join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'submissions.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function fetchPage() {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await api.get("/contact", { 
        params: { page, limit, q, sortBy, sortOrder, status: filterStatus, industry: filterIndustry }, 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setSubs(res.data.items);
      setTotal(res.data.total);
      const uniqueIndustries = new Set(res.data.items.map(s => s.industry).filter(Boolean));
      setIndustries(uniqueIndustries);
    } catch(e) { console.error(e); }
  }

  function toggleSort(field) {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  }

  function toggleSelectAll() {
    if (selectedIds.size === subs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(subs.map(s => s._id)));
    }
  }

  const totalPages = Math.ceil(total / limit) || 1;
  const statusColor = (status) => STATUS_COLORS[status] || { bg: 'bg-gray-50', text: 'text-gray-700', badge: 'bg-gray-100' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submissions</h1>
        <p className="text-gray-600">Manage contact form submissions and track outreach</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            value={q} 
            onChange={e => { setQ(e.target.value); setPage(1); }} 
            placeholder="Search name, email, business..." 
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <select 
            value={filterStatus} 
            onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>
          <select 
            value={filterIndustry} 
            onChange={e => { setFilterIndustry(e.target.value); setPage(1); }}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Industries</option>
            {Array.from(industries).map(ind => <option key={ind} value={ind}>{ind}</option>)}
          </select>
          <button 
            onClick={exportCSV}
            className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
            <span className="text-sm font-medium text-blue-700">{selectedIds.size} selected</span>
            <button 
              onClick={bulkMarkContacted}
              className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Mark as Contacted
            </button>
            <button 
              onClick={bulkDelete}
              className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-10 p-4">
                  <input 
                    type="checkbox"
                    checked={selectedIds.size === subs.length && subs.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded"
                  />
                </th>
                {[
                  { key: 'name', label: 'Name' },
                  { key: 'businessName', label: 'Business' },
                  { key: 'email', label: 'Email' },
                  { key: 'industry', label: 'Industry' },
                  { key: 'status', label: 'Status' },
                  { key: 'createdAt', label: 'Received' },
                ].map(col => (
                  <th 
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className="px-6 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      {sortBy === col.key && (
                        sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subs.map(s => (
                <tr key={s._id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${statusColor(s.status).bg}`}>
                  <td className="w-10 p-4">
                    <input 
                      type="checkbox"
                      checked={selectedIds.has(s._id)}
                      onChange={() => {
                        const newSet = new Set(selectedIds);
                        if (newSet.has(s._id)) newSet.delete(s._id);
                        else newSet.add(s._id);
                        setSelectedIds(newSet);
                      }}
                      className="w-4 h-4 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{s.name}</td>
                  <td className="px-6 py-4 text-gray-700">{s.businessName || '-'}</td>
                  <td className="px-6 py-4 text-gray-700 truncate">{s.email}</td>
                  <td className="px-6 py-4 text-gray-700">{s.industry || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(s.status).badge} ${statusColor(s.status).text}`}>
                      {s.status}
                    </span>
                  </td>
                  {/* FIX 2: Added .toLocaleString() to display both date and time */}
                  <td className="px-6 py-4 text-gray-600 text-xs">{new Date(s.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 min-w-[150px]">
                      <select value={s.status} onChange={(e) => changeStatus(s._id, e.target.value)} className="text-xs border border-gray-300 rounded px-2 py-1 bg-white" aria-label={`Update ${s.name}'s status`}>
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                      </select>
                      <button onClick={() => openDetail(s)} className="text-blue-600 hover:text-blue-700" title="View details">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => startEdit(s)} className="text-amber-600 hover:text-amber-700" title="Edit client details">
                        <Pencil size={16} />
                      </button>
                      
                      {/* FIX 1: Removed condition restriction to allow unlimited clicks */}
                      <button onClick={() => approveAndEmail(s._id)} className="text-green-600 hover:text-green-700" title="Approve and send client email">
                        <Send size={16} />
                      </button>

                      <button onClick={() => deleteSubmission(s._id)} className="text-red-600 hover:text-red-700" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {subs.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm">No submissions found</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span> • Total: <span className="font-semibold">{total}</span>
        </div>
        <div className="flex gap-2">
          <button 
            disabled={page <= 1} 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Previous
          </button>
          <button 
            disabled={page >= totalPages} 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Next
          </button>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={saveEdit} className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div><h2 className="text-2xl font-bold">Edit client request</h2><p className="text-sm text-gray-500 mt-1">Update the submitted details before approving.</p></div>
              <button type="button" onClick={() => setEditing(null)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['name', 'Name'], ['businessName', 'Business name'], ['email', 'Email'], ['phone', 'Phone'],
                ['industry', 'Industry'], ['geography', 'Market / geography'], ['timeline', 'Decision timeline'], ['website', 'Website'], ['instagram', 'Instagram'],
              ].map(([field, label]) => (
                <label key={field} className="block text-sm font-medium text-gray-700">{label}
                  <input value={editing[field] || ''} onChange={(e) => setEditing({ ...editing, [field]: e.target.value })} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </label>
              ))}
              {[
                ['decision', 'Decision to support'], ['biggestChallenge', 'Biggest challenge'], ['goals', 'Goals'],
              ].map(([field, label]) => (
                <label key={field} className="sm:col-span-2 block text-sm font-medium text-gray-700">{label}
                  <textarea rows="3" value={editing[field] || ''} onChange={(e) => setEditing({ ...editing, [field]: e.target.value })} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </label>
              ))}
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg">Cancel</button>
              <button disabled={saving} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg disabled:opacity-50">{saving ? 'Saving…' : 'Save changes'}</button>
            </div>
          </form>
        </div>
      )}

      {showDetail && detail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{detail.businessName || detail.name}</h2>
              <button onClick={() => setShowDetail(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Name</p>
                  <p className="text-lg font-semibold text-gray-900">{detail.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Email</p>
                  <p className="text-lg font-semibold text-gray-900"><a href={`mailto:${detail.email}`} className="text-blue-600 hover:underline">{detail.email}</a></p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Business</p>
                  <p className="text-gray-700">{detail.businessName || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Phone</p>
                  <p className="text-gray-700">{detail.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Industry</p>
                  <p className="text-gray-700">{detail.industry || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Market / Geography</p>
                  <p className="text-gray-700">{detail.geography || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Decision Timeline</p>
                  <p className="text-gray-700">{detail.timeline || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor(detail.status).badge} ${statusColor(detail.status).text}`}>
                    {detail.status}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Website</p>
                  <p className="text-gray-700">{detail.website ? <a href={detail.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{detail.website}</a> : '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Instagram</p>
                  <p className="text-gray-700">{detail.instagram || '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Decision to Support</p>
                  <p className="text-gray-700">{detail.decision || '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Biggest Challenge</p>
                  <p className="text-gray-700">{detail.biggestChallenge || '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Goals</p>
                  <p className="text-gray-700">{detail.goals || '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Received</p>
                  <p className="text-gray-700">{new Date(detail.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
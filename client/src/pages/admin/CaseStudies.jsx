import { useEffect, useState } from "react";
import { Trash2, FileText, AlertCircle, CheckCircle, Link2 } from "lucide-react";
import api from "../../lib/api.js";
import { toast } from "../../lib/toast.js";

export default function CaseStudies() {
  const [form, setForm] = useState({ slug: "", industry: "", businessName: "", objective: "", tags: "", summary: "", pdfUrl: "" });
  const [caseStudies, setCaseStudies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { fetchList(); }, []);

  async function fetchList(){
    try{
      const token = localStorage.getItem('adminToken');
      const res = await api.get('/admin/case-studies', { headers: { Authorization: `Bearer ${token}` } });
      setCaseStudies(res.data);
    } catch(e){
      console.error(e);
      setError("Failed to load case studies");
      toast.error("Failed to load case studies.");
    }
  }

  async function submit(e){
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!form.slug || !form.businessName || !form.industry || !form.pdfUrl) {
      setError("Please fill in required fields: Slug, Business Name, Industry, and PDF Cloud Link");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      // Send as standard JSON payload instead of multi-part FormData
      await api.post('/admin/case-studies', form, { 
        headers: { 
          Authorization: `Bearer ${token}` 
        } 
      });
      
      setSuccess("Case study registered successfully!");
      toast.success("Case study saved successfully.");
      setForm({ slug: "", industry: "", businessName: "", objective: "", tags: "", summary: "", pdfUrl: "" });
      setTimeout(() => setSuccess(""), 3000);
      fetchList();
    } catch(e) {
      setError(e?.response?.data?.message || "Failed to save case study");
      toast.error("Failed to save case study.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCase(id) {
    if(!confirm("Delete this case study?")) return;
    try {
      const token = localStorage.getItem('adminToken');
      await api.delete(`/admin/case-studies/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchList();
      setSuccess("Case study deleted successfully!");
      toast.success("Case study deleted successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch(e) {
      setError("Failed to delete case study");
      toast.error("Failed to delete case study.");
      console.error(e);
    }
  }

  return (
    <div className="space-y-6 text-gray-900">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Case Studies Dashboard</h1>
        <p className="text-gray-600">Manage case studies portfolio via cross-platform cloud document nodes</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <form onSubmit={submit} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Add New Case Study</h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name *</label>
              <input 
                value={form.businessName} 
                onChange={e=>setForm({...form,businessName:e.target.value})} 
                placeholder="e.g., TechCorp Inc." 
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white text-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Slug *</label>
              <input 
                value={form.slug} 
                onChange={e=>setForm({...form,slug:e.target.value})} 
                placeholder="e.g., techcorp-success-story" 
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white text-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Industry *</label>
              <input 
                value={form.industry} 
                onChange={e=>setForm({...form,industry:e.target.value})} 
                placeholder="e.g., Technology" 
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white text-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">PDF Cloud URL Link *</label>
              <div className="relative">
                <Link2 size={16} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="url"
                  value={form.pdfUrl} 
                  onChange={e=>setForm({...form,pdfUrl:e.target.value})} 
                  placeholder="Paste Google Drive or shared cloud link" 
                  className="w-full p-2.5 pl-9 border border-gray-300 rounded-lg text-sm bg-white text-black"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Objective</label>
              <input 
                value={form.objective} 
                onChange={e=>setForm({...form,objective:e.target.value})} 
                placeholder="Main objectives..." 
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Summary</label>
              <textarea 
                value={form.summary} 
                onChange={e=>setForm({...form,summary:e.target.value})} 
                placeholder="Brief summary paragraph..." 
                rows="3"
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm resize-none bg-white text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tags</label>
              <input 
                value={form.tags} 
                onChange={e=>setForm({...form,tags:e.target.value})} 
                placeholder="Valuation, Audit, Tech" 
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white text-black"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
            >
              {isLoading ? "Saving Record..." : "Upload Case Study Link"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Case Studies ({caseStudies.length})</h2>

            {caseStudies.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">No portfolio assets indexed.</div>
            ) : (
              <div className="grid gap-4">
                {caseStudies.map(cs => (
                  <div key={cs._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-start justify-between text-black">
                    <div>
                      <h3 className="font-bold text-gray-900">{cs.businessName}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{cs.industry} • {cs.slug}</p>
                      <p className="text-[11px] text-blue-600 font-mono truncate max-w-sm sm:max-w-md mt-1">{cs.pdfUrl}</p>
                    </div>
                    <button 
                      onClick={() => deleteCase(cs._id)}
                      className="p-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-md transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
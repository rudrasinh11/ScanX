import { useEffect, useState } from "react";
import { Upload, Trash2, Download, FileText, AlertCircle, CheckCircle } from "lucide-react";
import api from "../../lib/api.js";
import { toast } from "../../lib/toast.js";

const serverBase = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/i, "");

export default function CaseStudies() {
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ slug: "", industry: "", businessName: "", objective: "", tags: "", summary: "" });
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
    
    // Validation
    if (!form.slug || !form.businessName || !form.industry) {
      setError("Please fill in required fields: Slug, Business Name, and Industry");
      return;
    }

    setIsLoading(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach(k => fd.append(k, form[k]));
      if(file) fd.append("pdf", file);
      
      const token = localStorage.getItem('adminToken');
      await api.post('/admin/case-studies', fd, { 
        headers: { 
          "Content-Type": "multipart/form-data", 
          Authorization: `Bearer ${token}` 
        } 
      });
      
      setSuccess("Case study uploaded successfully!");
      toast.success("Case study uploaded successfully.");
      setForm({ slug: "", industry: "", businessName: "", objective: "", tags: "", summary: "" });
      setFile(null);
      setTimeout(() => setSuccess(""), 3000);
      fetchList();
    } catch(e) {
      setError(e?.response?.data?.message || "Failed to upload case study");
      toast.error(e?.response?.data?.message || "Failed to upload case study.");
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Case Studies</h1>
        <p className="text-gray-600">Create and manage your case studies portfolio</p>
      </div>

      {/* Messages */}
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

      {/* Form and List Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <form onSubmit={submit} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Add New Case Study</h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name *</label>
              <input 
                value={form.businessName} 
                onChange={e=>setForm({...form,businessName:e.target.value})} 
                placeholder="e.g., TechCorp Inc." 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Slug *</label>
              <input 
                value={form.slug} 
                onChange={e=>setForm({...form,slug:e.target.value})} 
                placeholder="e.g., techcorp-success-story" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Industry *</label>
              <input 
                value={form.industry} 
                onChange={e=>setForm({...form,industry:e.target.value})} 
                placeholder="e.g., Technology" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Objective</label>
              <input 
                value={form.objective} 
                onChange={e=>setForm({...form,objective:e.target.value})} 
                placeholder="What was the main objective?" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Summary</label>
              <textarea 
                value={form.summary} 
                onChange={e=>setForm({...form,summary:e.target.value})} 
                placeholder="Brief summary of the case study..." 
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
              <input 
                value={form.tags} 
                onChange={e=>setForm({...form,tags:e.target.value})} 
                placeholder="Comma separated tags" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">PDF File</label>
              <label className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <div className="text-center">
                  <Upload size={20} className="mx-auto text-gray-400 mb-1" />
                  <span className="text-xs text-gray-600">{file ? file.name : "Click to upload PDF"}</span>
                </div>
                <input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={e=>setFile(e.target.files[0])} 
                  className="hidden"
                />
              </label>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload Case Study
                </>
              )}
            </button>
          </form>
        </div>

        {/* Case Studies List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Case Studies ({caseStudies.length})
            </h2>

            {caseStudies.length === 0 ? (
              <div className="py-12 text-center">
                <FileText size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">No case studies yet. Create your first one!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {caseStudies.map(cs => (
                  <div 
                    key={cs._id} 
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{cs.businessName}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {cs.industry}
                          {cs.slug && ` • ${cs.slug}`}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                        Case Study
                      </span>
                    </div>

                    {cs.objective && (
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-semibold">Objective:</span> {cs.objective}
                      </p>
                    )}

                    {cs.summary && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {cs.summary}
                      </p>
                    )}

                    {cs.tags?.length > 0 && (
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {(Array.isArray(cs.tags) ? cs.tags : cs.tags.split(',')).map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                      {cs.pdfUrl && (
                        <a 
                          href={serverBase + cs.pdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded text-xs font-semibold transition-colors"
                        >
                          <Download size={14} />
                          View PDF
                        </a>
                      )}
                      <button 
                        onClick={() => deleteCase(cs._id)}
                        className="ml-auto flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded text-xs font-semibold transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
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

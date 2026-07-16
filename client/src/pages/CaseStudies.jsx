import { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Download, Search, UploadCloud, FileText, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../components/Reveal.jsx"; 
import { StaggerGrid, StaggerItem } from "../components/StaggerGrid.jsx"; 
import api from "../lib/api.js"; 

export default function CaseStudies() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [industry, setIndustry] = useState("All");
  const [query, setQuery] = useState("");
  const [offline, setOffline] = useState(false);
  
  // Admin form expansion controls
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // New Case Study Form Fields state
  const [newStudy, setNewStudy] = useState({ businessName: "", industry: "", objective: "", tags: "", summary: "" });
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");

  // ✅ FIXED: Absolute cross-origin fallback wrapper targeting scanx-a production directly
  const fetchStudies = () => {
    setLoading(true);
    api
      .get("/case-studies")
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setCaseStudies(res.data);
          setOffline(false);
        } else {
          // If database is empty, fetch from direct live server path explicitly
          fetch("https://scanx-a.vercel.app/api/case-studies")
            .then(raw => raw.json())
            .then(data => {
              if(data && data.length > 0) setCaseStudies(data);
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        console.error("Primary gateway unreachable. Attempting absolute fallback context sync:", err);
        // Direct absolute backup request to bypass config issues
        fetch("https://scanx-a.vercel.app/api/case-studies")
          .then(raw => raw.json())
          .then(data => {
            if (data && Array.isArray(data)) {
              setCaseStudies(data);
              setOffline(false);
            }
          })
          .catch(() => {
            setOffline(true);
          });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudies();
    const token = localStorage.getItem("token") || document.cookie.includes("token");
    if (token) setIsAdmin(true);
  }, []);

  const industries = useMemo(
    () => ["All", ...new Set(caseStudies.map((c) => c.industry || "General"))],
    [caseStudies]
  );

  const filtered = caseStudies.filter((c) => {
    const matchesIndustry = industry === "All" || c.industry === industry;
    const matchesQuery =
      !query ||
      (c.businessName && c.businessName.toLowerCase().includes(query.toLowerCase())) ||
      (c.objective && c.objective.toLowerCase().includes(query.toLowerCase()));
    return matchesIndustry && matchesQuery;
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setPdfFile(file);
        setFormError("");
      } else {
        setFormError("Only authentic PDF documents can be accepted.");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
      setFormError("");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) return setFormError("Please attach or drag-and-drop a strategic PDF brief.");
    
    setUploading(true);
    setFormError("");

    const formData = new FormData();
    formData.append("businessName", newStudy.businessName);
    formData.append("industry", newStudy.industry);
    formData.append("objective", newStudy.objective);
    formData.append("tags", newStudy.tags);
    formData.append("summary", newStudy.summary);
    formData.append("pdf", pdfFile);

    try {
      await api.post("/admin/case-studies", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setNewStudy({ businessName: "", industry: "", objective: "", tags: "", summary: "" });
      setPdfFile(null);
      setShowForm(false);
      fetchStudies(); 
    } catch (err) {
      setFormError(err?.response?.data?.message || "Could not publish your case study profile.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pt-32 sm:pt-36 pb-20 sm:pb-28 bg-[#fafafa]">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
          <Reveal className="max-w-2xl">
            <div className="font-num text-xs tracking-[0.14em] uppercase text-gold flex items-center gap-2.5 mb-5">
              <span className="w-6 h-px bg-gold" /> Featured Work
            </div>
            <h1 className="text-[32px] sm:text-5xl leading-[1.1] mb-4 text-black font-bold">
              Independent Portfolio Case Studies
            </h1>
            <p className="text-base sm:text-lg text-inksoft leading-relaxed">
              Real businesses, researched independently, to demonstrate how ScanX's methodology surfaces practical opportunities.
            </p>
          </Reveal>

          {isAdmin && (
            <Reveal>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-sm bg-gold text-white hover:bg-black transition-colors shadow-sm"
              >
                {showForm ? <X size={16} /> : <Plus size={16} />}
                {showForm ? "Close Panel" : "Publish Case Study"}
              </button>
            </Reveal>
          )}
        </div>

        <AnimatePresence>
          {showForm && isAdmin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border border-line rounded-md bg-white p-6 sm:p-8 my-8 shadow-sm"
            >
              <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                <UploadCloud className="text-gold" size={22} /> Upload Research Case Profile
              </h2>
              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-medium text-inkfaint mb-1.5">Business Name *</label>
                    <input required type="text" placeholder="e.g. Apex Logistics" className="w-full px-4 py-2.5 text-sm border border-line rounded-sm outline-none focus:border-gold" value={newStudy.businessName} onChange={(e) => setNewStudy({...newStudy, businessName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-medium text-inkfaint mb-1.5">Industry Sector *</label>
                    <input required type="text" placeholder="e.g. Logistics, E-commerce" className="w-full px-4 py-2.5 text-sm border border-line rounded-sm outline-none focus:border-gold" value={newStudy.industry} onChange={(e) => setNewStudy({...newStudy, industry: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-medium text-inkfaint mb-1.5">Target Objective *</label>
                    <input required type="text" placeholder="e.g. Audit checkout layout churn parameters" className="w-full px-4 py-2.5 text-sm border border-line rounded-sm outline-none focus:border-gold" value={newStudy.objective} onChange={(e) => setNewStudy({...newStudy, objective: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-medium text-inkfaint mb-1.5">Tags (Comma Separated)</label>
                    <input type="text" placeholder="e.g. UX Audit, CRO, Optimization" className="w-full px-4 py-2.5 text-sm border border-line rounded-sm outline-none focus:border-gold" value={newStudy.tags} onChange={(e) => setNewStudy({...newStudy, tags: e.target.value})} />
                  </div>
                </div>

                <div className="flex flex-col justify-between space-y-4">
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                    className={`flex-1 border-2 border-dashed rounded-sm p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      dragActive ? "border-gold bg-amber-50/20" : "border-line hover:border-gold"
                    }`}
                  >
                    <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                    {pdfFile ? (
                      <div className="text-ink flex flex-col items-center gap-2">
                        <FileText size={40} className="text-gold" />
                        <p className="text-sm font-semibold truncate max-w-xs">{pdfFile.name}</p>
                        <span className="text-[11px] text-inksoft uppercase tracking-wider">Click or Drop to swap attachment</span>
                      </div>
                    ) : (
                      <div className="text-inksoft flex flex-col items-center gap-2">
                        <UploadCloud size={40} className="text-inkfaint" />
                        <p className="text-sm font-medium"><span className="text-gold font-semibold">Drag & drop your PDF report</span> or click to browse</p>
                        <p className="text-xs text-inkfaint">Supports standard document files up to 10MB</p>
                      </div>
                    )}
                  </div>

                  {formError && <div className="text-xs text-red-600 bg-red-50 p-3 rounded-sm border border-red-200">{formError}</div>}
                  
                  <button type="submit" disabled={uploading} className="w-full py-3 font-semibold text-sm bg-black text-white rounded-sm hover:bg-gold transition-colors disabled:opacity-50">
                    {uploading ? "Publishing Data Stream..." : "Deploy Live Case Study Portfolio"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <Reveal className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setIndustry(ind)}
                className={`text-xs sm:text-sm font-medium px-4 py-2 rounded-full border transition-all ${
                  industry === ind
                    ? "bg-black text-white border-black"
                    : "border-line text-inksoft hover:border-gold hover:text-gold"
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-inkfaint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reports…"
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-line rounded-full bg-white focus:border-gold outline-none transition-colors"
            />
          </div>
        </Reveal>

        {loading && <div className="text-center py-20 text-inksoft text-sm">Synchronizing global case records...</div>}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-inksoft text-sm border border-dashed rounded-md bg-white mt-8">
            No live case studies match those structural filter sets yet.
          </div>
        )}

        <StaggerGrid className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <StaggerItem key={c._id || c.slug}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="border border-line rounded-md overflow-hidden bg-white hover:shadow-md transition-all h-full flex flex-col"
              >
                <div className="h-40 sm:h-48 bg-gray-50 border-b border-line relative flex items-center justify-center overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: "linear-gradient(#1f1f1f 1px,transparent 1px),linear-gradient(90deg,#1f1f1f 1px,transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                  <span className="font-num text-3xl sm:text-4xl font-semibold text-black opacity-10 relative">
                    {c.businessName ? c.businessName.split(" ").map((w) => w[0]).slice(0, 2).join("") : "CS"}
                  </span>
                </div>
                <div className="p-6 sm:p-7 flex flex-col flex-1">
                  <div className="text-[11px] uppercase tracking-wider text-gold font-semibold mb-2.5">
                    {c.industry || "General"}
                  </div>
                  <h3 className="text-lg sm:text-xl font-heading font-bold mb-2.5 text-black">{c.businessName}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4.5 flex-1">{c.objective}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {(Array.isArray(c.tags) ? c.tags : typeof c.tags === "string" ? c.tags.split(",") : []).map((tag, idx) => (
                      <span key={idx} className="text-[11px] bg-gray-100 px-2.5 py-1.5 rounded-full text-gray-700">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 text-sm font-semibold border-t border-gray-100 pt-4.5">
                    <Link to={`/case-studies/${c.slug}`} className="flex items-center gap-1.5 hover:text-gold text-black transition-colors">
                      Preview <ArrowRight size={14} />
                    </Link>
                    {/* ✅ FIXED: Guarantees routing execution to static files on active API target hosting servers */}
                    {c.pdfUrl && (
                      <a 
                        href={c.pdfUrl.startsWith('http') ? c.pdfUrl : `https://scanx-a.vercel.app${c.pdfUrl}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-1.5 text-gold hover:text-black transition-colors"
                      >
                        Download PDF <Download size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <Reveal className="mt-14 px-6 sm:px-7 py-5 border-l-2 border-gold bg-gray-50 text-[13px] text-inksoft leading-relaxed rounded-r">
          Reports were independently prepared using publicly available information for educational and portfolio purposes. They do not represent commissioned consulting engagements, and are not affiliated with or endorsed by the featured business. Reports will be removed upon request from the respective business owner.
        </Reveal>
      </div>
    </div>
  );
}
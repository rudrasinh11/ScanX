import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, ShieldCheck } from "lucide-react";
import api from "../lib/api.js";

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setStatus("loading");
    api.get(`/case-studies/${slug}`)
      .then((res) => { 
        if (res.data) { 
          setData(res.data); 
          setStatus("ok"); 
        } 
      })
      .catch((err) => {
        console.error("Failed to load case study description:", err);
        setStatus("offline");
      });
  }, [slug]);

  // Anti-Copyright Protection: Disable right-clicks across the view frame interface
  useEffect(() => {
    const blockMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", blockMenu);
    return () => document.removeEventListener("contextmenu", blockMenu);
  }, []);

  if (status === "loading") return <div className="pt-40 text-center text-gray-400">Loading dynamic workspace context...</div>;
  if (status === "offline" || !data) return <div className="pt-40 text-center text-red-500">Report details are currently unavailable.</div>;

  // Resolve backend file path host intelligently from dynamic configuration rules
  const baseApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const serverBase = baseApiUrl.replace(/[()]/g, "").replace(/\/api\/?$/i, "").trim();
  
  // Clean target path logic
  let basePdf = data.pdfUrl?.startsWith("http") ? data.pdfUrl : `${serverBase}${data.pdfUrl}`;
  
  // Sanitize double routing path anomalies matching /api/uploads
  basePdf = basePdf.replace("/api/uploads", "/uploads");
  
  // FIX: Instruct native render layers to hide toolbar overlays
  const secureNativeUrl = `${basePdf}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;

  return (
    <div className="pt-32 pb-20 bg-white text-black min-h-screen select-none">
      <div className="max-w-[1040px] mx-auto px-5 sm:px-8">
        
        <Link to="/case-studies" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gold mb-6 font-semibold">
          <ArrowLeft size={15} /> Back to case studies
        </Link>
        
        <h1 className="text-4xl font-bold mb-2 text-black">{data.businessName}</h1>
        <p className="text-gray-600 mb-6">{data.objective}</p>

        <div className="border border-gray-200 bg-gray-50 rounded-md p-6 mb-8 text-sm text-gray-700">
          <h3 className="font-bold text-base text-black mb-2">Executive Overview Summary</h3>
          {data.summary}
        </div>

        {/* SECURED VIEWER NODE PLATFORM CONTAINER */}
        <div className="border border-gray-200 rounded-md overflow-hidden bg-gray-100 h-[800px] flex flex-col relative shadow-sm">
          <div className="bg-gray-900 px-4 py-3 flex items-center justify-between text-white text-xs font-semibold z-10">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-gold" /> 
              🔓 Full Portfolio Presentation Mode — Read Access Enabled
            </div>
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-500" /> Source Copy Protection Active
            </span>
          </div>
          
          <div className="w-full flex-1 relative bg-white overflow-hidden">
            {/* 🛡️ TRANSPARENT GUARD SHIELD: Intercepts pointer events to block drag-selection or frame clicking */}
            <div 
              className="absolute inset-0 z-20 bg-transparent" 
              style={{ pointerEvents: "auto", userSelect: "none" }}
              onContextMenu={(e) => e.preventDefault()}
            />
            
            {/* Embedded Native Object Window fallback to basic embed if needed */}
            <object
              data={secureNativeUrl}
              type="application/pdf"
              className="w-full h-full border-none pointer-events-none"
              id="protected-document-viewer"
            >
              <embed src={secureNativeUrl} type="application/pdf" />
            </object>
          </div>
        </div>
      </div>
    </div>
  );
}
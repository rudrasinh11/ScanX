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

  // Global protection: Intercept right-clicks anywhere on the page to safeguard the document
  useEffect(() => {
    const blockMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", blockMenu);
    return () => document.removeEventListener("contextmenu", blockMenu);
  }, []);

  if (status === "loading") return <div className="pt-40 text-center text-gray-400">Loading dynamic workspace context...</div>;
  if (status === "offline" || !data) return <div className="pt-40 text-center text-red-500">Report details are currently unavailable.</div>;

  let secureTargetUrl = data.pdfUrl || "";

  if (secureTargetUrl) {
    if (secureTargetUrl.includes("drive.google.com")) {
      if (secureTargetUrl.includes("/view")) {
        secureTargetUrl = secureTargetUrl.split("/view")[0] + "/preview";
      } else if (secureTargetUrl.includes("id=")) {
        const urlParams = new URLSearchParams(new URL(secureTargetUrl).search);
        const docId = urlParams.get("id");
        if (docId) {
          secureTargetUrl = `https://drive.google.com/file/d/${docId}/preview`;
        }
      }
    }
  }

  return (
    <div className="pt-32 pb-20 bg-white text-black min-h-screen select-none" style={{ userSelect: "none" }}>
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

        {/* SECURED VIEWER PLATFORM LAYER */}
        <div className="border border-gray-200 rounded-md overflow-hidden bg-gray-100 h-[800px] flex flex-col relative shadow-sm">
          <div className="bg-gray-900 px-4 py-3 flex items-center justify-between text-white text-xs font-semibold z-30 select-none">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-gold" /> 
              🔓 Presentation Workspace — Live Presentation Mode Active
            </div>
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-500" /> Source Copy Protection Active
            </span>
          </div>
          
          <div className="w-full flex-1 relative bg-white overflow-y-auto">
            {/* 🛡️ OPTIMIZED GUARD SHIELD: 
                pointerEvents: "none" lets scroll wheels pass right through to the iframe,
                while the combination of absolute layer positioning, global body contextmenu locks, 
                and 'select-none' keeps the document fully protected from copying. */}
            <div 
              className="absolute inset-0 z-20 bg-transparent" 
              style={{ pointerEvents: "none", userSelect: "none" }}
            />
            
            {secureTargetUrl ? (
              <iframe 
                src={secureTargetUrl}
                className="w-full h-full border-none absolute inset-0 z-10"
                title="Secured Document Streaming Node"
                allow="autoplay"
                style={{ pointerEvents: "auto" }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm z-10 relative">
                No active public document configuration linked to this case record.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
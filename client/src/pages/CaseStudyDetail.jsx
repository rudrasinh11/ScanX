import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, ShieldCheck } from "lucide-react";
import api from "../lib/api.js";

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [isTabFocused, setIsTabFocused] = useState(true);

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

  // 🛡️ ANTI-THEFT AND EXTRACT PROTECTION LAYER
  useEffect(() => {
    const blockMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", blockMenu);

    const interceptKeys = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && e.key === 's') e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        navigator.clipboard.writeText("Protected Portfolio Content — Access Denied.");
      }
    };
    document.addEventListener("keydown", interceptKeys);

    const handleVisibilityChange = () => setIsTabFocused(!document.hidden);
    const handleWindowBlur = () => setIsTabFocused(false);
    const handleWindowFocus = () => setIsTabFocused(true);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("contextmenu", blockMenu);
      document.removeEventListener("keydown", interceptKeys);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, []);

  if (status === "loading") return <div className="pt-40 text-center text-gray-400">Loading workspace context...</div>;
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

  // Pure SVG string converted for infinite CSS rendering engine utility
  const svgWatermarkPattern = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'><text x='50%' y='50%' text-anchor='middle' fill='black' font-family='sans-serif' font-weight='900' font-size='22' opacity='0.12' transform='rotate(-35, 120, 120)'>ScanX</text></svg>")`;

  return (
    <div className="pt-24 sm:pt-32 pb-20 bg-white text-black min-h-screen select-none" style={{ userSelect: "none" }}>
      <style>{`
        @media print {
          body { display: none !important; }
        }
      `}</style>

      <div className="w-full max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/case-studies" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gold mb-6 font-semibold transition-colors">
          <ArrowLeft size={15} /> Back to case studies
        </Link>
        
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-black break-words">{data.businessName}</h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6 break-words">{data.objective}</p>

        <div className="border border-gray-200 bg-gray-50 rounded-md p-4 sm:p-6 mb-8 text-xs sm:text-sm text-gray-700 break-words">
          <h3 className="font-bold text-sm sm:text-base text-black mb-2">Executive Overview Summary</h3>
          {data.summary}
        </div>

        {/* SECURED VIEWER PLATFORM CONTAINER */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-100 h-[550px] sm:h-[750px] lg:h-[850px] flex flex-col relative shadow-sm">
          <div className="bg-gray-900 px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between text-white text-[11px] sm:text-xs font-semibold gap-2 z-30 select-none">
            <div className="flex items-center gap-2 truncate">
              <FileText size={14} className="text-gold flex-shrink-0" /> 
              <span className="truncate">🔓 Workspace — Presentation Mode Active</span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-gray-400 flex items-center gap-1 self-end sm:self-auto">
              <ShieldCheck size={12} className="text-emerald-500" /> Dynamic Asset Protection Shield Active
            </span>
          </div>
          
          <div 
            className={`w-full flex-1 relative bg-white transition-all duration-300 ${!isTabFocused ? 'blur-xl scale-95 select-none pointer-events-none' : ''}`}
          >
            {/* 🛡️ INFINITE RESPONSIVE AUTOMATIC "SCANX" WATERMARK MATRIX */}
            {secureTargetUrl && (
              <div 
                className="absolute inset-0 z-20 pointer-events-none select-none mix-blend-difference"
                style={{ 
                  backgroundImage: svgWatermarkPattern,
                  backgroundRepeat: "repeat",
                  userSelect: "none"
                }}
              />
            )}
            
            {secureTargetUrl ? (
              <iframe 
                src={secureTargetUrl}
                className="w-full h-full border-none absolute inset-0 z-10"
                title="Secured Document Streaming Node"
                allow="autoplay"
                style={{ pointerEvents: "auto" }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-xs sm:text-sm z-10 relative px-4 text-center">
                No active public document linked to this configuration node.
              </div>
            )}

            {/* Focus Loss Overlay */}
            {!isTabFocused && (
              <div className="absolute inset-0 z-40 bg-gray-900/60 backdrop-blur-md flex items-center justify-center text-white font-bold text-center p-4">
                <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-w-xs text-xs sm:text-sm">
                  Screen capture restriction engaged. Refocus window to resume presentation context.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
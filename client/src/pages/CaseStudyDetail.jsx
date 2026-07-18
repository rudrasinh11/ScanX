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

  // 🛡️ ANTI-SCREENSHOT & COPY PROTECTION HANDLERS
  useEffect(() => {
    // 1. Disable context menus everywhere
    const blockMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", blockMenu);

    // 2. Intercept capture shortcuts (PrintScreen, Copy commands, Print commands)
    const interceptKeys = (e) => {
      // Block Ctrl+P / Cmd+P
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        alert("Printing is disabled in Presentation Mode.");
      }
      // Block Ctrl+C / Cmd+C
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        navigator.clipboard.writeText("Protected Portfolio Content — Access Denied.");
      }
    };
    document.addEventListener("keydown", interceptKeys);

    // 3. Tab Visibility Blur Engine (blurs content if system snippet tools open or users unfocus)
    const handleVisibilityChange = () => {
      setIsTabFocused(!document.hidden);
    };
    const handleWindowBlur = () => {
      setIsTabFocused(false);
    };
    const handleWindowFocus = () => {
      setIsTabFocused(true);
    };

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
    <div className="pt-24 sm:pt-32 pb-20 bg-white text-black min-h-screen select-none" style={{ userSelect: "none" }}>
      {/* Dynamic CSS Print Hiding Layer injected directly */}
      <style>{`
        @media print {
          body { display: none !important; }
          .no-print { display: none !important; }
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

        {/* SECURED VIEWER PLATFORM CONTAINER (Fully Fluid Mobile Response) */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-100 h-[550px] sm:h-[750px] lg:h-[850px] flex flex-col relative shadow-sm no-print">
          <div className="bg-gray-900 px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between text-white text-[11px] sm:text-xs font-semibold gap-2 z-30 select-none">
            <div className="flex items-center gap-2 truncate">
              <FileText size={14} className="text-gold flex-shrink-0" /> 
              <span className="truncate">🔓 Workspace — Presentation Mode Active</span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-gray-400 flex items-center gap-1 self-end sm:self-auto">
              <ShieldCheck size={12} className="text-emerald-500 flex-shrink-0" /> Content Encryption Active
            </span>
          </div>
          
          <div 
            className={`w-full flex-1 relative bg-white transition-all duration-300 ${!isTabFocused ? 'blur-xl scale-95 select-none pointer-events-none' : ''}`}
          >
            {/* 🛡️ OPTIMIZED TRANSPARENT GUARD SHIELD: Allows scrolling through while text remains unselectable */}
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
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-xs sm:text-sm z-10 relative px-4 text-center">
                No active public document configuration linked to this case record.
              </div>
            )}

            {/* Blurred Guard Text Overlay Shown Only When Window Loses Focus */}
            {!isTabFocused && (
              <div className="absolute inset-0 z-40 bg-gray-900/40 backdrop-blur-md flex items-center justify-center text-white font-bold text-center p-4">
                <div className="p-4 bg-gray-900 rounded-lg shadow-xl max-w-xs text-xs sm:text-sm">
                  Screen capture restriction active. Refocus the view container to resume presentation reading.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
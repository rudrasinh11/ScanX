import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, FileText } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import Button from "../components/Button.jsx";
import api from "../lib/api.js";

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ok | notfound | offline

  useEffect(() => {
    setStatus("loading");
    api
      .get(`/case-studies/${slug}`)
      .then((res) => {
        if (res.data) {
          setData(res.data);
          setStatus("ok");
        } else {
          // Absolute absolute backup routing context targeting scanx-a directly
          fetch(`https://scanx-a.vercel.app/api/case-studies/${slug}`)
            .then((r) => r.json())
            .then((backupData) => {
              if (backupData) {
                setData(backupData);
                setStatus("ok");
              } else {
                setStatus("notfound");
              }
            })
            .catch(() => setStatus("notfound"));
        }
      })
      .catch((err) => {
        // Backup request attempt to bypass configuration issues
        fetch(`https://scanx-a.vercel.app/api/case-studies/${slug}`)
          .then((r) => r.json())
          .then((backupData) => {
            if (backupData) {
              setData(backupData);
              setStatus("ok");
            } else {
              setStatus(err?.response?.status === 404 ? "notfound" : "offline");
            }
          })
          .catch(() => {
            setStatus(err?.response?.status === 404 ? "notfound" : "offline");
          });
      });
  }, [slug]);

  if (status === "loading") {
    return <div className="pt-40 pb-32 text-center text-inksoft">Loading dynamic analytics profile…</div>;
  }

  if (status === "notfound") {
    return (
      <div className="pt-40 pb-32 text-center px-5">
        <h1 className="text-2xl font-bold mb-3">Report not found</h1>
        <p className="text-inksoft mb-8">This case study may have been removed at the business owner's request.</p>
        <Button to="/case-studies" variant="secondary">
          <ArrowLeft size={15} /> Back to case studies
        </Button>
      </div>
    );
  }

  if (status === "offline") {
    return (
      <div className="pt-40 pb-32 text-center px-5">
        <h1 className="text-2xl font-bold mb-3">Report unavailable</h1>
        <p className="text-inksoft mb-8">
          The ScanX API isn't reachable right now, so this report couldn't be loaded from MongoDB.
        </p>
        <Button to="/case-studies" variant="secondary">
          <ArrowLeft size={15} /> Back to case studies
        </Button>
      </div>
    );
  }

  // Formatting absolute cloud CDN or API file paths cleanly
  const resolvedPdfUrl = data.pdfUrl?.startsWith("http")
    ? data.pdfUrl
    : `https://scanx-a.vercel.app${data.pdfUrl}`;

  return (
    <div className="pt-28 sm:pt-32 pb-20 sm:pb-28 bg-[#fafafa] text-black min-h-screen">
      <div className="max-w-[1040px] mx-auto px-5 sm:px-8">
        
        <Reveal>
          <Link to="/case-studies" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gold transition-colors mb-8 font-semibold">
            <ArrowLeft size={15} /> Back to case studies
          </Link>
          <div className="text-xs font-bold uppercase tracking-wider text-gold mb-3">{data.industry || "General"}</div>
          <h1 className="text-[32px] sm:text-5xl font-bold tracking-tight mb-4 text-black">{data.businessName}</h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6">{data.objective}</p>
          
          <div className="flex flex-wrap gap-2 mb-10">
            {(Array.isArray(data.tags) ? data.tags : typeof data.tags === "string" ? data.tags.split(",") : []).map((t, i) => (
              <span key={i} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-medium">
                {t.trim()}
              </span>
            ))}
          </div>
        </Reveal>

        {/* EXECUTIVE PROFILE EXECUTIVE SUMMARY MODULE */}
        {data.summary && (
          <Reveal className="mb-10 border border-gray-200/60 bg-white rounded-md p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold mb-3 text-black border-b border-gray-100 pb-2">Executive Summary</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">{data.summary}</p>
          </Reveal>
        )}

        {/* ✅ FIXED: FULL INTERACTIVE BROADCAST IFRAME PDF REPORT VIEWER CONTAINER */}
        {data.pdfUrl && (
          <Reveal className="mb-12 border border-gray-200/80 rounded-md overflow-hidden bg-gray-50 shadow-sm h-[700px] flex flex-col">
            <div className="bg-gray-900 px-4 py-3 flex items-center justify-between text-white text-xs font-semibold">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-gold" /> Active Analytics Document
              </div>
              <a 
                href={resolvedPdfUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-1 bg-gold text-white px-3 py-1 rounded-sm hover:bg-black transition-colors font-medium text-[11px]"
              >
                Download PDF <Download size={12} />
              </a>
            </div>
            
            <iframe 
              src={`https://docs.google.com/gview?url=${encodeURIComponent(resolvedPdfUrl)}&embedded=true`} 
              className="w-full flex-1 border-none bg-white"
              title="ScanX Independent Analytical Brief Document Previewer"
            />
          </Reveal>
        )}

        <Reveal className="px-6 py-5 border-l-2 border-gold bg-gray-100/60 text-[13px] text-gray-500 leading-relaxed rounded-r border border-y-gray-200/40 border-r-gray-200/40 shadow-sm">
          This report was independently prepared using publicly available information for educational and portfolio purposes. It does not represent a commissioned consulting engagement, and is not affiliated with or endorsed by **{data.businessName}**. It will be removed immediately upon request from the active business owner.
        </Reveal>

      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, FileText } from "lucide-react";
import api from "../lib/api.js";

export default function CaseStudiesList() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    api.get("/case-studies")
      .then((res) => {
        if (res.data) {
          setCaseStudies(res.data);
          setStatus("ok");
        }
      })
      .catch((err) => {
        console.error("Failed to load case studies:", err);
        setStatus("error");
      });
  }, []);

  // Filter case studies by matching everything in lowercase (small letters)
  const filteredCaseStudies = caseStudies.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.businessName?.toLowerCase().includes(query) ||
      item.objective?.toLowerCase().includes(query) ||
      item.summary?.toLowerCase().includes(query)
    );
  });

  if (status === "loading") return <div className="pt-40 text-center text-gray-400">Loading case studies...</div>;
  if (status === "error") return <div className="pt-40 text-center text-red-500">Failed to load case studies.</div>;

  return (
    <div className="pt-24 sm:pt-32 pb-20 bg-white text-black min-h-screen">
      <div className="w-full max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Header Wrapper */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">Case Studies</h1>
            <p className="text-sm text-gray-500 mt-1">Search through our verified reports</p>
          </div>
          
          {/* Only Search Option Left Here */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-amber-600 rounded-md text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600"
            />
          </div>
        </div>

        {/* Case Studies Grid Layout */}
        {filteredCaseStudies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCaseStudies.map((study) => (
              <Link 
                to={`/case-studies/${study.slug}`} 
                key={study.id || study.slug}
                className="block p-5 border border-gray-200 rounded-lg bg-gray-50 hover:border-amber-500 transition-all shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <FileText className="text-amber-600 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-bold text-lg text-black mb-1">{study.businessName}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{study.objective}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 text-sm">
            No case studies found matching "{searchQuery}"
          </div>
        )}

      </div>
    </div>
  );
}
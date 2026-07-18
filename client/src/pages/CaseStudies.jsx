import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, FileText } from "lucide-react";
import Reveal from "../components/Reveal.jsx"; 
import { StaggerGrid, StaggerItem } from "../components/StaggerGrid.jsx"; 
import api from "../lib/api.js"; 

export default function CaseStudies() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [industry, setIndustry] = useState("All");
  const [query, setQuery] = useState("");

  const fetchStudies = () => {
    setLoading(true);
    api.get("/case-studies")
      .then((res) => {
        // Fix: Even if empty or returning unexpected schema, fallback if array length is 0
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setCaseStudies(res.data);
          setLoading(false);
        } else {
          // Trigger fallback stream if response data is empty array
          fetchBackupStream();
        }
      })
      .catch((err) => {
        console.error("API error, pulling from backup domain stream:", err);
        fetchBackupStream();
      });
  };

  const fetchBackupStream = () => {
    fetch("https://scanx-a.vercel.app/api/case-studies")
      .then(r => r.json())
      .then(data => { 
        if (Array.isArray(data)) setCaseStudies(data); 
      })
      .catch(err => console.error("Backup stream failure:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudies(); }, []);

  const industries = useMemo(() => {
    const raw = caseStudies.map((c) => (c.industry || "General").trim());
    return ["All", ...new Set(raw)];
  }, [caseStudies]);

  const filtered = caseStudies.filter((c) => {
    const cleanInd = (c.industry || "General").trim();
    const matchesIndustry = industry === "All" || cleanInd === industry.trim();
    const matchesQuery = !query || 
      (c.businessName && c.businessName.toLowerCase().includes(query.toLowerCase()));
    return matchesIndustry && matchesQuery;
  });

  return (
    <div className="pt-32 sm:pt-36 pb-20 sm:pb-28 bg-[#fafafa] min-h-screen">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        
        <Reveal className="max-w-2xl mb-10">
          <div className="font-num text-xs tracking-[0.14em] uppercase text-gold mb-3">Featured Work</div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-black">Independent Portfolio Case Studies</h1>
          <p className="text-gray-600">Explore premium analytical business assets live.</p>
        </Reveal>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-10">
          <div className="flex flex-wrap gap-2">
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setIndustry(ind)}
                className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all ${
                  industry === ind ? "bg-black text-white" : "bg-white text-gray-600 border-gray-200"
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reports..."
              className="w-full px-4 py-2.5 pl-10 text-sm border border-gray-200 rounded-full bg-white outline-none text-black"
            />
            <Search className="absolute left-3.5 top-3.5 text-gray-400" size={14} />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 text-sm">Loading dynamic portfolio grid entries...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-sm">No workspace items found matching criteria.</div>
        ) : (
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <StaggerItem key={c._id || c.slug}>
                <div className="border border-gray-200/70 rounded-md overflow-hidden bg-white shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-gold font-bold mb-1">{c.industry}</span>
                    <h3 className="text-xl font-bold mb-2 text-black">{c.businessName}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">{c.objective}</p>
                    <div className="flex gap-4 text-sm font-semibold border-t border-gray-100 pt-4 mt-auto">
                      <Link to={`/case-studies/${c.slug}`} className="text-black hover:text-gold flex items-center gap-1 transition-colors">
                        Read Full Report <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
      </div>
    </div>
  );
}
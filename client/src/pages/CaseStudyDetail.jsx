import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import Reveal from "../components/Reveal.jsx"; 
import { StaggerGrid, StaggerItem } from "../components/StaggerGrid.jsx"; 
import api from "../lib/api.js"; 

export default function CaseStudies() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchStudies = () => {
    setLoading(true);
    api.get("/case-studies")
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setCaseStudies(res.data);
          setLoading(false);
        } else {
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

  // 🔍 Case-Insensitive Search: Normalizes all combinations of Capital & Small letters uniformly
  const filtered = caseStudies.filter((c) => {
    if (!query) return true;
    
    const searchTarget = query.toLowerCase().trim();
    
    const nameMatch = c.businessName && c.businessName.toLowerCase().includes(searchTarget);
    const indMatch = c.industry && c.industry.toLowerCase().includes(searchTarget);
    const objMatch = c.objective && c.objective.toLowerCase().includes(searchTarget);
    
    return nameMatch || indMatch || objMatch;
  });

  return (
    <div className="pt-32 sm:pt-36 pb-20 sm:pb-28 bg-[#fafafa] min-h-screen">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        
        <Reveal className="max-w-2xl mb-10">
          <div className="font-num text-xs tracking-[0.14em] uppercase text-gold mb-3">Featured Work</div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-black">Independent Portfolio Case Studies</h1>
          <p className="text-gray-600">Explore premium analytical business assets live.</p>
        </Reveal>

        {/* Search Input Framework */}
        <div className="flex justify-end items-center mb-10 border-b border-gray-100 pb-6">
          <div className="relative w-full sm:w-80">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reports..."
              className="w-full px-5 py-3 pl-11 text-sm border border-gray-200 rounded-full bg-white outline-none text-black shadow-sm focus:border-gold transition-colors"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={16} />
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
                    
                    {/* View Actions: Keeping full original routing links intact */}
                    <div className="flex items-center justify-between text-sm font-semibold border-t border-gray-100 pt-4 mt-auto">
                      <Link to={`/case-studies/${c.slug}`} className="text-black hover:text-gold flex items-center gap-1 transition-colors w-full">
                        Read Full Report <ArrowRight size={14} className="inline ml-1" />
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
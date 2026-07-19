import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import { StaggerGrid, StaggerItem } from "../components/StaggerGrid.jsx";
import api from "../lib/api.js";

const extractArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (payload && Array.isArray(payload.items)) return payload.items;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return null;
};

export default function CaseStudies() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchStudies = () => {
    setLoading(true);
    api
      .get("/case-studies")
      .then((res) => {
        const arr = extractArray(res.data);
        if (arr && arr.length > 0) {
          setCaseStudies(arr);
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
      .then((r) => r.json())
      .then((data) => {
        const arr = extractArray(data);
        if (arr) setCaseStudies(arr);
      })
      .catch((err) => console.error("Backup stream failure:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudies();
  }, []);

  const filtered = caseStudies.filter((c) => {
    if (!query) return true;
    return c.businessName && c.businessName.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="pt-32 sm:pt-36 pb-20 sm:pb-28 bg-[#fafafa] min-h-screen">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">

        <Reveal className="max-w-2xl mb-10">
          <div className="font-num text-xs tracking-[0.14em] uppercase text-gold mb-3">Featured Work</div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-black">Independent Portfolio Case Studies</h1>
          <p className="text-gray-600">Explore premium analytical business assets live.</p>
        </Reveal>

        <div className="flex justify-end mb-10">
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
            {filtered.map((c, index) => (
              <StaggerItem key={c._id || c.slug || index}>
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
import { useEffect, useState } from "react";
import { Check, ShieldAlert } from "lucide-react";
import Reveal from "../components/Reveal.jsx";

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://scanx-a.vercel.app/api/pricing")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setPlans(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-32 sm:pt-36 pb-20 bg-[#fafafa] min-h-screen text-black">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-bold tracking-[0.14em] uppercase text-gold mb-3 flex justify-center items-center gap-2">
            <span className="w-4 h-px bg-gold" /> Clear Transparent Rates
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">Predictive Strategy Plans</h1>
          <p className="text-gray-500 text-base sm:text-lg">Select a tailored brief scope that aligns perfectly with your scaling goals.</p>
        </Reveal>

        {loading ? (
          <div className="text-center py-20 text-sm text-gray-400">Loading price catalogs...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {plans.map((p) => (
              <div 
                key={p._id} 
                className={`border rounded-lg bg-white p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                  p.isPopular 
                    ? "border-gold shadow-md ring-1 ring-gold/20 transform md:-y-2" 
                    : "border-gray-200/80 shadow-sm hover:border-gray-300"
                }`}
              >
                {p.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-sm">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">{p.title}</h3>
                  <p className="text-xs text-gray-500 mb-6 leading-relaxed">{p.description}</p>
                  
                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-bold tracking-tight text-black">₹{p.price}</span>
                    <span className="text-xs text-gray-400 font-medium font-sans">/{p.billingPeriod}</span>
                  </div>

                  <ul className="space-y-3.5 border-t border-gray-100 pt-6">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <Check size={16} className="text-gold mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button className={`w-full py-3 mt-8 text-center text-sm font-bold rounded transition-all ${
                  p.isPopular 
                    ? "bg-gold text-white hover:bg-black" 
                    : "bg-black text-white hover:bg-gold"
                }`}>
                  {p.buttonText || "Choose Plan"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
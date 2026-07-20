import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";
import api from "../../lib/api.js";

export default function PricingAdmin() {
  const [plans, setPlans] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", price: "", description: "", features: "", isPopular: false });

  const fetchPlans = () => {
    api.get("/pricing").then((res) => setPlans(res.data)).catch(() => {});
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formattedForm = {
      ...form,
      price: Number(form.price),
      features: form.features.split(",").map(f => f.trim()).filter(Boolean)
    };

    try {
      if (editingId) {
        await api.put(`/admin/pricing/${editingId}`, formattedForm);
      } else {
        await api.post("/admin/pricing", formattedForm);
      }
      setForm({ title: "", price: "", description: "", features: "", isPopular: false });
      setEditingId(null);
      fetchPlans();
    } catch (err) {
      alert("Error saving pricing tier config.");
    } finally { setLoading(false); }
  };

  const startEdit = (plan) => {
    setEditingId(plan._id);
    setForm({
      title: plan.title,
      price: plan.price,
      description: plan.description,
      features: plan.features.join(", "),
      isPopular: plan.isPopular
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this pricing plan permanently?")) return;
    await api.delete(`/admin/pricing/${id}`);
    fetchPlans();
  };

  return (
    <div className="p-6 bg-white rounded-md border border-gray-200 shadow-sm max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-black flex items-center gap-2">💰 Manage Website Pricing Tiers</h2>
      
      <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200/60 p-5 rounded-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <h3 className="md:col-span-2 text-sm uppercase tracking-wider font-bold text-gray-400">{editingId ? "✏️ Edit Plan Parameters" : "✨ Create New Pricing Plan"}</h3>
        <div>
          <label className="block text-xs font-semibold mb-1">Plan Title *</label>
          <input required text="text" placeholder="e.g. Premium Audit" className="w-full border p-2 text-sm rounded bg-white" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Price (₹ INR) *</label>
          <input required type="number" placeholder="e.g. 20" className="w-full border p-2 text-sm rounded bg-white" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold mb-1">Short Description *</label>
          <input required type="text" placeholder="Explain who this plan is for..." className="w-full border p-2 text-sm rounded bg-white" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold mb-1">Features (Comma Separated) *</label>
          <textarea required placeholder="5-Page Limit, Custom SEO Analysis, SWOT Review" className="w-full border p-2 text-sm rounded bg-white h-20" value={form.features} onChange={e => setForm({...form, features: e.target.value})} />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <input type="checkbox" id="isPopular" checked={form.isPopular} onChange={e => setForm({...form, isPopular: e.target.checked})} />
          <label htmlFor="isPopular" className="text-xs font-bold uppercase cursor-pointer text-amber-600">Highlight as 'Most Popular' plan</label>
        </div>
        <div className="md:col-span-2 flex gap-2 justify-end mt-4">
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm({title:"", price:"", description:"", features:"", isPopular:false}); }} className="px-4 py-2 border text-sm rounded flex items-center gap-1 hover:bg-gray-100"><X size={14} /> Cancel</button>
          )}
          <button type="submit" disabled={loading} className="bg-black text-white px-5 py-2 text-sm font-bold rounded hover:bg-gold flex items-center gap-1">
            <Save size={14} /> {loading ? "Saving changes..." : editingId ? "Update Plan" : "Deploy Pricing Plan"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h3 className="text-base font-bold text-black border-b pb-2">Active Live Plan Matrix ({plans.length})</h3>
        {plans.map(p => (
          <div key={p._id} className={`p-4 border rounded flex items-center justify-between bg-white shadow-sm ${p.isPopular ? "border-amber-400 bg-amber-50/5" : "border-gray-100"}`}>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-black">{p.title}</span>
                <span className="text-sm font-bold bg-gray-100 text-gray-800 px-2 py-0.5 rounded">₹{p.price}</span>
                {p.isPopular && <span className="text-[9px] font-bold bg-amber-500 text-white tracking-widest uppercase px-1.5 py-0.5 rounded">Popular</span>}
              </div>
              <p className="text-xs text-gray-500 mt-1">{p.description}</p>
              <div className="flex gap-2 flex-wrap mt-2">
                {p.features.map((f, i) => (
                  <span key={i} className="text-[10px] bg-gray-50 border px-2 py-0.5 text-gray-600 rounded">{f}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(p)} className="p-2 text-gray-600 hover:text-amber-500 hover:bg-gray-50 rounded transition-colors"><Edit2 size={16} /></button>
              <button onClick={() => handleDelete(p._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
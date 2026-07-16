import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, CheckCircle2 } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import Button from "../components/Button.jsx";
import api from "../lib/api.js";
import { io } from "socket.io-client";

const initialForm = {
  name: "",
  businessName: "",
  website: "",
  instagram: "",
  industry: "",
  geography: "",
  decision: "",
  timeline: "",
  biggestChallenge: "",
  goals: "",
  email: "",
  phone: "",
};

const fieldClass =
  "w-full px-4 py-3.5 text-sm border border-line rounded-sm bg-bg focus:border-gold outline-none transition-colors placeholder:text-inkfaint";
const labelClass = "block text-xs uppercase tracking-wide text-inkfaint mb-2";

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      // NORMALIZATION: Explicitly strips any accidental trailing slashes to eliminate routing blocks
      const res = await api.post("/contact", form);
      const submission = res?.data?.submission;
      
      // Handle socket mapping if running on a live persistent server context
      if (submission) {
        try {
          const socketBase = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/i, "");
          const socket = io(socketBase, { transports: ["websocket"] });
          socket.emit("identify", submission);
          setTimeout(() => socket.disconnect(), 1000);
        } catch (e) {
          console.error("socket identify error", e);
        }
      }
      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setError(
        err?.response?.data?.message ||
          "Something went wrong sending your request. Please try again, or email us directly."
      );
    }
  }

  return (
    <div className="pt-32 sm:pt-36 pb-20 sm:pb-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        <Reveal className="max-w-2xl text-center mx-auto mb-14 sm:mb-16">
          <div className="font-num text-xs tracking-[0.14em] uppercase text-gold flex items-center justify-center gap-2.5 mb-5">
            <span className="w-6 h-px bg-gold" /> Get Started
          </div>
          <h1 className="text-[32px] sm:text-5xl leading-[1.1] mb-4">Let's talk about your business.</h1>
          <p className="text-base sm:text-lg text-inksoft leading-relaxed">
            Tell us a bit about your business and biggest challenge, and ScanX will follow up
            with next steps.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-10 lg:gap-16">
          {/* FORM */}
          <Reveal className="border border-line rounded-md p-6 sm:p-9 bg-white">
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-14"
              >
                <CheckCircle2 className="mx-auto text-gold mb-5" size={44} />
                <h2 className="text-xl font-heading font-bold mb-3">Request received</h2>
                <p className="text-inksoft max-w-sm mx-auto mb-8">
                  Thanks — ScanX will review your research brief. You will receive a confirmation
                  email only after your request has been approved.
                </p>
                <Button variant="secondary" onClick={() => setStatus("idle")}>
                  Submit another request
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Name *</label>
                    <input required className={fieldClass} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Jane Smith" />
                  </div>
                  <div>
                    <label className={labelClass}>Business Name *</label>
                    <input required className={fieldClass} value={form.businessName} onChange={(e) => update("businessName", e.target.value)} placeholder="Northline Home Goods" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Website</label>
                    <input className={fieldClass} value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="yourbusiness.com" />
                  </div>
                  <div>
                    <label className={labelClass}>Instagram</label>
                    <input className={fieldClass} value={form.instagram} onChange={(e) => update("instagram", e.target.value)} placeholder="@yourbusiness" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Industry *</label>
                  <input required className={fieldClass} value={form.industry} onChange={(e) => update("industry", e.target.value)} placeholder="e.g. Hospitality, Retail, Healthcare" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Market / Geography</label>
                    <input className={fieldClass} value={form.geography} onChange={(e) => update("geography", e.target.value)} placeholder="India, Gujarat, or specific cities" />
                  </div>
                  <div>
                    <label className={labelClass}>Decision Timeline</label>
                    <select className={fieldClass} value={form.timeline} onChange={(e) => update("timeline", e.target.value)}>
                      <option value="">Select a timeline</option>
                      <option>Within 2 weeks</option>
                      <option>Within 30 days</option>
                      <option>Within 90 days</option>
                      <option>Exploring options</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>What decision should this research support?</label>
                  <textarea rows={3} className={fieldClass} value={form.decision} onChange={(e) => update("decision", e.target.value)} placeholder="For example: assess demand before launching a new service or entering a new market." />
                </div>

                <div>
                  <label className={labelClass}>Biggest Challenge *</label>
                  <textarea required rows={3} className={fieldClass} value={form.biggestChallenge} onChange={(e) => update("biggestChallenge", e.target.value)} placeholder="What's the main growth problem you're facing?" />
                </div>

                <div>
                  <label className={labelClass}>Goals</label>
                  <textarea rows={3} className={fieldClass} value={form.goals} onChange={(e) => update("goals", e.target.value)} placeholder="What would a successful outcome look like?" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input required type="email" className={fieldClass} value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@business.com" />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input className={fieldClass} value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 00000 00000" />
                  </div>
                </div>

                {status === "error" && (
                  <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-4 py-3">
                    {error}
                  </div>
                )}

                <Button type="submit" variant="primary" className="w-full sm:w-auto">
                  {status === "submitting" ? "Sending…" : "Send Research Request"}
                </Button>
              </form>
            )}
          </Reveal>

          {/* SIDE INFO */}
          <Reveal delay={0.1} className="space-y-8">
            <div className="border border-line rounded-md p-6 sm:p-7">
              <h3 className="text-sm uppercase tracking-wide text-inkfaint mb-5">Contact Details</h3>
              <div className="space-y-4 text-sm">
                <a href="mailto:rudrasinh3115@gmail.com" className="flex items-center gap-3 hover:text-gold transition-colors">
                  <Mail size={16} className="text-gold flex-shrink-0" /> rudrasinh3115@gmail.com
                </a>
                <a href="tel:+918905050705" className="flex items-center gap-3 hover:text-gold transition-colors">
                  <Phone size={16} className="text-gold flex-shrink-0" /> +91 8905050705
                </a>
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-inksoft">Mon – Sat, 10:00 AM – 7:00 PM IST</span>
                </div>
              </div>
            </div>

            <div className="border border-line rounded-md overflow-hidden">
              <div className="h-48 bg-raised flex items-center justify-center relative">
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(31,31,31,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(31,31,31,0.06) 1px,transparent 1px)",
                    backgroundSize: "22px 22px",
                  }}
                />
                <div className="relative text-center text-inkfaint text-sm flex flex-col items-center gap-2">
                  <MapPin size={20} className="text-gold" />
                  Map available upon request
                </div>
              </div>
            </div>

            <div className="text-xs text-inkfaint leading-relaxed">
              Submissions are stored securely and reviewed by the ScanX team. We'll never
              share your details with third parties.
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
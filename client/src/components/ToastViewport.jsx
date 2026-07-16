import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const styles = {
  success: { icon: CheckCircle2, shell: "border-emerald-200 bg-emerald-50 text-emerald-950", iconColor: "text-emerald-600" },
  error: { icon: AlertCircle, shell: "border-red-200 bg-red-50 text-red-950", iconColor: "text-red-600" },
  info: { icon: Info, shell: "border-blue-200 bg-blue-50 text-blue-950", iconColor: "text-blue-600" },
};

export default function ToastViewport() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const show = (event) => {
      const item = event.detail;
      setItems((current) => [...current, item]);
      window.setTimeout(() => setItems((current) => current.filter((toast) => toast.id !== item.id)), 4500);
    };
    window.addEventListener("scanx:toast", show);
    return () => window.removeEventListener("scanx:toast", show);
  }, []);

  return (
    <div className="fixed right-4 top-4 sm:right-6 sm:top-6 z-[200] w-[calc(100%-2rem)] max-w-sm space-y-3 pointer-events-none" aria-live="polite">
      <AnimatePresence initial={false}>
        {items.map((item) => {
          const style = styles[item.type] || styles.info;
          const Icon = style.icon;
          return (
            <motion.div key={item.id} initial={{ opacity: 0, x: 32, scale: 0.96 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 32, scale: 0.96 }} className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-xl ${style.shell}`}>
              <Icon size={20} className={`mt-0.5 flex-shrink-0 ${style.iconColor}`} />
              <p className="flex-1 text-sm font-medium leading-relaxed">{item.message}</p>
              <button onClick={() => setItems((current) => current.filter((toast) => toast.id !== item.id))} className="-mr-1 -mt-1 rounded p-1 opacity-60 hover:opacity-100" aria-label="Dismiss message"><X size={16} /></button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

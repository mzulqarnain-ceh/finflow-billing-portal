import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun, Moon, CreditCard, FileText, BarChart2, Clock,
  Plus, Trash2, Search, ChevronDown, X, Check, Zap,
  Building2, User, Hash, Calendar, Tag, Printer,
  TrendingUp, TrendingDown, DollarSign, ArrowUpRight,
  Download, Shield, Star, Sparkles, AlertCircle,
  CheckCircle2, XCircle, HelpCircle, ArrowRight, Settings, Menu, Eye, EyeOff
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

// ─── DATA ────────────────────────────────────────────────────────────────────

const REVENUE_DATA = [
  { month: "Jan", Revenue: 18400, Expenses: 9200 },
  { month: "Feb", Revenue: 22100, Expenses: 10500 },
  { month: "Mar", Revenue: 19800, Expenses: 11000 },
  { month: "Apr", Revenue: 31200, Expenses: 12400 },
  { month: "May", Revenue: 28700, Expenses: 10800 },
  { month: "Jun", Revenue: 35400, Expenses: 13200 },
  { month: "Jul", Revenue: 41000, Expenses: 14100 },
  { month: "Aug", Revenue: 38600, Expenses: 13800 },
  { month: "Sep", Revenue: 44200, Expenses: 15600 },
  { month: "Oct", Revenue: 47800, Expenses: 16200 },
  { month: "Nov", Revenue: 52100, Expenses: 17400 },
  { month: "Dec", Revenue: 58900, Expenses: 18900 },
];

const TRANSACTIONS = [
  { id: "INV-2024-001", client: "Acme Corp",        date: "2024-12-01", amount: 4800,  status: "Paid", items: [{ desc: "Design & Custom Theme", qty: 2, price: 2400 }] },
  { id: "INV-2024-002", client: "Beacon Labs",      date: "2024-12-03", amount: 1250,  status: "Paid", items: [{ desc: "Product Architecture", qty: 1, price: 1250 }] },
  { id: "INV-2024-003", client: "CloudBridge Inc",  date: "2024-12-05", amount: 9200,  status: "Pending", items: [{ desc: "Dynamic Cloud Setup", qty: 4, price: 2300 }] },
  { id: "INV-2024-004", client: "DataSync Ltd",     date: "2024-12-07", amount: 3400,  status: "Paid", items: [{ desc: "DB Administration", qty: 2, price: 1700 }] },
  { id: "INV-2024-005", client: "EdgeNode Systems", date: "2024-12-08", amount: 760,   status: "Failed", items: [{ desc: "Bug Resolution Services", qty: 1, price: 760 }] },
  { id: "INV-2024-006", client: "FluxCore AI",      date: "2024-12-10", amount: 14900, status: "Paid", items: [{ desc: "AI Training & Model Fine-tuning", qty: 1, price: 14900 }] },
  { id: "INV-2024-007", client: "GridPath Tech",    date: "2024-12-12", amount: 2100,  status: "Pending", items: [{ desc: "LMS Integrations", qty: 3, price: 700 }] },
  { id: "INV-2024-008", client: "HorizonSaaS",      date: "2024-12-14", amount: 5500,  status: "Paid", items: [{ desc: "Marketing Web App", qty: 1, price: 5500 }] },
  { id: "INV-2024-009", client: "Ironclad Security",date: "2024-12-15", amount: 3890,  status: "Failed", items: [{ desc: "Penetration Testing Audits", qty: 2, price: 1945 }] },
  { id: "INV-2024-010", client: "JetStream Cloud",  date: "2024-12-18", amount: 22000, status: "Paid", items: [{ desc: "Cluster Orchestrations", qty: 1, price: 22000 }] },
];

const PLANS = [
  {
    name: "Starter", icon: Zap, monthlyPrice: 19,
    description: "Perfect for freelancers & small teams",
    features: ["5 clients", "20 invoices/mo", "Basic analytics", "Email support", "PDF exports"],
    color: "slate",
  },
  {
    name: "Growth", icon: TrendingUp, monthlyPrice: 49,
    description: "For growing businesses that need more",
    features: ["Unlimited clients", "Unlimited invoices", "Advanced analytics", "Priority support", "Custom branding", "API access"],
    color: "indigo",
    popular: true,
  },
  {
    name: "Enterprise", icon: Building2, monthlyPrice: 149,
    description: "Full power for large organizations",
    features: ["Everything in Growth", "Multi-user access", "SSO & SAML", "Dedicated manager", "SLA guarantee", "Custom integrations"],
    color: "violet",
  },
];

const DISCOUNT_CODES = { "SAVE10": 10, "LAUNCH20": 20, "VIP30": 30 };

// ─── UTILS ───────────────────────────────────────────────────────────────────

const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useDark() {
  const [dark, setDark] = useState(true); // Default to Dark Mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return [dark, setDark];
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Badge({ status }) {
  const map = {
    Paid:    { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-900/50", icon: CheckCircle2 },
    Pending: { bg: "bg-amber-50 dark:bg-amber-950/30",     text: "text-amber-700 dark:text-amber-400",     border: "border-amber-200 dark:border-amber-900/50",     icon: HelpCircle },
    Failed:  { bg: "bg-red-50 dark:bg-red-950/30",         text: "text-red-700 dark:text-red-400",         border: "border-red-200 dark:border-red-900/50",         icon: XCircle },
  };
  const s = map[status] || map.Paid;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
      <Icon size={11} />
      {status}
    </span>
  );
}

function Card({ children, className = "", onClick, hover = false }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: "0 12px 40px rgba(0,0,0,0.15)" } : {}}
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}

function Input({ label, error, className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">{label}</label>}
      <input
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all outline-none
          ${error
            ? "border-red-400 dark:border-red-900 bg-red-50 dark:bg-red-950/10 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-950"
            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:focus:border-indigo-600"
          } text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Button({ children, variant = "primary", size = "md", className = "", ...props }) {
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/40 border border-indigo-500/10",
    secondary: "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/10",
    ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300",
    danger: "bg-red-500 hover:bg-red-600 text-white border border-red-500/10",
    emerald: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/40 border border-emerald-500/10",
  };
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3 text-sm" };
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center gap-2 font-bold rounded-xl transition-all ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// ─── CHECKOUT MODAL ───────────────────────────────────────────────────────────

function CheckoutModal({ plan, annual, onClose, triggerToast }) {
  const price = annual ? Math.round(plan.monthlyPrice * 0.8) : plan.monthlyPrice;
  const annual_total = price * 12;
  const [form, setForm] = useState({ name: "", email: "", card: "", expiry: "", cvc: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fmtCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (form.card.replace(/\s/g, "").length < 16) e.card = "Enter full 16-digit card number";
    if (form.expiry.length < 5) e.expiry = "MM/YY required";
    if (form.cvc.length < 3) e.cvc = "3-digit CVC required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { 
      setLoading(false); 
      setSuccess(true); 
      triggerToast(`Successfully subscribed to ${plan.name} Plan!`);
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Checkout — {plan.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{annual ? "Annual billing" : "Monthly billing"}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
            <X size={18} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="p-10 flex flex-col items-center gap-4 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center border border-emerald-500/20">
                <Check size={36} className="text-emerald-600 dark:text-emerald-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Payment Successful!</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">You're now on the <strong>{plan.name}</strong> plan. A receipt has been sent to {form.email || "your email"}.</p>
              <Button variant="emerald" className="mt-2" onClick={onClose}>Continue to Dashboard <ArrowRight size={14} /></Button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scroll">
              {/* Invoice summary */}
              <div className="bg-slate-50 dark:bg-slate-850/80 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">{plan.name} Plan ({annual ? "Annual" : "Monthly"})</span>
                  <span className="text-slate-700 dark:text-slate-200 font-medium">{fmt(price)}/mo</span>
                </div>
                {annual && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Annual total</span>
                    <span className="text-slate-700 dark:text-slate-200 font-medium">{fmt(annual_total)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-800 dark:text-slate-100">Due today</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{fmt(annual ? annual_total : price)}</span>
                </div>
                {annual && <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">💰 You save {fmt(plan.monthlyPrice * 12 - annual_total)} vs monthly</p>}
              </div>

              <Input label="Full Name" placeholder="Jane Smith" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} error={errors.name} />
              <Input label="Email" type="email" placeholder="jane@company.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} error={errors.email} />

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1.5">Card Number</label>
                <div className="relative">
                  <input
                    value={form.card}
                    onChange={e => setForm(f => ({ ...f, card: fmtCard(e.target.value) }))}
                    placeholder="4242 4242 4242 4242"
                    className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm transition-all outline-none ${errors.card ? "border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/20 focus:ring-2 focus:ring-red-200" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-400 dark:focus:border-indigo-600"} text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 font-mono`}
                  />
                  <CreditCard size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                {errors.card && <p className="text-xs text-red-500 mt-1">{errors.card}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input label="Expiry" placeholder="MM/YY" value={form.expiry} onChange={e => setForm(f => ({ ...f, expiry: fmtExpiry(e.target.value) }))} error={errors.expiry} />
                <Input label="CVC" placeholder="123" maxLength={3} value={form.cvc} onChange={e => setForm(f => ({ ...f, cvc: e.target.value.replace(/\D/g, "").slice(0, 3) }))} error={errors.cvc} />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <Shield size={12} /> Secured by 256-bit SSL encryption
              </div>

              <Button variant="primary" className="w-full justify-center" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <><CreditCard size={15} /> Pay {fmt(annual ? annual_total : price)}</>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ─── TRANSACTIONS RECEIPT MODAL ───────────────────────────────────────────────

function ReceiptModal({ transaction, onClose }) {
  const subtotal = transaction.items.reduce((s, i) => s + i.qty * i.price, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md no-print"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Transaction Invoice</h2>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">{transaction.id}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400 block mb-1">Customer / Client</span>
              <span className="font-bold text-slate-900 dark:text-white text-base">{transaction.client}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block mb-1">Billing Date</span>
              <span className="text-slate-700 dark:text-slate-200 font-semibold">{fmtDate(transaction.date)}</span>
            </div>
          </div>

          <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60">
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase">Item Description</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-slate-400 uppercase w-16">Qty</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-slate-400 uppercase w-28">Unit Price</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-slate-400 uppercase w-28">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {transaction.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-200 font-medium">{item.desc}</td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">{item.qty}</td>
                    <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{fmt(item.price)}</td>
                    <td className="px-4 py-3 text-right text-slate-900 dark:text-white font-bold">{fmt(item.qty * item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2 ml-auto max-w-[240px]">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Subtotal</span>
              <span className="text-slate-700 dark:text-slate-200">{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">VAT / Tax (10%)</span>
              <span className="text-slate-700 dark:text-slate-200">{fmt(tax)}</span>
            </div>
            <div className="flex justify-between font-black text-lg border-t border-slate-250 dark:border-slate-800 pt-2">
              <span className="text-slate-900 dark:text-white">Total Paid</span>
              <span className="text-emerald-600 dark:text-emerald-400">{fmt(total)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={onClose}>Close</Button>
            <Button variant="primary" onClick={() => window.print()}><Printer size={14} /> Print Receipt</Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── PRICING SECTION ─────────────────────────────────────────────────────────

function PricingSection({ triggerToast }) {
  const [annual, setAnnual] = useState(false);
  const [checkout, setCheckout] = useState(null);

  return (
    <div className="space-y-8">
      {/* Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm font-medium transition-colors ${!annual ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"}`}>Monthly</span>
        <motion.button
          onClick={() => setAnnual(a => !a)}
          className={`relative w-14 h-7 rounded-full transition-colors ${annual ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"}`}
        >
          <motion.div animate={{ x: annual ? 28 : 4 }} transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm" />
        </motion.button>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium transition-colors ${annual ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"}`}>Annual</span>
          <AnimatePresence>
            {annual && (
              <motion.span initial={{ opacity: 0, scale: 0.7, x: -8 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.7 }}
                className="text-xs font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/10">
                Save 20%
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan, i) => {
          const price = annual ? Math.round(plan.monthlyPrice * 0.8) : plan.monthlyPrice;
          const Icon = plan.icon;
          return (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`relative flex flex-col rounded-2xl p-6 border transition-all duration-300
                ${plan.popular
                  ? "border-indigo-400 dark:border-indigo-600 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950/30 dark:to-slate-900 shadow-xl shadow-indigo-100 dark:shadow-indigo-900/30 dark:shadow-[0_0_25px_rgba(79,70,229,0.15)]"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-indigo-300 dark:shadow-indigo-900/50 flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> Most Popular
                  </span>
                </div>
              )}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4
                ${plan.popular ? "bg-indigo-600 text-white shadow-md shadow-indigo-300 dark:shadow-indigo-900/30" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}>
                <Icon size={18} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-5">{plan.description}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-slate-900 dark:text-white">
                  <motion.span key={`${price}-${plan.name}`} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 300 }}>
                    ${price}
                  </motion.span>
                </span>
                <span className="text-sm text-slate-400 dark:text-slate-500">/mo</span>
                {annual && <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold ml-1">–20%</span>}
              </div>
              <ul className="space-y-2.5 mb-7 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0
                      ${plan.popular ? "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400" : "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"}`}>
                      <Check size={10} strokeWidth={3} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.popular ? "primary" : "secondary"}
                className="w-full justify-center"
                onClick={() => setCheckout(plan)}
              >
                Choose {plan.name} <ArrowRight size={14} />
              </Button>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {checkout && <CheckoutModal plan={checkout} annual={annual} onClose={() => setCheckout(null)} triggerToast={triggerToast} />}
      </AnimatePresence>
    </div>
  );
}

// ─── INVOICE BUILDER ──────────────────────────────────────────────────────────

const emptyLine = () => ({ id: Date.now() + Math.random(), description: "", qty: 1, price: 0 });

function InvoiceBuilder({ triggerToast }) {
  const [meta, setMeta] = useState({ sender: "FinFlow Inc.", client: "", invoiceNo: "INV-2024-042", issued: new Date().toISOString().slice(0, 10), due: "" });
  const [items, setItems] = useState([{ id: 1, description: "Design & Development", qty: 2, price: 2500 }, { id: 2, description: "Monthly Support Retainer", qty: 1, price: 800 }]);
  const [taxRate] = useState(10);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [codeMsg, setCodeMsg] = useState(null);
  const [errors, setErrors] = useState({});

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const discountAmt = (subtotal * appliedDiscount) / 100;
  const taxAmt = ((subtotal - discountAmt) * taxRate) / 100;
  const total = subtotal - discountAmt + taxAmt;

  const updateItem = (id, field, value) =>
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  const removeItem = (id) => setItems(items.filter(i => i.id !== id));
  const addItem = () => setItems([...items, emptyLine()]);

  const applyCode = () => {
    const pct = DISCOUNT_CODES[discountCode.toUpperCase()];
    if (pct) { 
      setAppliedDiscount(pct); 
      setCodeMsg({ ok: true, msg: `✓ ${pct}% discount applied!` }); 
      triggerToast(`Discount Code Applied: ${pct}% Off!`);
    }
    else { 
      setAppliedDiscount(0); 
      setCodeMsg({ ok: false, msg: "Invalid code. Try SAVE10, LAUNCH20, or VIP30" }); 
    }
  };

  const validateAndPrint = () => {
    const e = {};
    if (!meta.client.trim()) e.client = "Client name is required";
    if (!meta.due) e.due = "Due date is required";
    const hasEmpty = items.some(i => !i.description.trim() || i.price <= 0);
    if (hasEmpty) e.items = "All line items need a description and price";
    setErrors(e);
    if (Object.keys(e).length === 0) {
      triggerToast("Preparing invoice document...");
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Print styles injected */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #invoice-print, #invoice-print * { visibility: visible !important; }
          #invoice-print { position: fixed; left: 0; top: 0; width: 100%; background: white !important; color: black !important; padding: 40px; box-shadow: none !important; border: none !important; border-radius: 0 !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Controls */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input label="Your Company" placeholder="FinFlow Inc." value={meta.sender} onChange={e => setMeta(m => ({ ...m, sender: e.target.value }))} />
        <Input label="Client Name" placeholder="Acme Corp" value={meta.client} onChange={e => setMeta(m => ({ ...m, client: e.target.value }))} error={errors.client} />
        <Input label="Invoice #" value={meta.invoiceNo} onChange={e => setMeta(m => ({ ...m, invoiceNo: e.target.value }))} />
        <Input label="Issue Date" type="date" value={meta.issued} onChange={e => setMeta(m => ({ ...m, issued: e.target.value }))} />
        <Input label="Due Date" type="date" value={meta.due} onChange={e => setMeta(m => ({ ...m, due: e.target.value }))} error={errors.due} />
      </div>

      {/* Invoice preview Container */}
      <div id="invoice-print" className="bg-white dark:bg-slate-900/40 dark:backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl transition-all duration-300">
        {/* Invoice header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-indigo-650 rounded-lg flex items-center justify-center shadow-md">
                <FileText size={14} className="text-white" />
              </div>
              <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{meta.sender || "Your Company"}</span>
            </div>
            <p className="text-xs text-slate-400">hello@finflow.io · finflow.io</p>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">INVOICE</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-mono">#{meta.invoiceNo}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 border-b border-slate-100 dark:border-slate-800/80 pb-6">
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Bill To</p>
            <p className="text-base font-bold text-slate-900 dark:text-white">{meta.client || "—"}</p>
          </div>
          <div className="text-left sm:text-right">
            <div className="space-y-1">
              <div className="flex justify-start sm:justify-end gap-6 text-sm">
                <span className="text-slate-400">Issued</span>
                <span className="text-slate-750 dark:text-slate-200 font-semibold">{meta.issued ? fmtDate(meta.issued) : "—"}</span>
              </div>
              <div className="flex justify-start sm:justify-end gap-6 text-sm">
                <span className="text-slate-400">Due Date</span>
                <span className="text-slate-750 dark:text-slate-200 font-semibold">{meta.due ? fmtDate(meta.due) : "—"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Line items table wrapped to prevent responsive layout stretch */}
        <div className="table-responsive-container custom-scroll mb-6 rounded-xl border border-slate-150 dark:border-slate-800">
          <table className="w-full text-sm min-w-[600px] sm:min-w-0">
            <thead className="bg-slate-55 dark:bg-slate-800/70 border-b border-slate-100 dark:border-slate-850">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Description</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-20">Qty</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-28">Unit Price</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-28">Total</th>
                <th className="w-10 no-print" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.tr key={item.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                    <td className="px-4 py-2.5">
                      <input value={item.description} onChange={e => updateItem(item.id, "description", e.target.value)}
                        className="w-full bg-transparent text-slate-700 dark:text-slate-200 outline-none focus:bg-slate-100/50 dark:focus:bg-slate-800/40 rounded px-1.5 py-1 transition-all text-sm font-semibold"
                        placeholder="Item description…" />
                    </td>
                    <td className="px-4 py-2.5">
                      <input type="number" min="1" value={item.qty} onChange={e => updateItem(item.id, "qty", Math.max(1, +e.target.value))}
                        className="w-full text-center bg-transparent text-slate-750 dark:text-slate-200 outline-none focus:bg-slate-100/50 dark:focus:bg-slate-800/40 rounded px-1.5 py-1 transition-all text-sm font-semibold" />
                    </td>
                    <td className="px-4 py-2.5">
                      <input type="number" min="0" value={item.price} onChange={e => updateItem(item.id, "price", +e.target.value)}
                        className="w-full text-right bg-transparent text-slate-755 dark:text-slate-200 outline-none focus:bg-slate-100/50 dark:focus:bg-slate-800/40 rounded px-1.5 py-1 transition-all text-sm font-semibold" />
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-slate-800 dark:text-slate-100">{fmt(item.qty * item.price)}</td>
                    <td className="px-2 no-print text-center">
                      <motion.button whileTap={{ scale: 0.85 }} onClick={() => removeItem(item.id)}
                        className="p-1.5 rounded-lg text-slate-300 dark:text-slate-650 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all opacity-100 sm:opacity-0 group-hover:opacity-100">
                        <Trash2 size={13} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {errors.items && <p className="text-xs text-red-500 px-4 py-2 bg-red-50 dark:bg-red-950/20">{errors.items}</p>}
        </div>

        <button onClick={addItem} className="no-print flex items-center gap-2 text-sm text-indigo-650 dark:text-indigo-400 hover:text-indigo-755 font-bold mb-6 transition-colors">
          <Plus size={14} /> Add Line Item
        </button>

        {/* Discount code */}
        <div className="no-print flex gap-2 mb-6 max-w-sm">
          <input value={discountCode} onChange={e => setDiscountCode(e.target.value)}
            placeholder="Discount code (e.g. SAVE10)"
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm text-slate-850 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 placeholder:text-slate-400 dark:placeholder:text-slate-650" />
          <Button variant="secondary" size="sm" onClick={applyCode}><Tag size={13} /> Apply</Button>
        </div>
        {codeMsg && (
          <p className={`text-xs mb-4 font-bold ${codeMsg.ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>{codeMsg.msg}</p>
        )}

        {/* Totals */}
        <div className="ml-auto max-w-xs space-y-2.5 border-t border-slate-100 dark:border-slate-800 pt-4">
          {[
            { label: "Subtotal", value: fmt(subtotal) },
            ...(appliedDiscount ? [{ label: `Discount (${appliedDiscount}%)`, value: `–${fmt(discountAmt)}`, color: "text-emerald-650 dark:text-emerald-400 font-semibold" }] : []),
            { label: `Tax (${taxRate}%)`, value: fmt(taxAmt) },
          ].map(r => (
            <div key={r.label} className="flex justify-between text-sm">
              <span className="text-slate-400 dark:text-slate-500">{r.label}</span>
              <span className={r.color || "text-slate-750 dark:text-slate-250"}>{r.value}</span>
            </div>
          ))}
          <div className="flex justify-between font-black text-base pt-2 border-t border-slate-200 dark:border-slate-750">
            <span className="text-slate-900 dark:text-white">Total</span>
            <motion.span key={total} initial={{ scale: 1.1, color: "#4f46e5" }} animate={{ scale: 1, color: "inherit" }} className="text-indigo-650 dark:text-indigo-400">
              {fmt(total)}
            </motion.span>
          </div>
        </div>
      </div>

      <div className="no-print flex justify-end">
        <Button variant="primary" onClick={validateAndPrint}>
          <Printer size={15} /> Print & Download PDF
        </Button>
      </div>
    </div>
  );
}

// ─── TRANSACTIONS ─────────────────────────────────────────────────────────────

function Transactions({ triggerToast, onViewReceipt }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = TRANSACTIONS.filter(t => {
    const matchSearch = t.client.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by client or invoice ID…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 placeholder:text-slate-400 dark:placeholder:text-slate-650" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 cursor-pointer">
            {["All", "Paid", "Pending", "Failed"].map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <Card>
        <div className="table-responsive-container custom-scroll">
          <table className="w-full min-w-[650px] sm:min-w-0">
            <thead>
              <tr className="border-b border-slate-150 dark:border-slate-800">
                {["Invoice ID", "Client", "Date", "Amount", "Status", "Receipt"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
              <AnimatePresence>
                {filtered.map((t, i) => (
                  <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-sm text-indigo-600 dark:text-indigo-400 font-semibold">{t.id}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-200">{t.client}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-400 dark:text-slate-500">{fmtDate(t.date)}</td>
                    <td className="px-5 py-3.5 text-sm font-black text-slate-800 dark:text-slate-100">{fmt(t.amount)}</td>
                    <td className="px-5 py-3.5"><Badge status={t.status} /></td>
                    <td className="px-5 py-3.5">
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => onViewReceipt(t)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-250 dark:border-indigo-900/50 text-indigo-650 dark:text-indigo-400 text-xs font-bold"
                      >
                        View Receipt
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-14 text-center text-slate-400 text-sm">No transactions found</div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl p-3 shadow-2xl text-sm">
      <p className="font-bold text-slate-800 dark:text-slate-100 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-bold">{p.name}: {fmt(p.value)}</p>
      ))}
    </div>
  );
};

function Analytics() {
  const [view, setView] = useState("Revenue");
  const total = REVENUE_DATA.reduce((s, d) => s + d[view], 0);
  const avg = Math.round(total / 12);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:items-center justify-between">
        <div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{fmt(total)}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-0.5">Total {view} · 2024 &nbsp;·&nbsp; Avg {fmt(avg)}/mo</div>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1 w-max">
          {["Revenue", "Expenses"].map(v => (
            <motion.button key={v} onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${view === v ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md" : "text-slate-500 dark:text-slate-450"}`}>
              {v}
            </motion.button>
          ))}
        </div>
      </div>

      <Card className="p-6 shadow-2xl bg-white dark:bg-slate-900/30 dark:backdrop-blur-xl border border-slate-200 dark:border-slate-800/80">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={REVENUE_DATA} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={view === "Revenue" ? "#4f46e5" : "#ef4444"} stopOpacity={0.15} />
                <stop offset="95%" stopColor={view === "Revenue" ? "#4f46e5" : "#ef4444"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={48} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey={view} stroke={view === "Revenue" ? "#4f46e5" : "#ef4444"}
              strokeWidth={2.5} fill="url(#grad)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Summary cards with elegant highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Best Month", value: fmt(Math.max(...REVENUE_DATA.map(d => d[view]))), icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/20", hoverBorder: "hover:border-emerald-350 hover:shadow-emerald-950/10" },
          { label: "Worst Month", value: fmt(Math.min(...REVENUE_DATA.map(d => d[view]))), icon: TrendingDown, color: "text-red-500 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/20", hoverBorder: "hover:border-red-350 hover:shadow-red-950/10" },
          { label: "YoY Growth", value: "+28.4%", icon: ArrowUpRight, color: "text-indigo-650 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/20", hoverBorder: "hover:border-indigo-350 hover:shadow-indigo-950/10" },
          { label: "Total Annual", value: fmt(total), icon: DollarSign, color: "text-slate-700 dark:text-slate-200", bg: "bg-slate-100 dark:bg-slate-800", hoverBorder: "hover:border-slate-350 hover:shadow-slate-950/10" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} whileHover={{ y: -3 }} className={`bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm transition-all duration-355 ${s.hoverBorder}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${s.bg} ${s.color} border border-transparent`}>
                <Icon size={15} />
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{s.value}</div>
              <div className="text-xs text-slate-400 mt-0.5 font-semibold">{s.label}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "pricing",      label: "Pricing Plans", icon: Zap },
  { id: "invoice",      label: "Invoice Builder", icon: FileText },
  { id: "transactions", label: "Transactions", icon: Clock },
  { id: "analytics",    label: "Analytics Insights", icon: BarChart2 },
];

export default function FinFlowPortal() {
  const [dark, setDark] = useDark();
  const [activeTab, setActiveTab] = useState("pricing");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Success Notification state
  const [toastAlert, setToastAlert] = useState(null);
  const triggerToast = (message) => {
    setToastAlert(message);
    setTimeout(() => setToastAlert(null), 3000);
  };

  const tabs = { pricing: PricingSection, invoice: InvoiceBuilder, transactions: Transactions, analytics: Analytics };
  const ActiveComponent = tabs[activeTab];

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex flex-col lg:flex-row`}>
      {/* Toast alert popup */}
      <AnimatePresence>
        {toastAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-6 right-6 z-[100] bg-indigo-650 dark:bg-indigo-600 text-white font-bold px-5 py-3 rounded-2xl shadow-2xl border border-indigo-500/20 flex items-center gap-2"
          >
            <CheckCircle2 size={16} />
            <span className="text-sm">{toastAlert}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <div className="no-print fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-40 hidden lg:flex">
        {/* Logo */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50">
              <DollarSign size={18} className="text-white" />
            </div>
            <div>
              <div className="font-black text-slate-900 dark:text-white text-base tracking-tight">FinFlow</div>
              <div className="text-xs text-slate-400 dark:text-slate-500">Billing Portal</div>
            </div>
          </div>
        </div>

        {/* Nav list */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <motion.button key={item.id} onClick={() => setActiveTab(item.id)} whileTap={{ scale: 0.97 }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
                  ${active ? "bg-indigo-650 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/40" : "text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"}`}>
                <Icon size={16} />
                {item.label}
                {active && <motion.div layoutId="sidebar-dot" className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />}
              </motion.button>
            );
          })}
        </nav>

        {/* Dark mode toggle & developer user info */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setDark(d => !d)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            {dark ? "Light Mode" : "Dark Mode"}
          </motion.button>
          <div className="flex items-center gap-3 px-4 py-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">JD</div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">Jane Doe</div>
              <div className="text-xs text-slate-400 dark:text-slate-550 truncate font-semibold">Growth Plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE HEADER TOPBAR (Completely responsive menu toggle) */}
      <div className="no-print lg:hidden sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 w-full flex items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
              <DollarSign size={14} className="text-white" />
            </div>
            <span className="font-black text-slate-900 dark:text-white text-sm">FinFlow</span>
          </div>
        </div>

        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setDark(d => !d)}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </motion.button>
      </div>

      {/* MOBILE SIDEBAR MENU DRAWER OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm lg:hidden"
            />
            {/* Drawer sheet */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-50 p-4 gap-6 lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
                    <DollarSign size={16} className="text-white" />
                  </div>
                  <span className="font-black text-slate-900 dark:text-white text-base">FinFlow</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {NAV_ITEMS.map(item => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
                        ${active ? "bg-indigo-650 text-white shadow-md shadow-indigo-200" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80"}`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div className="border-t border-slate-150 dark:border-slate-800 pt-4 space-y-3">
                <div className="flex items-center gap-3 px-4">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">JD</div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">Jane Doe</div>
                    <div className="text-xs text-slate-400 dark:text-slate-550 truncate font-semibold">Growth Plan</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN VIEW CONTENT */}
      <div className="flex-1 lg:ml-64 min-w-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
          {/* Page header */}
          <div className="no-print mb-8">
            <motion.h1 key={activeTab} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {activeTab === "pricing" && "Choose Your Plan"}
              {activeTab === "invoice" && "Invoice Builder"}
              {activeTab === "transactions" && "Transaction History"}
              {activeTab === "analytics" && "Financial Analytics"}
            </motion.h1>
            <motion.p key={`sub-${activeTab}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm sm:text-base font-medium">
              {activeTab === "pricing" && "Simple, transparent pricing. Upgrade or downgrade anytime."}
              {activeTab === "invoice" && "Create and send professional invoices in seconds."}
              {activeTab === "transactions" && "Track and manage all your billing activity."}
              {activeTab === "analytics" && "Deep insights into your revenue and spending."}
            </motion.p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}>
              {/* Dynamic render components mapping */}
              {activeTab === "pricing" && <PricingSection triggerToast={triggerToast} />}
              {activeTab === "invoice" && <InvoiceBuilder triggerToast={triggerToast} />}
              {activeTab === "transactions" && <Transactions triggerToast={triggerToast} onViewReceipt={setSelectedReceipt} />}
              {activeTab === "analytics" && <Analytics />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* DYNAMIC RECEIPT MODAL FOR ROW CLICKS IN TRANSACTIONS */}
      <AnimatePresence>
        {selectedReceipt && <ReceiptModal transaction={selectedReceipt} onClose={() => setSelectedReceipt(null)} />}
      </AnimatePresence>
    </div>
  );
}

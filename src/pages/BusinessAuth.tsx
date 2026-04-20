import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Mail, Lock, User, Phone, Loader2, ArrowLeft } from "lucide-react";
import { useBusinessAuth } from "@/hooks/useBusinessAuth";
import { Link } from "react-router-dom";

export default function BusinessAuth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, signup } = useBusinessAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    owner_name: "", email: "", password: "",
    business_name: "", phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await signup(form);
      }
      navigate("/business/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to 123kids.com
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Business Portal</h1>
            <p className="text-sm text-gray-500">123kids.com for Businesses</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1">
          <button onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === "login" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}>
            Sign In
          </button>
          <button onClick={() => setMode("signup")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === "signup" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}>
            Create Account
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Your name *" required
                  value={form.owner_name} onChange={e => setForm({...form, owner_name: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Business name *" required
                  value={form.business_name} onChange={e => setForm({...form, business_name: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" placeholder="Phone number"
                  value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="email" placeholder="Email address *" required
              value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="password" placeholder="Password *" required
              value={form.password} onChange={e => setForm({...form, password: e.target.value})}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Please wait...</> : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 mt-6">
          By continuing you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

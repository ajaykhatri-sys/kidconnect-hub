import { useState, useEffect, createContext, useContext } from "react";

const API_BASE = "https://123kids-api.ajay-khatri.workers.dev";

export interface Business {
  id: string;
  owner_name: string;
  email: string;
  business_name: string;
  phone: string;
  stripe_account_id: string;
  stripe_onboarding_complete: number;
  status: string;
}

interface BusinessAuthContextType {
  business: Business | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface SignupData {
  owner_name: string;
  email: string;
  password: string;
  business_name: string;
  phone: string;
}

const BusinessAuthContext = createContext<BusinessAuthContextType | null>(null);

export function BusinessAuthProvider({ children }: { children: React.ReactNode }) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = sessionStorage.getItem("biz_token");
    const savedBusiness = sessionStorage.getItem("biz_data");
    if (savedToken && savedBusiness) {
      setToken(savedToken);
      setBusiness(JSON.parse(savedBusiness));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/business/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Login failed");
    setToken(data.token);
    setBusiness(data.business);
    sessionStorage.setItem("biz_token", data.token);
    sessionStorage.setItem("biz_data", JSON.stringify(data.business));
  };

  const signup = async (formData: SignupData) => {
    const res = await fetch(`${API_BASE}/api/business/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Signup failed");
    setToken(data.token);
    setBusiness(data.business);
    sessionStorage.setItem("biz_token", data.token);
    sessionStorage.setItem("biz_data", JSON.stringify(data.business));
  };

  const logout = () => {
    setToken(null);
    setBusiness(null);
    sessionStorage.removeItem("biz_token");
    sessionStorage.removeItem("biz_data");
  };

  return (
    <BusinessAuthContext.Provider value={{ business, token, login, signup, logout, loading }}>
      {children}
    </BusinessAuthContext.Provider>
  );
}

export function useBusinessAuth() {
  const context = useContext(BusinessAuthContext);
  if (!context) throw new Error("useBusinessAuth must be used within BusinessAuthProvider");
  return context;
}

export function useBusinessApi() {
  const { token } = useBusinessAuth();
  return async (path: string, options: RequestInit = {}) => {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers as Record<string, string> || {}),
      },
    });
    return res.json();
  };
}

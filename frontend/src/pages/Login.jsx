import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../api/axios.js";
import bgImage from "../assets/login-bg.png";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      setMsg("Login Successful");

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Login Failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#0f172a] text-[#f8fafc] font-outfit overflow-hidden absolute inset-0">
      {/* Decorative gradient background element */}
      <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] bg-[radial-gradient(circle,_rgba(139,92,246,0.15)_0%,_rgba(15,23,42,0)_70%)] rounded-full pointer-events-none z-0"></div>

      <div className="flex-1 flex items-center justify-center p-8 z-10 relative">
        <div className="w-full max-w-[440px] bg-slate-800/40 backdrop-blur-xl border border-white/10 p-12 rounded-[24px] shadow-2xl animate-[fadeIn_0.8s_ease-out_forwards] opacity-0 translate-y-5">
          <div className="mb-8 text-left">
            <h2 className="text-[2.25rem] font-bold mb-2 bg-gradient-to-br from-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-400 text-base m-0">
              Enter your details to access your account.
            </p>
          </div>

          {msg && (
            <div className={`p-3.5 rounded-xl mb-6 text-[0.9rem] text-center font-medium animate-[slideDown_0.3s_ease-out] ${
              msg === "Login Successful" 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3.5 text-slate-50 text-base transition-all duration-300 outline-none focus:border-violet-500 focus:bg-slate-900/80 focus:ring-4 focus:ring-violet-500/15 placeholder:text-slate-600"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3.5 text-slate-50 text-base transition-all duration-300 outline-none focus:border-violet-500 focus:bg-slate-900/80 focus:ring-4 focus:ring-violet-500/15 placeholder:text-slate-600"
                required
              />
            </div>

            <div className="flex justify-end -mt-2">
              <a href="#" className="text-violet-500 text-sm no-underline font-medium transition-colors duration-200 hover:text-violet-400">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className={`bg-gradient-to-br from-violet-500 to-indigo-500 text-white border-none rounded-xl p-4 text-base font-semibold cursor-pointer mt-4 transition-all duration-300 relative overflow-hidden shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] active:translate-y-[1px] disabled:opacity-80 disabled:cursor-not-allowed disabled:hover:transform-none`}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center text-[0.9rem] text-slate-400">
            <p>
              Don't have an account? 
              <a href="/signup" className="text-violet-500 no-underline font-semibold ml-1 transition-colors duration-200 hover:text-violet-400">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="flex-[1.2] relative hidden lg:block overflow-hidden">
        <img 
          src={bgImage} 
          alt="E-commerce abstract background" 
          className="absolute inset-0 w-full h-full object-cover object-center animate-[subtleScale_20s_ease-in-out_infinite_alternate]" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-slate-900/10 flex flex-col justify-end p-16">
          <h3 className="text-white text-[2.5rem] font-bold mb-4 leading-[1.2] drop-shadow-md">
            Elevate Your Shopping
          </h3>
          <p className="text-slate-300 text-[1.125rem] max-w-[80%] m-0 leading-normal drop-shadow-sm">
            Discover premium products curated just for you.
          </p>
        </div>
      </div>
    </div>
  );
}

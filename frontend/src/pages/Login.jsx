import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../api/axios.js";
import bgImage from "../assets/login-bg.png";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("userId", res.data.user.id);
      window.dispatchEvent(new Event("auth-changed"));
      setMsg("Login Successful");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Login Failed");
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
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-4 pr-12 py-3.5 text-slate-50 text-base transition-all duration-300 outline-none focus:border-violet-500 focus:bg-slate-900/80 focus:ring-4 focus:ring-violet-500/15 placeholder:text-slate-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-white focus:outline-none flex items-center justify-center cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.815 7.815 3 3m-3-3a9.79 9.79 0 0 1-4.125 1.012c-4.756 0-8.773-3.162-10.065-7.498a9.79 9.79 0 0 1 1.125-3.307m9.761 2.155a3 3 0 1 1-4.243 4.243" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../api/axios";

export default function CheckoutAddress() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return navigate("/login");
    
    // Simple basic validations
    if (!form.fullName || !form.phone || !form.addressLine || !form.city || !form.state || !form.pincode) {
      setError("Please fill in all the shipping address fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post(
        "/address/add",
        {
          ...form,
          userId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigate("/checkout");
    } catch (err) {
      console.error("Failed to save shipping address:", err);
      setError(err.response?.data?.message || "Failed to save shipping address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0f172a] font-outfit text-slate-50">
      {/* Decorative gradient background elements */}
      <div className="pointer-events-none absolute -left-[18%] -top-[24%] h-[62vw] min-h-[420px] w-[62vw] min-w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(139,92,246,0.14)_0%,_rgba(15,23,42,0)_70%)]" />
      <div className="pointer-events-none absolute -bottom-[10%] -right-[10%] h-[50vw] min-h-[300px] w-[50vw] min-w-[300px] rounded-full bg-[radial-gradient(circle,_rgba(99,102,241,0.08)_0%,_rgba(15,23,42,0)_70%)]" />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="m-0 bg-gradient-to-br from-white to-slate-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
            Shipping Address
          </h1>
          <p className="mb-0 mt-3 text-slate-400">
            Please enter your primary shipping address where we should deliver your items.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 font-medium text-red-300 animate-[slideDown_0.3s_ease-out]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-[24px] border border-white/10 bg-slate-800/40 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="text-sm font-medium text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3.5 text-slate-50 text-base outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:bg-slate-900/80 focus:ring-4 focus:ring-violet-500/15"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-sm font-medium text-slate-300">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3.5 text-slate-50 text-base outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:bg-slate-900/80 focus:ring-4 focus:ring-violet-500/15"
                required
              />
            </div>
          </div>

          {/* Street Address */}
          <div className="flex flex-col gap-2">
            <label htmlFor="addressLine" className="text-sm font-medium text-slate-300">
              Street Address
            </label>
            <input
              type="text"
              id="addressLine"
              name="addressLine"
              value={form.addressLine}
              onChange={handleChange}
              placeholder="123 Main St, Apt 4B"
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3.5 text-slate-50 text-base outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:bg-slate-900/80 focus:ring-4 focus:ring-violet-500/15"
              required
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {/* City */}
            <div className="flex flex-col gap-2">
              <label htmlFor="city" className="text-sm font-medium text-slate-300">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="New York"
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3.5 text-slate-50 text-base outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:bg-slate-900/80 focus:ring-4 focus:ring-violet-500/15"
                required
              />
            </div>

            {/* State */}
            <div className="flex flex-col gap-2">
              <label htmlFor="state" className="text-sm font-medium text-slate-300">
                State / Province
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="NY"
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3.5 text-slate-50 text-base outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:bg-slate-900/80 focus:ring-4 focus:ring-violet-500/15"
                required
              />
            </div>

            {/* Pincode */}
            <div className="flex flex-col gap-2">
              <label htmlFor="pincode" className="text-sm font-medium text-slate-300">
                ZIP / Postal Code
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="10001"
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3.5 text-slate-50 text-base outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:bg-slate-900/80 focus:ring-4 focus:ring-violet-500/15"
                required
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="rounded-xl border border-white/10 px-6 py-3.5 text-base font-semibold text-slate-200 transition hover:border-violet-400/50 hover:bg-white/5 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 px-8 py-3.5 text-base font-semibold text-white shadow-[0_4px_14px_0_rgba(99,102,241,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
            >
              {loading ? "Saving Address..." : "Save & Continue"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
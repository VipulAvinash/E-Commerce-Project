import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import api from "../api/axios";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  
  // Read token exclusively from sessionStorage
  const token = sessionStorage.getItem("token");

  const loadCart = async () => {
    try {
      if (!token) {
        setCartCount(0);
        return;
      }
      const res = await api.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const total = res.data?.items?.reduce(
        (sum, item) => sum + item.quantity, 0
      ) || 0;
      setCartCount(total);
    } catch (error) {
      console.error("Failed to load cart count:", error.message);
      if (error.response?.status === 401) {
        sessionStorage.clear();
        localStorage.clear();
        setCartCount(0);
      }
    }
  };

  useEffect(() => {
    loadCart();
    
    // Listen for custom cart-updated and auth-changed events
    window.addEventListener("cart-updated", loadCart);
    window.addEventListener("auth-changed", loadCart);
    
    return () => {
      window.removeEventListener("cart-updated", loadCart);
      window.removeEventListener("auth-changed", loadCart);
    };
  }, [token]);

  // Reload cart count when page changes to ensure synchronization
  useEffect(() => {
    loadCart();
  }, [location.pathname]);

  const logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    setCartCount(0);
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0f172a]/80 font-outfit text-slate-50 shadow-lg backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link to="/" className="text-2xl font-bold tracking-tight text-white no-underline transition hover:text-violet-400">
          E-Commerce
        </Link>

        <div className="flex items-center gap-5">
          {/* Cart Icon - beside sign in, dynamically badged */}
          <Link
            to="/cart"
            className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-slate-900/40 text-slate-200 transition hover:border-violet-400/50 hover:bg-white/5 hover:text-white"
            aria-label="Shopping Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-[11px] font-bold text-white shadow-lg shadow-violet-500/30 ring-2 ring-slate-900">
                {cartCount}
              </span>
            )}
          </Link>

          <nav className="flex items-center gap-3">
            {token ? (
              <>
                <Link
                  to="/"
                  className="rounded-xl border border-transparent px-4 py-2.5 text-sm font-semibold text-slate-300 no-underline transition hover:bg-white/5 hover:text-white"
                >
                  Products
                </Link>
                <Link
                  to="/admin/products"
                  className="rounded-xl border border-transparent px-4 py-2.5 text-sm font-semibold text-slate-300 no-underline transition hover:bg-white/5 hover:text-white"
                >
                  Admin
                </Link>
                <button
                  onClick={logout}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-300 cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200 no-underline transition hover:border-violet-400/50 hover:bg-white/5 hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white no-underline shadow-[0_4px_14px_0_rgba(99,102,241,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
}
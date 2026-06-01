import { useLocation, Link, useNavigate } from "react-router";
import { useEffect } from "react";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const orderId = location.state?.orderId || "";
  const totalAmount = location.state?.totalAmount || 0;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#0f172a] px-5 py-10 font-outfit text-slate-50">
      {/* Decorative gradient background elements */}
      <div className="pointer-events-none absolute -left-[18%] -top-[24%] h-[62vw] min-h-[420px] w-[62vw] min-w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(139,92,246,0.14)_0%,_rgba(15,23,42,0)_70%)]" />
      <div className="pointer-events-none absolute -bottom-[10%] -right-[10%] h-[50vw] min-h-[300px] w-[50vw] min-w-[300px] rounded-full bg-[radial-gradient(circle,_rgba(99,102,241,0.08)_0%,_rgba(15,23,42,0)_70%)]" />

      <section className="relative z-10 w-full max-w-xl rounded-[24px] border border-white/10 bg-slate-800/40 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12 animate-[fadeIn_0.6s_ease-out_forwards]">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-4 ring-emerald-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-10 w-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>

        <p className="m-0 text-sm font-semibold tracking-wider text-emerald-400 uppercase">Order Placed Successfully</p>
        
        <h1 className="mb-0 mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Thank you for shopping!
        </h1>
        
        <p className="mb-0 mt-4 leading-7 text-slate-400 text-base">
          We've received your order and are getting it ready. Your items will ship shortly.
        </p>

        {orderId && (
          <div className="mt-8 rounded-2xl border border-white/5 bg-slate-900/40 p-5 text-left flex flex-col gap-3.5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</span>
              <span className="text-sm font-bold text-violet-300 font-mono select-all bg-violet-500/10 px-2.5 py-1 rounded-lg border border-violet-500/20">
                {orderId}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Amount</span>
              <span className="text-xl font-bold text-white">
                ${Number(totalAmount).toFixed(2)}
              </span>
            </div>
            
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment Method</span>
              <span className="text-sm font-semibold text-slate-300">
                Cash on Delivery (COD)
              </span>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="flex min-h-12 flex-1 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 px-5 py-3 font-semibold text-white no-underline shadow-[0_4px_14px_0_rgba(99,102,241,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)]"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    </main>
  );
}

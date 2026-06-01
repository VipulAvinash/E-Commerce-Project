import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link, useParams, useNavigate } from "react-router";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const token = sessionStorage.getItem("token");

  const loadProduct = async () => {
    try {
      const res = await api.get(`/products`);
      const prod = res.data.products.find((item) => item._id === id);
      setProduct(prod);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setAdding(true);
      await api.post("/cart/add", { productId: id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.dispatchEvent(new Event("cart-updated"));
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error("Failed to add product to cart:", err);
      alert("Failed to add product to cart.");
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, []);

  if (!product) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0f172a] px-5 font-outfit text-slate-50">
        <div className="pointer-events-none absolute -left-[18%] -top-[24%] h-[62vw] min-h-[420px] w-[62vw] min-w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(139,92,246,0.14)_0%,_rgba(15,23,42,0)_70%)]" />

        <div className="relative z-10 w-full max-w-xl rounded-[24px] border border-white/10 bg-slate-800/40 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-5 h-14 w-14 animate-spin rounded-full border-4 border-violet-400/20 border-t-violet-400" />
          <h1 className="m-0 text-3xl font-bold text-white">Loading product</h1>
          <p className="mb-0 mt-3 text-slate-400">
            Preparing the product details.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0f172a] font-outfit text-slate-50">
      <div className="pointer-events-none absolute -left-[18%] -top-[24%] h-[62vw] min-h-[420px] w-[62vw] min-w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(139,92,246,0.14)_0%,_rgba(15,23,42,0)_70%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10">

        <section className="grid overflow-hidden rounded-[24px] border border-white/10 bg-slate-800/40 shadow-2xl backdrop-blur-xl lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.95fr)]">
          <div className="min-h-[360px] bg-slate-900/70 sm:min-h-[520px]">
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="h-full min-h-[360px] w-full object-cover sm:min-h-[520px]"
              />
            ) : (
              <div className="flex h-full min-h-[360px] items-center justify-center bg-gradient-to-br from-slate-950 to-slate-800 px-8 text-center text-base font-medium text-slate-500 sm:min-h-[520px]">
                Product image unavailable
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-sm font-semibold text-slate-300">
                  {product.category || "Collection"}
                </span>
                <span
                  className={
                    product.stock > 0
                      ? "rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300"
                      : "rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-sm font-semibold text-rose-300"
                  }
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </span>
              </div>

              <div>
                <h1 className="m-0 bg-gradient-to-br from-white to-slate-300 bg-clip-text text-4xl font-bold leading-tight tracking-tight text-transparent sm:text-5xl">
                  {product.title}
                </h1>
                <p className="mb-0 mt-5 text-3xl font-bold text-violet-200">
                  ${Number(product.price || 0).toFixed(2)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/45 p-5">
                <h2 className="m-0 text-lg font-semibold text-slate-100">
                  Description
                </h2>
                <p className="mb-0 mt-3 leading-7 text-slate-400">
                  {product.description ||
                    "Explore this product from our latest collection."}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
              {token ? (
                <button
                  type="button"
                  disabled={product.stock <= 0 || adding}
                  onClick={handleAddToCart}
                  className={`flex min-h-12 flex-1 items-center justify-center rounded-xl px-5 py-3 text-base font-semibold text-white transition-all shadow-[0_4px_14px_0_rgba(99,102,241,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer ${
                    added
                      ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                      : "bg-gradient-to-br from-violet-500 to-indigo-500"
                  }`}
                >
                  {adding
                    ? "Adding to Cart..."
                    : added
                    ? "Added to Cart!"
                    : "Add to Cart"}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex min-h-12 flex-1 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 px-5 py-3 text-base font-semibold text-white no-underline shadow-[0_4px_14px_0_rgba(99,102,241,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)]"
                >
                  Sign In to Shop
                </Link>
              )}
              <Link
                to="/"
                className="flex min-h-12 flex-1 items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-base font-semibold text-slate-200 no-underline transition hover:border-violet-400/50 hover:bg-white/5 hover:text-white"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

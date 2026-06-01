import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router";
import heroImage from "../assets/hero.png";

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [addingId, setAddingId] = useState("");
  const [addedIds, setAddedIds] = useState(new Set());

  const handleAddToCart = async (productId) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setAddingId(productId);
      await api.post("/cart/add", { productId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.dispatchEvent(new Event("cart-updated"));
      setAddedIds(prev => {
        const next = new Set(prev);
        next.add(productId);
        return next;
      });
      setTimeout(() => {
        setAddedIds(prev => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      }, 2000);
    } catch (err) {
      console.error("Failed to add product to cart:", err);
      alert("Failed to add product to cart.");
    } finally {
      setAddingId("");
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await api.get("/products", {
          params: { search, category },
        });

        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Failed to load products:", err);
        setProducts([]);
        setError("Unable to load products right now.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [search, category]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0f172a] font-outfit text-slate-50">
      <div className="pointer-events-none absolute -left-[18%] -top-[24%] h-[62vw] min-h-[420px] w-[62vw] min-w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(139,92,246,0.14)_0%,_rgba(15,23,42,0)_70%)]" />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10">

        <section className="relative min-h-[420px] overflow-hidden rounded-[24px] border border-white/10 shadow-2xl">
          <img
            src={heroImage}
            alt="Featured products"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-900/25" />

          <div className="relative flex min-h-[420px] max-w-2xl flex-col justify-end gap-5 p-6 sm:p-10 lg:p-14">
            <p className="m-0 w-fit rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1 text-sm font-medium text-violet-200">
              Curated collection
            </p>
            <h1 className="m-0 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              Shop premium picks for every day.
            </h1>
            <p className="m-0 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Thoughtful essentials, statement pieces, and daily upgrades in one
              polished collection.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-6 pb-8">
          <div className="flex flex-col gap-5 rounded-[24px] border border-white/10 bg-slate-800/40 p-5 shadow-2xl backdrop-blur-xl lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="m-0 bg-gradient-to-br from-white to-slate-300 bg-clip-text text-3xl font-bold text-transparent">
                Products
              </h2>
              <p className="mb-0 mt-2 text-slate-400">
                {loading ? "Loading collection..." : `${products.length} item${products.length === 1 ? "" : "s"} found`}
              </p>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-2 lg:max-w-2xl">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-300">
                Search
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by title"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-base text-slate-50 outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:bg-slate-900/80 focus:ring-4 focus:ring-violet-500/15"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-300">
                Category
                <input
                  type="text"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  placeholder="Filter by category"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-base text-slate-50 outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:bg-slate-900/80 focus:ring-4 focus:ring-violet-500/15"
                />
              </label>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 font-medium text-red-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="min-h-[410px] animate-pulse rounded-[24px] border border-white/10 bg-slate-800/35 shadow-2xl"
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <article
                  key={product._id}
                  className="flex min-h-[410px] flex-col overflow-hidden rounded-[24px] border border-white/10 bg-slate-800/40 shadow-2xl backdrop-blur-xl transition hover:-translate-y-1 hover:border-violet-400/30"
                >
                  <div className="h-56 overflow-hidden bg-slate-900/70">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-6 text-center text-sm font-medium text-slate-500">
                        Product image unavailable
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-4 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-xs font-semibold text-slate-300">
                        {product.category || "Collection"}
                      </span>
                      <span className="text-lg font-bold text-violet-200">
                        ${Number(product.price || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col gap-3">
                      <h3 className="m-0 text-xl font-semibold leading-7 text-white">
                        {product.title}
                      </h3>
                      <p className="m-0 line-clamp-3 leading-6 text-slate-400">
                        {product.description || "Explore this product from our latest collection."}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                      <span className={product.stock > 0 ? "text-sm font-medium text-emerald-300" : "text-sm font-medium text-rose-300"}>
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                      </span>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/product/${product._id}`}
                          className="rounded-xl border border-white/10 px-3.5 py-2 text-sm font-semibold text-slate-200 no-underline transition hover:border-violet-400/50 hover:bg-white/5 hover:text-white"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          disabled={product.stock <= 0 || addingId === product._id}
                          onClick={() => handleAddToCart(product._id)}
                          className={`rounded-xl px-3.5 py-2 text-sm font-semibold text-white transition-all shadow-[0_4px_12px_0_rgba(99,102,241,0.25)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer ${
                            addedIds.has(product._id)
                              ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                              : "bg-gradient-to-br from-violet-500 to-indigo-500"
                          }`}
                        >
                          {addingId === product._id
                            ? "Adding..."
                            : addedIds.has(product._id)
                            ? "Added!"
                            : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-white/10 bg-slate-800/40 px-6 py-14 text-center shadow-2xl backdrop-blur-xl">
              <h3 className="m-0 text-2xl font-semibold text-white">No products found</h3>
              <p className="mb-0 mt-3 text-slate-400">
                Nothing in this collection matches the current filters.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../api/axios";

export default function Cart() {
  const token = localStorage.getItem("token");
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");

  const loadCart = useCallback(async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const res = await api.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error(err.message);
      setError("Unable to load your cart right now.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const removeItems = async (productId) => {
    try {
      setUpdatingId(productId);
      setError("");
      await api.post(
        "/cart/remove",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      await loadCart();
    } catch (err) {
      console.error(err.message);
      setError("Unable to remove this item.");
    } finally {
      setUpdatingId("");
    }
  };

  const updateItems = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        await removeItems(productId);
        return;
      }

      setUpdatingId(productId);
      setError("");
      await api.post(
        "/cart/update",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      await loadCart();
    } catch (err) {
      console.error(err.message);
      setError("Unable to update the item quantity.");
    } finally {
      setUpdatingId("");
    }
  };

  const items = cart?.items || [];
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + Number(item.productId?.price || 0) * item.quantity,
    0,
  );

  if (!token) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0f172a] px-5 py-10 font-outfit text-slate-50">
        <div className="pointer-events-none absolute -left-[18%] -top-[24%] h-[62vw] min-h-[420px] w-[62vw] min-w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(139,92,246,0.14)_0%,_rgba(15,23,42,0)_70%)]" />

        <section className="relative z-10 w-full max-w-xl rounded-[24px] border border-white/10 bg-slate-800/40 p-7 text-center shadow-2xl backdrop-blur-xl sm:p-10">
          <p className="m-0 text-sm font-semibold text-violet-200">Your cart</p>
          <h1 className="mb-0 mt-3 text-4xl font-bold tracking-tight text-white">
            Sign in to view your cart.
          </h1>
          <p className="mb-0 mt-4 leading-7 text-slate-400">
            Your saved items are available after you access your account.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/login"
              className="flex min-h-12 flex-1 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 px-5 py-3 font-semibold text-white no-underline shadow-[0_4px_14px_0_rgba(99,102,241,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)]"
            >
              Sign In
            </Link>
            <Link
              to="/"
              className="flex min-h-12 flex-1 items-center justify-center rounded-xl border border-white/10 px-5 py-3 font-semibold text-slate-200 no-underline transition hover:border-violet-400/50 hover:bg-white/5 hover:text-white"
            >
              Browse Products
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0f172a] font-outfit text-slate-50">
      <div className="pointer-events-none absolute -left-[18%] -top-[24%] h-[62vw] min-h-[420px] w-[62vw] min-w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(139,92,246,0.14)_0%,_rgba(15,23,42,0)_70%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-6 sm:px-8 lg:px-10">

        <section className="flex flex-col gap-2">
          <h1 className="m-0 bg-gradient-to-br from-white to-slate-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
            Shopping Cart
          </h1>
          <p className="m-0 text-slate-400">
            {loading
              ? "Loading your items..."
              : `${itemCount} item${itemCount === 1 ? "" : "s"} ready`}
          </p>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 font-medium text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-h-[420px] animate-pulse rounded-[24px] border border-white/10 bg-slate-800/35 shadow-2xl" />
            <div className="min-h-[320px] animate-pulse rounded-[24px] border border-white/10 bg-slate-800/35 shadow-2xl" />
          </section>
        ) : items.length === 0 ? (
          <section className="rounded-[24px] border border-white/10 bg-slate-800/40 px-6 py-16 text-center shadow-2xl backdrop-blur-xl">
            <h2 className="m-0 text-3xl font-semibold text-white">Your cart is empty</h2>
            <p className="mb-0 mt-3 text-slate-400">
              The collection is waiting when you are ready to pick something.
            </p>
            <Link
              to="/"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 px-6 py-3 font-semibold text-white no-underline shadow-[0_4px_14px_0_rgba(99,102,241,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)]"
            >
              Shop Products
            </Link>
          </section>
        ) : (
          <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="flex flex-col gap-4">
              {items.map((item) => {
                const product = item.productId;
                const productId = product?._id || item.productId;
                const disabled = updatingId === productId;

                return (
                  <article
                    key={productId}
                    className="grid gap-5 rounded-[24px] border border-white/10 bg-slate-800/40 p-4 shadow-2xl backdrop-blur-xl sm:grid-cols-[180px_minmax(0,1fr)] sm:p-5"
                  >
                    <div className="h-52 overflow-hidden rounded-2xl bg-slate-900/70 sm:h-full sm:min-h-[190px]">
                      {product?.image ? (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-950 to-slate-800 px-5 text-center text-sm font-medium text-slate-500">
                          Product image unavailable
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-col justify-between gap-5">
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <span className="inline-flex rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-xs font-semibold text-slate-300">
                              {product?.category || "Collection"}
                            </span>
                            <h2 className="mb-0 mt-3 text-2xl font-semibold leading-8 text-white">
                              {product?.title || "Product unavailable"}
                            </h2>
                          </div>
                          <p className="m-0 text-2xl font-bold text-violet-200">
                            ${Number(product?.price || 0).toFixed(2)}
                          </p>
                        </div>

                        <p className="m-0 line-clamp-2 leading-6 text-slate-400">
                          {product?.description ||
                            "This product is currently missing its details."}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                        <div className="flex h-12 items-center overflow-hidden rounded-xl border border-white/10 bg-slate-900/60">
                          <button
                            type="button"
                            aria-label={`Decrease ${product?.title || "product"} quantity`}
                            disabled={disabled}
                            onClick={() => updateItems(productId, item.quantity - 1)}
                            className="h-12 w-12 border-0 bg-transparent text-2xl text-slate-200 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="flex h-12 min-w-12 items-center justify-center border-x border-white/10 px-3 font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase ${product?.title || "product"} quantity`}
                            disabled={disabled}
                            onClick={() => updateItems(productId, item.quantity + 1)}
                            className="h-12 w-12 border-0 bg-transparent text-2xl text-slate-200 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => removeItems(productId)}
                          className="min-h-12 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 font-semibold text-rose-300 transition hover:bg-rose-400/20 hover:text-rose-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="h-fit rounded-[24px] border border-white/10 bg-slate-800/40 p-6 shadow-2xl backdrop-blur-xl">
              <h2 className="m-0 text-2xl font-semibold text-white">Order Summary</h2>

              <div className="mt-6 flex flex-col gap-4 border-y border-white/10 py-5 text-slate-300">
                <div className="flex items-center justify-between gap-4">
                  <span>Items</span>
                  <span className="font-semibold text-white">{itemCount}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="text-lg font-semibold text-slate-200">Total</span>
                <span className="text-3xl font-bold text-violet-200">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <Link
                to="/checkout-address"
                className="mt-6 flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 px-5 py-3 text-base font-semibold text-white no-underline shadow-[0_4px_14px_0_rgba(99,102,241,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)]"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/"
                className="mt-3 flex min-h-12 w-full items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-base font-semibold text-slate-200 no-underline transition hover:border-violet-400/50 hover:bg-white/5 hover:text-white"
              >
                Continue Shopping
              </Link>
            </aside>
          </section>
        )}
      </div>
    </main>
  );
}

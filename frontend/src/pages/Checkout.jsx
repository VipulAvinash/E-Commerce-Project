import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import api from "../api/axios";

export default function Checkout() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId");

  const [addresses, setAddresses] = useState([]);
  const [cart, setCart] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      // Load cart
      const cartRes = await api.get("/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(cartRes.data);

      // Load addresses
      const addressRes = await api.get(`/address/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(addressRes.data || []);
      
      if (addressRes.data && addressRes.data.length > 0) {
        setSelectedAddressId(addressRes.data[0]._id);
      }
    } catch (err) {
      console.error("Failed to load checkout details:", err);
      setError("Unable to prepare checkout. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    loadData();
  }, [token, userId, navigate]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError("Please select a shipping address before placing your order.");
      return;
    }

    const selectedAddress = addresses.find((a) => a._id === selectedAddressId);
    if (!selectedAddress) {
      setError("Selected address details are missing.");
      return;
    }

    setPlacing(true);
    setError("");

    try {
      const res = await api.post(
        "/order/place",
        {
          userId,
          address: {
            fullName: selectedAddress.fullName,
            phone: selectedAddress.phone,
            addressLine: selectedAddress.addressLine,
            city: selectedAddress.city,
            state: selectedAddress.state,
            pincode: selectedAddress.pincode
          },
          paymentMethod: "COD"
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Trigger dynamic Navbar cart badge refresh
      window.dispatchEvent(new Event("cart-updated"));
      
      // Redirect to standalone Order Success page
      navigate("/order-success", {
        state: {
          orderId: res.data.order._id,
          totalAmount: res.data.order.totalAmount
        }
      });
    } catch (err) {
      console.error("Failed to place order:", err);
      setError(err.response?.data?.message || "Unable to process your order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const items = cart?.items || [];
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + Number(item.productId?.price || 0) * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% estimated tax
  const finalTotal = subtotal + tax;



  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0f172a] font-outfit text-slate-50">
      <div className="pointer-events-none absolute -left-[18%] -top-[24%] h-[62vw] min-h-[420px] w-[62vw] min-w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(139,92,246,0.14)_0%,_rgba(15,23,42,0)_70%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10">
        <div>
          <h1 className="m-0 bg-gradient-to-br from-white to-slate-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
            Secure Checkout
          </h1>
          <p className="mb-0 mt-2 text-slate-400">
            Confirm your delivery address and review your shopping choices.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 font-medium text-red-300 animate-[slideDown_0.3s_ease-out]">
            {error}
          </div>
        )}

        {loading ? (
          <section className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="min-h-[450px] animate-pulse rounded-[24px] border border-white/10 bg-slate-800/35 shadow-2xl" />
            <div className="min-h-[350px] animate-pulse rounded-[24px] border border-white/10 bg-slate-800/35 shadow-2xl" />
          </section>
        ) : items.length === 0 ? (
          <section className="rounded-[24px] border border-white/10 bg-slate-800/40 px-6 py-16 text-center shadow-2xl backdrop-blur-xl">
            <h2 className="m-0 text-3xl font-semibold text-white">Your cart is empty</h2>
            <p className="mb-0 mt-3 text-slate-400">
              Add some premium picks to your collection before proceeding to checkout.
            </p>
            <Link
              to="/"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 px-6 py-3 font-semibold text-white no-underline shadow-[0_4px_14px_0_rgba(99,102,241,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)]"
            >
              Browse Products
            </Link>
          </section>
        ) : (
          <section className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="flex flex-col gap-8">
              {/* Shipping Address Selector */}
              <div className="rounded-[24px] border border-white/10 bg-slate-800/40 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <h2 className="m-0 text-2xl font-semibold text-white">1. Shipping Address</h2>
                  <Link
                    to="/checkout-address"
                    className="text-sm font-semibold text-violet-400 no-underline transition hover:text-violet-300"
                  >
                    + Add New Address
                  </Link>
                </div>

                {addresses.length === 0 ? (
                  <div className="mt-6 text-center py-10">
                    <p className="text-slate-400 mb-5">No saved shipping addresses found.</p>
                    <Link
                      to="/checkout-address"
                      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 px-6 py-2.5 text-sm font-semibold text-white no-underline shadow-[0_4px_12px_0_rgba(99,102,241,0.25)] transition hover:-translate-y-0.5"
                    >
                      Create Address
                    </Link>
                  </div>
                ) : (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {addresses.map((addr) => {
                      const isSelected = addr._id === selectedAddressId;
                      return (
                        <div
                          key={addr._id}
                          onClick={() => setSelectedAddressId(addr._id)}
                          className={`relative flex cursor-pointer flex-col gap-2 rounded-2xl border p-5 transition-all duration-300 ${
                            isSelected
                              ? "border-violet-500 bg-violet-500/10 ring-1 ring-violet-500/30"
                              : "border-white/10 bg-slate-900/30 hover:border-white/20 hover:bg-slate-900/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white">{addr.fullName}</span>
                            {isSelected && (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3 w-3">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-slate-400 leading-normal mt-1">
                            {addr.addressLine}<br />
                            {addr.city}, {addr.state} - {addr.pincode}
                          </span>
                          <span className="text-sm text-slate-500 mt-2">Phone: {addr.phone}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Order Items Review */}
              <div className="rounded-[24px] border border-white/10 bg-slate-800/40 p-6 shadow-2xl backdrop-blur-xl">
                <h2 className="m-0 border-b border-white/10 pb-5 text-2xl font-semibold text-white">
                  2. Review Items
                </h2>

                <div className="mt-6 flex flex-col gap-4 max-h-[360px] overflow-y-auto pr-1">
                  {items.map((item) => {
                    const product = item.productId;
                    return (
                      <div
                        key={item._id || product?._id}
                        className="flex gap-4 rounded-xl border border-white/5 bg-slate-900/35 p-3.5"
                      >
                        <div className="h-16 w-16 overflow-hidden rounded-lg bg-slate-950">
                          {product?.image ? (
                            <img
                              src={product.image}
                              alt={product.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] text-slate-600 bg-slate-900">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-wide">
                            {product?.category || "Collection"}
                          </span>
                          <h3 className="m-0 text-base font-semibold text-white truncate leading-tight mt-1">
                            {product?.title || "Product details loading"}
                          </h3>
                          <div className="flex items-center justify-between gap-4 mt-2">
                            <span className="text-xs text-slate-400">Qty: {item.quantity}</span>
                            <span className="text-sm font-bold text-violet-200">
                              ${(Number(product?.price || 0) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Checkout Order Summary Sidebar */}
            <aside className="h-fit rounded-[24px] border border-white/10 bg-slate-800/40 p-6 shadow-2xl backdrop-blur-xl">
              <h2 className="m-0 border-b border-white/10 pb-5 text-2xl font-semibold text-white">Order Summary</h2>

              <div className="mt-6 flex flex-col gap-4 text-slate-300">
                <div className="flex items-center justify-between text-sm">
                  <span>Items ({itemCount})</span>
                  <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-400">FREE</span>
                </div>
                <div className="flex items-center justify-between text-sm border-b border-white/10 pb-4">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-white">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="text-lg font-semibold text-slate-200">Order Total</span>
                <span className="text-3xl font-bold text-violet-200">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>

              {/* Payment Mock Panel */}
              <div className="mt-6 rounded-2xl border border-white/5 bg-slate-900/40 p-4">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment Method</span>
                <div className="mt-3 flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">Cash on Delivery</span>
                    <span className="text-[11px] text-slate-500">Pay safely upon delivery at your door.</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={placing || !selectedAddressId}
                onClick={handlePlaceOrder}
                className="mt-6 flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 px-5 py-3 text-base font-semibold text-white shadow-[0_4px_14px_0_rgba(99,102,241,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
              >
                {placing ? "Processing Order..." : "Place Order"}
              </button>
            </aside>
          </section>
        )}
      </div>
    </main>
  );
}
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import AddProducts from "./admin/AddProducts.jsx";
import ProductList from "./admin/ProductList.jsx";
import EditProduct from "./admin/EditProduct.jsx";
import Navbar from "./components/Navbar.jsx";
import Cart from "./pages/Cart.jsx";
import CheckoutAddress from "./pages/CheckoutAddress.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/product/:id", element: <ProductDetails /> },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout-address", element: <CheckoutAddress /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/order-success", element: <OrderSuccess /> },
      { path: "/admin/products", element: <ProductList /> },
      { path: "/admin/products/add", element: <AddProducts /> },
      { path: "/admin/products/edit/:id", element: <EditProduct /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

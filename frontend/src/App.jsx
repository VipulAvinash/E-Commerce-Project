import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import AddProducts from "./admin/AddProducts.jsx";
import ProductList from "./admin/ProductList.jsx";
import EditProduct from "./admin/EditProduct.jsx";  

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/product/:id", element: <ProductDetails /> },
  {path: "/admin/products", element: <ProductList />},
  {path: "/admin/products/add", element: <AddProducts />},
  {path: "/admin/products/edit/:id", element: <EditProduct />}
]);

export default function App() {
  return <RouterProvider router={router} />;
}

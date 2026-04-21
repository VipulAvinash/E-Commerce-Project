import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link } from "react-router";
import "./Admin.css";

export default function ProductList() {
  const [products, setPriducts] = useState([]);

  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      setPriducts(res.data.products || []);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/delete/${id}`);
        loadProducts();
      } catch (err) {
        alert("Error deleting product", err);
      }
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Product List</h2>
        <Link to="/admin/products/add" className="btn-primary">Add New Product</Link>
      </div>
      
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.title}</td>
                <td>{product.description?.substring(0, 40)}{product.description?.length > 40 ? '...' : ''}</td>
                <td>${product.price?.toFixed(2)}</td>
                <td>{product.category}</td>
                <td>{product.stock}</td>
                <td>
                  <div className="action-links">
                    <Link to={`/admin/products/edit/${product._id}`} className="btn-edit">Edit</Link>
                    <button onClick={() => handleDelete(product._id)} className="btn-delete">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

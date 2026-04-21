import { useState,useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router"
import api from "../api/axios";
import "./Admin.css";

export default function EditProduct(){
    const {id} = useParams();
    const [form , setForm ] = useState({
        title : "", 
        description : "",
        price : "",                      
        category : "",  
        image : "",
        stock : ""
    })   
    const navigate = useNavigate()
    const allowFields = ["title","description","price","category","image","stock"]
   
    const loadProduct = async()=>{
        try {
            const res = await api.get(`/products/${id}`)
            if (res.data && res.data.product) {
                // Only extract the allowed fields from the response
                const productData = res.data.product;
                const filteredForm = {};
                allowFields.forEach(field => {
                    filteredForm[field] = productData[field] !== undefined ? productData[field] : "";
                });
                setForm(filteredForm);
            }
        } catch (err) {
            console.error("Error loading product", err);
            alert("Error loading product details");
        }
    }

    useEffect(()=>{
        if (id) {
            loadProduct()
        }
    }, [id])

    const handleChange = (e)=>{    
        setForm({
            ...form,
            [e.target.name] : e.target.value        
        })
    }
    
    const handleSubmit = async(e)=>{
        e.preventDefault()
        try {
            const submitData = {
                ...form,
                price: Number(form.price),
                stock: Number(form.stock)
            }
            await api.put(`/products/update/${id}`, submitData)
            alert("Product updated successfully")
            navigate("/admin/products")  
        } catch (err) {
            alert("Error updating product");
        }
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>Edit Product</h2>
                <Link to="/admin/products" className="btn-edit" style={{ background: 'transparent', border: '1px solid #34d399' }}>Back to Products</Link>
            </div>
            
            <div className="admin-card admin-form-wrapper">
                <form onSubmit={handleSubmit} className="admin-form">
                    {allowFields.map((key) => (
                        <div className="form-group" key={key}>
                            <label htmlFor={key}>{key}</label>
                            {key === 'description' ? (
                                <textarea
                                    id={key}
                                    name={key}
                                    value={form[key]}
                                    onChange={handleChange}
                                    placeholder={`Enter product ${key}`}
                                    rows="4"
                                    required
                                />
                            ) : (
                                <input  
                                    type={key === 'price' || key === 'stock' ? 'number' : 'text'}
                                    id={key}
                                    name={key}  
                                    value={form[key]} 
                                    onChange={handleChange}
                                    placeholder={`Enter product ${key}`}
                                    step={key === 'price' ? '0.01' : '1'}
                                    required={key !== 'image'}
                                />
                            )}
                        </div>
                    ))}
                    <button type="submit" className="btn-primary">Update Product</button>       
                </form> 
            </div>
        </div>
    )
}
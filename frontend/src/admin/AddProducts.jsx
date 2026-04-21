import { useState } from "react";
import { useNavigate } from "react-router"
import api from '../api/axios'
import { Link } from "react-router";
import "./Admin.css";

export default function AddProducts(){
    const [form , setForm ] = useState({
        title : "", 
        description : "",
        price : "",
        category : "",
        image : "",
        stock : ""
    })

    const navigate = useNavigate()

    const handleChange = (e)=>{
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }
    
    const handleSubmit = async(e)=>{
        e.preventDefault()
        try{
            // Convert price and stock to numbers before submitting
            const submitData = {
                ...form,
                price: Number(form.price),
                stock: Number(form.stock)
            }
            await api.post("/products/add", submitData)
            alert("Product added successfully")
            navigate("/admin/products")
        }
        catch(error){
            alert("Error adding product")
        }
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>Add New Product</h2>
                <Link to="/admin/products" className="btn-edit" style={{ background: 'transparent', border: '1px solid #34d399' }}>Back to Products</Link>
            </div>
            
            <div className="admin-card admin-form-wrapper">
                <form onSubmit={handleSubmit} className="admin-form">
                    {Object.keys(form).map((key) => (
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
                    <button type="submit" className="btn-primary">Add Product</button>
                </form>
            </div>
        </div>
    )
}
    
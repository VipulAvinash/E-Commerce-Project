import product from "../models/product.js";


//Create a new product

export const createProduct = async (req, res) => {
    try {
        const newProduct = await product.create(req.body)
        res.status(201).json({ message: "Product Created Successfully", product: newProduct })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}


// Get all products
export const getProducts = async (req, res) => {
    try {
        const products = await product.find().sort({ createdAt: -1 })
        res.status(200).json({ message: "Products Fetched Successfully", products })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}


// Update a Product 
export const updateProduct = async (req, res) => {
    try {
        const updated = await product.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json({ message: "Product Updated Successfully", updated })
    }
    catch (error) {
        res.json({ message: error.message })
    }

}

// Delete a Product
export const deleteProduct = async (req, res) => {
    try {
        const deleted = await product.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Product Deleted Successfully", deleted })
    }
    catch (error) {
        res.json({ message: error.message })
    }
}
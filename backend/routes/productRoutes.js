import express from 'express';
import { getProducts,createProduct,deleteProduct,updateProduct } from '../controller/productController.js';


const router = express();

router.post('/add',createProduct)    
router.get('/',getProducts)  
router.put('/update/:id',updateProduct)
router.delete('/delete/:id',deleteProduct)
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import {connectDB} from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/auth',authRoutes)
app.use('/api/products',productRoutes)


connectDB();

app.listen(5001,()=>{
    console.log("Server is running")
})


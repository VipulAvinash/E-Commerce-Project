import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import dummyProducts from "../data/dummyProducts.js";
import Product from "../models/product.js";

dotenv.config();

const seedProducts = async () => {
  try {
    await connectDB();
    await Product.insertMany(dummyProducts);

    console.log(`${dummyProducts.length} dummy products added successfully`);
  } catch (error) {
    console.error(`Failed to seed products: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedProducts();

import express from "express";
import { placeOrder } from "../controller/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Secure all order routes using JWT protection middleware
router.use(protect);

router.post("/place", placeOrder);

export default router;

import express from "express";
import {
  addToCart,
  getCart,
  removeItem,
  updateQuantity,
} from "../controller/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.post("/add", addToCart);
router.post("/remove", removeItem);
router.post("/update", updateQuantity);
router.get("/", getCart);

export default router;

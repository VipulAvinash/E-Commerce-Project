import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const placeOrder = async (req, res) => {
  try {
    const { userId, address, paymentMethod } = req.body;

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is Empty" });
    }

    const orderItems = cart.items.map((item) => {
      if (!item.productId) {
        throw new Error("Product details missing for cart item");
      }
      return {
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price
      };
    });

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const order = await Order.create({
      userId,
      items: orderItems,
      address,
      totalAmount,
      paymentMethod: paymentMethod || "COD",
      status: "Placed"
    });

    // Clear the cart after successfully placing the order
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    console.error("Order placement failed:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
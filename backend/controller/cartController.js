import Cart from "../models/Cart.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const item = cart.items.find((i) => i.productId.toString() === productId);

    if (item) {
      item.quantity += 1;
    } else {
      cart.items.push({ productId, quantity: 1 });
    }
    await cart.save();
    res.json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userId;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart Not Found" });
    }

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Item Not Found" });
    }
    item.quantity = quantity;

    await cart.save();
    res.json({ message: "Cart quantity updated", cart });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Item Not Found" });
    }
    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);

    await cart.save();
    res.json({ message: "Removed Successfully From Cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

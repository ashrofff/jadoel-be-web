import {
  resClientError,
  resNotAllowed,
  resServerError,
  resSuccess,
} from "@/helper/response";
import userAuth from "@/middleware/userAuth";
import { checkCart, addItemToCart, updateQuantity, getCartById } from "@/models/cart";

async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const cartItems = await getCartById();
      return res.status(200).json(resSuccess("Data Keranjang", cartItems));
    }
    if (req.method === "DELETE") {
        const { itemId} = req.body;
        const { userId } = req.decoded;
      const cartItems = await getCartById();
      return res.status(200).json(resSuccess("Data Keranjang", cartItems));
    }

    if (req.method === "POST") {
      const { itemId, quantity } = req.body;
      const { userId } = req.decoded;

      // Validasi input
      if (!itemId || !quantity) {
        return res
          .status(400)
          .json(resClientError("Invalid item ID or quantity"));
      }

      // Cek apakah item sudah ada di cart
      const existingCartItem = await checkCart(userId, itemId);

      if (existingCartItem) {
        // Jika sudah ada, tambahkan kuantitas
        if (existingCartItem.quantity + quantity <= 0) {
          return res
            .status(400)
            .json(resClientError("Kuantitas tidak boleh kurang dari 0"));
        } else {
          const updatedCart = await updateQuantity(
            existingCartItem.cartId,
            existingCartItem.quantity,
            quantity
          );

          return res
            .status(200)
            .json(resSuccess("Item quantity updated in cart", updatedCart));
        }
      }

      // Jika belum ada, tambahkan item baru
      const newCartItem = await addItemToCart(userId, itemId, quantity);

      return res
        .status(200)
        .json(resSuccess("Item added to cart", newCartItem));
    }

    return res.status(405).json(resNotAllowed());
  } catch (error) {
    console.error(error);
    return res.status(500).json(resServerError());
  }
}

export default userAuth(handler);

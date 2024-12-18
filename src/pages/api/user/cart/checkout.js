import {
  MIDTRANS_MERCHANT_NAME,
  MIDTRANS_SERVER_KEY,
  MIDTRANS_URL_API,
} from "@/constant/midtrans";
import {
  resClientError,
  resNotAllowed,
  resNotFound,
  resServerError,
  resSuccess,
} from "@/helper/response";
import randomCharacter from "@/helper/randomCharacter";
import userAuth from "@/middleware/userAuth";
import { getCartById, deleteCartItem } from "@/models/cart";
import {
  midtransTransaction,
  makeTransaction,
  findPendingTransaction,
} from "@/models/transaction";
import axios from "axios";
import { getUserShipping } from "@/models/userShipping";

import { getStoreConfig } from "@/models/storeConfig";

import hitungOngkir from "@/helper/shippingFee";

const midtransCheckout = async (order_id, gross_amount, item_details) => {
  try {
    const encodedServerKey = Buffer.from(MIDTRANS_SERVER_KEY + ":").toString(
      "base64"
    );

    const { data } = await axios.post(
      MIDTRANS_URL_API + "/snap/v1/transactions",
      {
        transaction_details: {
          order_id,
          gross_amount,
        },
        item_details, // Tambahkan item_details ke payload
      },
      {
        headers: {
          Authorization: `Basic ${encodedServerKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    console.log("Midtrans Error:", error.response?.data || error.message);
    return new Error("MIDTRANS_ERROR");
  }
};

async function handler(req, res) {
  const { id } = req.query;
  const { userId } = req.decoded;

  try {
    if (req.method === "POST") {
      const userShipping = await getUserShipping(userId);

      if (!userShipping) {
        return res
          .status(400)
          .json(resClientError("Data pengiriman tidak ditemukan"));
      }

      const { longitude, latitude } = userShipping;
      if (!longitude || !latitude) {
        return res
          .status(400)
          .json(resClientError("Lengkapi data pengiriman terlebih dahulu"));
      }
      const storeConfig = await getStoreConfig();
      const ongkir = hitungOngkir(
        latitude,
        longitude,
        storeConfig.latitudeStore,
        storeConfig.longitudeStore,
        storeConfig.costPerKm
      );

      // Cek apakah ada transaksi pending untuk user ini
      const pendingTransaction = await findPendingTransaction(userId);
      if (pendingTransaction) {
        return res
          .status(400)
          .json(resClientError("Selesaikan transaksi sebelumnya."));
      }

      // Ambil data cart dari database
      const cartItems = await getCartById(userId);

      if (cartItems.length === 0) {
        return res.status(400).json(resClientError("Keranjang Anda kosong."));
      }

      // Hitung total harga dan siapkan item_details untuk Midtrans
      const item_details = cartItems.map((cartItem) => ({
        id: cartItem.item.itemId,
        name: cartItem.item.name,
        quantity: cartItem.quantity,
        price: parseInt(cartItem.item.price, 10),
        subtotal: cartItem.quantity * parseInt(cartItem.item.price, 10),
      }));

      item_details.push({
        id: "SHIPPING",
        name: "Ongkos Kirim",
        quantity: 1,
        price: ongkir,
        subtotal: ongkir,
      });

      const gross_amount = item_details.reduce(
        (total, item) => total + item.subtotal,
        0
      );

      // Buat order_id unik untuk transaksi
      const order_id = `ORDER-${Date.now()}}`;

      // Simpan transaksi ke database
      const transaction = await makeTransaction(
        userId,
        gross_amount,
        cartItems,
        ongkir
      );

      // Kirim transaksi ke Midtrans
      const pay = await midtransCheckout(
        transaction.transactionId,
        gross_amount,
        item_details
      );

      if (pay instanceof Error) {
        return res.status(400).json(resClientError(pay.message));
      }
      const mtTrans = await midtransTransaction(
        transaction.transactionId,
        pay.token,
        pay.redirect_url
      );

      // Hapus item di tabel cart
      const deletePromises = cartItems.map((cartItem) =>
        deleteCartItem(cartItem.cartId)
      );
      await Promise.all(deletePromises);

      return res.status(200).json(
        resSuccess("Transaksi berhasil dibuat", {
          ...mtTrans,
          cartItems,
        })
      );
    }

    return res.status(405).json(resNotAllowed());
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json(resServerError());
  }
}

export default userAuth(handler);

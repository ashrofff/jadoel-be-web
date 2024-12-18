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

import axios from "axios";

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

export default async function handler(req, res) {
  const { id, name, price, quantity } = req.body;

  try {
    if (req.method === "POST") {
      const item_details = {
        id: id,
        name: name,
        quantity: quantity,
        price: parseInt(price, 10),
        subtotal: quantity * parseInt(price, 10),
      };

      const gross_amount = quantity * parseInt(price, 10);

      // Buat order_id unik untuk transaksi
      const order_id = `ORDER-${Date.now()}}`;

      const pay = await midtransCheckout(order_id, gross_amount, item_details);

      if (pay instanceof Error) {
        return res.status(400).json(resClientError(pay.message));
      }

      return res.status(200).json(
        resSuccess("Transaksi berhasil dibuat", {
          token: pay.token,
          url: pay.redirect_url,
          item_details,
        })
      );
    }

    return res.status(405).json(resNotAllowed());
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json(resServerError());
  }
}

// export default userAuth(handler);

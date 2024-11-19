import {
  MIDTRANS_MERCHANT_NAME,
  MIDTRANS_SERVER_KEY,
  MIDTRANS_URL_API,
  MIDTRANS_URL_API2,
  MIDTRANS_URL_TRANSACTION,
} from "@/constant/midtrans";
import axios from "axios";

import {
  resClientError,
  resNotAllowed,
  resNotFound,
  resServerError,
  resSuccess,
} from "@/helper/response";
import sevenDaysAgo from "@/helper/sevenDaysAgo";
import userAuth from "@/middleware/userAuth";
import {
  getHistoryTransaction,
  paidTransaction,
  getHistoryTransactionPending,
} from "@/models/transaction";

const date = new Date();

const oneDayAfter = (date) => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + 1);
  return newDate;
};

const midtransCheck = async (order_id) => {
  try {
    const encodedServerKey = Buffer.from(MIDTRANS_SERVER_KEY + ":").toString(
      "base64"
    );

    const { data } = await axios.get(
      MIDTRANS_URL_API2 + "/v2/" + order_id + "/status",
      {
        headers: {
          Authorization: `Basic ${encodedServerKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    console.log("Midtrans Error:", error);
    return new Error("MIDTRANS_ERROR");
  }
};

async function handler(req, res) {
  const { userId } = req.decoded;

  try {
    if (req.method === "GET") {
      const transactionsUpdate = await getHistoryTransactionPending(userId);

      const [mtCheck] = await Promise.all([
        midtransCheck(transactionsUpdate.transactionId),
      ]);
      if (mtCheck instanceof Error) {
        return res.status(500).json(resServerError());
      }

      const { transaction_status, status_code, settlement_time } = mtCheck;
      if (
        status_code &&
        transaction_status &&
        settlement_time &&
        status_code === "200" &&
        transaction_status === "settlement"
      ) {
        console.log("hitted");
        const ts = await paidTransaction(transactionsUpdate.transactionId);
        console.log(ts);
      }

      const transactions = await getHistoryTransaction(userId);

      for (const transaction of transactions) {
        if (transaction.status === 1) {
          transaction.status = "PENDING";
        } else if (transaction.status === 2) {
          transaction.status = "DIBAYAR";
        } else if (transaction.status === 3) {
          transaction.status = "DIANTAR";
        } else if (transaction.status === 4) {
          transaction.status = "TIBA";
        } else if (transaction.status === 5) {
          transaction.status = "DIBATALKAN";
        } else {
          transaction.status = "ERROR";
        }
      }
      return res
        .status(200)
        .json(resSuccess("Riwayat Transaksi", transactions));
    }

    if (req.method === "PUT") {
    }

    return res.status(405).json(resNotAllowed());
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json(resServerError());
  }
}

export default userAuth(handler);

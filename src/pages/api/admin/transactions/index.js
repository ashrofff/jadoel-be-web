import { resNotAllowed, resServerError, resSuccess } from "@/helper/response";
import sevenDaysAgo from "@/helper/sevenDaysAgo";
import adminAuth from "@/middleware/adminAuth";
import { getAllTransactions } from "@/models/transaction";

async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const transactions = await getAllTransactions();
      for (const transaction of transactions) {
        if (transaction.status === 1) {
          transaction.status = "PENDING";
        } else if (transaction.status === 2) {
          transaction.status = "DIBAYAR";
        } else if (transaction.status === 3) {
          transaction.status = "DIANTAR";
        } else if (transaction.status === 4) {
          transaction.status = "SELESAI";
        } else if (transaction.status === 5) {
          transaction.status = "DIBATALKAN";
        } else {
          transaction.status = "UNDEFINED";
        }
      }
      return res.status(200).json(resSuccess("Data Transaksi", transactions));
    }

    return res.status(405).json(resNotAllowed());
  } catch (error) {
    console.log(error);
    return res.status(500).json(resServerError());
  }
}

export default adminAuth(handler);

import {
  resClientError,
  resNotAllowed,
  resNotFound,
  resServerError,
  resSuccess,
} from "@/helper/response";
import sevenDaysAgo from "@/helper/sevenDaysAgo";
import adminAuth from "@/middleware/adminAuth";
import {
  getTransactionById,
  updateTransactionStatus,
} from "@/models/transaction";

async function handler(req, res) {
  const { id } = req.query;

  if (!id) return res.status(400).json(resClientError("ID harus diisi"));

  try {
    if (req.method === "GET") {
      const transaction = await getTransactionById(id);
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

      return res.status(200).json(resSuccess("Data Transaksi", transaction));
    } else if (req.method === "PUT") {
      const { status } = req.body;
      const transaction = await updateTransactionStatus(id, status);

      return res.status(200).json(resSuccess("Data Transaksi", transaction));
    }

    return res.status(405).json(resNotAllowed());
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json(resServerError());
  }
}

export default adminAuth(handler);

import {
    resClientError,
    resNotAllowed,
    resServerError,
    resSuccess,
  } from "@/helper/response";
  import { updateTransactionStatus } from "@/models/transaction";
  import { MIDTRANS_SERVER_KEY } from "@/constant/midtrans";
  
  export default async function handler(req, res) {
    try {
      if (req.method === "POST") {
        // Verifikasi signature key dari Midtrans
        const {
          order_id,
          transaction_status,
          fraud_status,
        } = req.body;
  
        const serverKey = MIDTRANS_SERVER_KEY;
        const expectedSignature = Buffer.from(`${order_id}${serverKey}`).toString(
          "base64"
        );
  
        if (req.headers["x-signature-key"] !== expectedSignature) {
          return res.status(403).json(resClientError("Invalid signature key."));
        }
  
        // Update status transaksi di database
        let status;
        if (transaction_status === "settlement" && fraud_status === "accept") {
          status = 2; // Success
        } else if (transaction_status === "pending") {
          status = 1; // Pending
        } else if (
          transaction_status === "deny" ||
          transaction_status === "expire" ||
          transaction_status === "cancel"
        ) {
          status = 5; // cancelled
        }
  
        if (!status) {
          return res
            .status(400)
            .json(resClientError("Invalid transaction status."));
        }
  
        await updateTransactionStatus(order_id, status);
  
        return res.status(200).json(resSuccess("Transaction status updated."));
      }
  
      return res.status(405).json(resNotAllowed());
    } catch (error) {
      console.error("Webhook Error:", error);
      return res.status(500).json(resServerError("Failed to process webhook."));
    }
  }
  
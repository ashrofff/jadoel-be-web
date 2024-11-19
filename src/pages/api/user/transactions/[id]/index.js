import { resClientError, resNotAllowed, resNotFound, resServerError, resSuccess } from "@/helper/response";
import twentyFourHoursAfter from "@/helper/twentyHoursAfter";
import userAuth from "@/middleware/userAuth";
import { getTransactionById, cancelTransaction } from "@/models/transaction";

async function handler(req, res) {
    const { id } = req.query;

    if (!id) return res.status(400).json(resClientError('ID harus diisi'));

    try {
        if (req.method === 'GET') {
            const transaction = await getTransactionById(id);
            if (!transaction) return res.status(404).json(resNotFound());

            if (transaction.status === 1) {
                transaction.status = "PENDING"
            } else if (transaction.status === 2) {
                transaction.status = "DIBAYAR"
            } else if (transaction.status === 3) {
                transaction.status = "DIANTAR"
            } else if (transaction.status === 4) {
                transaction.status = "TIBA"
            } else if (transaction.status === 5) {
                transaction.status = "DIBATALKAN"
            } else {
                transaction.status = "ERROR"
            }

            return res.status(200).json(resSuccess("Riwayat Transaksi", transaction));
        }

        if (req.method === 'PATCH') {
            const transaction = await getTransactionById(id);
            if (!transaction) return res.status(404).json(resNotFound());
            if (transaction.isCancelled) {
                return res.status(400).json(resClientError('Transaksi ini telah dibatalkan'));
            }
            if (transaction.isPaid) {
                return res.status(400).json(resClientError('Transaksi ini telah lunas'));
            }
            if (transaction.createdAt < twentyFourHoursAfter) {
                return res.status(400).json(resClientError('Transaksi ini telah kadaluarsa'));
            }
            await cancelTransaction(id);
            return res.status(200).json(resSuccess("Berhasil membatalkan transaksi", transaction));
        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json(resServerError());
    }
}

export default userAuth(handler);

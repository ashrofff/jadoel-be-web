import { resClientError, resNotAllowed, resNotFound, resServerError, resSuccess } from "@/helper/response";
import sevenDaysAgo from "@/helper/sevenDaysAgo";
import userAuth from "@/middleware/userAuth";
import { getHistoryTransaction } from "@/models/transaction";

const date = new Date();

const oneDayAfter = (date) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    return newDate;
}

async function handler(req, res) {
    const { userId } = req.decoded;

    try {
        if (req.method === 'GET') {
            const transactions = await getHistoryTransaction(userId);     
            for (const transaction of transactions) {
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
            }
            return res.status(200).json(resSuccess("Riwayat Transaksi", transactions));
        }

        if (req.method === 'PUT') {

        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json(resServerError());
    }
}

export default userAuth(handler);

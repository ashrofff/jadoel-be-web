import { resClientError, resNotAllowed, resServerError, resSuccess } from "@/helper/response";
import sevenDaysAgo from "@/helper/sevenDaysAgo"; // asumsikan ini adalah variabel tanggal
import adminAuth from "@/middleware/adminAuth";
import { getAllTransactions } from "@/models/transaction";
import { getAllUsers } from "@/models/user";

const getLast12Months = () => {
    const months = [];
    const today = new Date();

    for (let i = 0; i < 12; i++) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        months.push({
            year: date.getFullYear(),
            month: date.getMonth(),
            totalTransaction: 0,
            totalIncome: 0,
        });
    }

    return months.reverse();
};

async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const [transactions, users] = await Promise.all([getAllTransactions(), getAllUsers()]);

            // Menghitung transaksi berdasarkan status
            const transactionSuccess = transactions.filter(t => t.status === 1);
            const weeklyTransactionsSuccess = transactionSuccess.filter(t => t.createdAt > sevenDaysAgo);
            const transactionFail = transactions.filter(t => t.status === 2);
            const weeklyTransactionsFail = transactionFail.filter(t => t.createdAt > sevenDaysAgo);

            const totalUser = users.length;
            const weeklyUser = users.filter(u => u.createdAt > sevenDaysAgo).length;

            let totalIncome = 0;
            let weeklyIncome = 0;

            // Hitung total pendapatan
            for (const transaction of transactionSuccess) {
                const transactionTotal = transaction.items.reduce((sum, item) => sum + (item.itemPrice * item.quantity), 0);
                totalIncome += transactionTotal;

                if (transaction.createdAt > sevenDaysAgo) {
                    weeklyIncome += transactionTotal;
                }
            }

            const income = {
                totalIncome,
                weeklyIncome,
            };

            const count = {
                allTransaction: transactions.length,
                transactionSuccess: transactionSuccess.length,
                weeklyTransactionsSuccess: weeklyTransactionsSuccess.length,
                transactionFail: transactionFail.length,
                weeklyTransactionsFail: weeklyTransactionsFail.length,
                totalUser,
                weeklyUser,
            };

            const monthlyRecords = getLast12Months();

            // Perhitungan bulanan
            transactionSuccess.forEach(transaction => {
                const paidAtDate = new Date(transaction.createdAt); // Tidak ada `paidAt`, gunakan `createdAt` sebagai proxy
                const paidYear = paidAtDate.getFullYear();
                const paidMonth = paidAtDate.getMonth();

                const record = monthlyRecords.find(m => m.year === paidYear && m.month === paidMonth);
                if (record) {
                    const transactionTotal = transaction.items.reduce((sum, item) => sum + (item.itemPrice * item.quantity), 0);
                    record.totalTransaction += 1;
                    record.totalIncome += transactionTotal;
                }
            });

            for (const m of monthlyRecords) {
                m.date = `${m.year}-${m.month + 1}-01T00:00:00.000Z`;
            }

            return res.status(200).json(resSuccess("Data Overview", {
                count,
                income,
                allTransaction: transactions,
                transactionSuccess,
                transactionFail,
                weeklyTransactionsSuccess,
                weeklyTransactionsFail,
                monthlyRecords,
            }));
        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.log(error);
        return res.status(500).json(resServerError());
    }
}

export default adminAuth(handler);

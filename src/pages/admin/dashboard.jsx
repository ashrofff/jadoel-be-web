import LayoutAdmin from "@/components/LayoutAdmin";
import axiosInstance from "@/config/axiosInstance";
import AuthPage from "@/utils/AuthPage";
import formatRupiah from "@/utils/formatRupiah";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrasi ChartJS komponen yang digunakan
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const monthsInIndonesian = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const initData = {
  count: {
    allTransaction: 0,
    transactionSuccess: 0,
    weeklyTransactionsSuccess: 0,
    transactionFail: 0,
    weeklyTransactionsFail: 0,
    totalUser: 0,
    weeklyUser: 0,
    totalPackages: 0,
  },
  income: {
    totalIncome: 0,
    weeklyIncome: 0,
  },
  allTransaction: [],
  transactionSuccess: [],
  weeklyTransactionsSuccess: [],
  weeklyTransactionsFail: [],
  monthlyRecords: [],
};

// Komponen Chart untuk visualisasi
const LineChart = ({ records }) => {
  const chartData = {
    labels: records.map((record) => monthsInIndonesian[record.month - 1]),
    datasets: [
      {
        label: "Total Pemasukan (Rp)",
        data: records.map((record) => record.totalIncome),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        tension: 0.4,
      },
      {
        label: "Total Transaksi",
        data: records.map((record) => record.totalTransaction),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Perkembangan Transaksi dan Pemasukan" },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => "Rp " + value.toLocaleString(),
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

// Komponen untuk item grid
const GridItem = ({ title, value, percentageText, description, colSpan }) => (
  <div className={`bg-white rounded-lg p-6 shadow-md ${colSpan}`}>
    <Typography variant="h6">{title}</Typography>
    <Typography variant="h3" className="my-2">
      {value}
      <span className={`text-sm ${percentageText.color}`}> {percentageText.text}</span>
    </Typography>
    <Typography variant="body2" className="text-gray-600">
      {description}
    </Typography>
  </div>
);

const DashboardPage = () => {
  const [data, setData] = useState(initData);

  const fetchData = async () => {
    try {
      const { data } = await axiosInstance.get("/overview");
      setData(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalIncome = data.income.totalIncome;
  const weeklyIncome = data.income.weeklyIncome;
  const incomePercentage = ((weeklyIncome / totalIncome) * 100).toFixed(2);

  const allTransactions = data.count.allTransaction;
  const weeklyTransactionsTotal =
    data.count.weeklyTransactionsFail + data.count.weeklyTransactionsSuccess;
  const transactionsPercentage = (
    (weeklyTransactionsTotal / allTransactions) *
    100
  ).toFixed(2);

  const transactionSuccessPercentage = (
    (data.count.weeklyTransactionsSuccess / allTransactions) *
    100
  ).toFixed(2);

  const totalUsers = data.count.totalUser;
  const weeklyUserPercentage = (
    (data.count.weeklyUser / totalUsers) *
    100
  ).toFixed(2);

  const incomePerUser = (totalIncome / totalUsers).toFixed(2);
  const weeklyIncomePerUser = (weeklyIncome / totalUsers).toFixed(2);
  const incomePerUserPercentage = (
    (weeklyIncome / totalUsers / (totalIncome / totalUsers)) *
    100
  ).toFixed(2);

  return (
    <LayoutAdmin title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-4">
          <LineChart records={data.monthlyRecords} />
        </div>
        <GridItem
          title="Pemasukan Kotor"
          value={formatRupiah(totalIncome)}
          percentageText={{
            color:
              incomePercentage > 0
                ? "text-teal-500"
                : incomePercentage === 0
                ? "text-gray-500"
                : "text-red-500",
            text: `+${incomePercentage}%`,
          }}
          description={`+${formatRupiah(weeklyIncome)} minggu ini`}
          colSpan="col-span-1 md:col-span-2"
        />
        <GridItem
          title="Total Transaksi"
          value={allTransactions}
          percentageText={{
            color:
              transactionsPercentage > 0
                ? "text-teal-500"
                : transactionsPercentage === 0
                ? "text-gray-500"
                : "text-red-500",
            text: `+${transactionsPercentage}%`,
          }}
          description={`+${weeklyTransactionsTotal} minggu ini`}
          colSpan="col-span-1"
        />
        <GridItem
          title="Pengguna Baru"
          value={totalUsers}
          percentageText={{
            color:
              weeklyUserPercentage > 0
                ? "text-teal-500"
                : weeklyUserPercentage === 0
                ? "text-gray-500"
                : "text-red-500",
            text: `+${weeklyUserPercentage}%`,
          }}
          description={`+${data.count.weeklyUser} minggu ini`}
          colSpan="col-span-1"
        />
      </div>
    </LayoutAdmin>
  );
};

export default AuthPage(DashboardPage);

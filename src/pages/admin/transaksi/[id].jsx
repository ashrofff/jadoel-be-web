import LayoutAdmin from "@/components/LayoutAdmin";
import axiosInstance from "@/config/axiosInstance";
import oneMonthAhead from "@/helper/oneMonthAhead";
import AuthPage from "@/utils/AuthPage";
import formatDate from "@/utils/formatDate";
import formatPhone from "@/utils/formatPhone";
import formatRupiah from "@/utils/formatRupiah";
import {
  Alert,
  Button,
  Paper,
  Table,
  TableBody,
  Popover,
  Box,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const initData = {
  transactionId: "Loading...",
  userId: "Loading...",
  packageId: "Loading...",
  packageName: "Loading...",
  totalPrice: 0,
  itemPrice: 0,
  installationFee: 0,
  overdueFee: 0,
  isPaid: false,
  isCancelled: false,
  snapTokenMT: "Loading...",
  redirectUrlMT: "/admin/transaksi",
  createdAt: "2024-08-20T12:12:12.000Z",
  updatedAt: "2024-08-20T12:12:12.000Z",
  startedAt: null,
  paidAt: null,
  status: "UNPAID",
  package: {
    packageId: "Loading...",
    name: "Loading...",
    description: "Loading...",
    price: 0,
    installationCost: 0,
    image: "/images/placeholder.jpg",
    isActive: true,
    isDeleted: false,
    createdAt: "2024-08-20T12:12:12.000Z",
    updatedAt: "2024-08-20T12:12:12.000Z",
  },
  user: {
    userId: "Loading...",
    name: "Loading...",
    email: "Loading...",
    address: "Loading...",
    picture: "/profile.png",
    phone: "Loading...",
    isAttached: false,
    isDeleted: false,
    createdAt: "2024-08-20T12:12:12.000Z",
    updatedAt: "2024-08-20T12:12:12.000Z",
  },
};

const DetailTransactionPage = () => {
  const router = useRouter();
  const { id } = router.query;
  // HANDLING NOTIFICATION
  const [successNotify, setSuccessNotify] = useState(null);
  const [errorNotify, setErrorNotify] = useState(null);
  const [confirmEdit, setConfirmEdit] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const open = Boolean(confirmEdit);

  useEffect(() => {
    if (successNotify) {
      setTimeout(() => {
        setSuccessNotify(null);
      }, 3000);
    }
    if (errorNotify) {
      setTimeout(() => {
        setErrorNotify(null);
      }, 3000);
    }
  }, [successNotify, errorNotify]);

  // HANDLING DATA
  const [data, setData] = useState(initData);

  const fetchData = async () => {
    try {
      const { data } = await axiosInstance.get(`/transactions/${id}`);
      console.log(data);
      setData(data.data);
    } catch (error) {
      router.push("/admin/transaksi");
      console.error(error);
    }
  };

  const handleEditStatus = async () => {
    try {
      await axiosInstance.put(`/transactions/${id}`, {
        status: selectedStatus,
      });
      fetchData();
      setSuccessNotify("Berhasil menghapus data");
    } catch (error) {
      setErrorNotify(error?.response?.item?.message || "Gagal menghapus data");
    } finally {
      setConfirmEdit(null);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      fetchData();
    }
  }, [router.isReady]);

  return (
    <>
      <Popover
        id={id}
        open={open}
        anchorEl={confirmEdit}
        onClose={() => setConfirmEdit(null)}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <Box className="flex flex-col gap-2 px-4 py-2">
          <Typography>Apakah anda yakin ingin mengubah status?</Typography>
          <Button
            color="error"
            variant="contained"
            className="mx-auto"
            onClick={handleEditStatus}
          >
            Ubah
          </Button>
        </Box>
      </Popover>
      <LayoutAdmin title={"Detail Transaksi"}>
        <div className="w-full flex flex-col lg:flex-row justify-center gap-4">
          <div className="bg-white w-full lg:w-1/2 xl:w-2/3 rounded-lg overflow-auto shadow p-4">
            <Typography variant="h5" className="text-center font-bold">
              Rincian Transaksi
            </Typography>
            <TableContainer component={Paper} className="mt-4">
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className="font-bold">ID Transaksi</TableCell>
                    <TableCell>{data?.transactionId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Status</TableCell>
                    <TableCell>
                      {data?.status === "PENDING" ? (
                        <span className="text-gray-500">{data?.status}</span>
                      ) : data?.status === "DIBAYAR" ? (
                        <span className="text-green-300">{data?.status}</span>
                      ) : data?.status === "DIANTAR" ? (
                        <span className="text-blue-500">{data?.status}</span>
                      ) : data?.status === "SELESAI" ? (
                        <span className="text-green-500">{data?.status}</span>
                      ) : data?.status === "DIBATALKAN" ? (
                        <span className="text-red-500">{data?.status}</span>
                      ) : (
                        <span className="text-gray-500">{data?.status}</span>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Dibuat Pada</TableCell>
                    <TableCell>{formatDate(data?.createdAt)}</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
            <Typography variant="h6" className="text-start font-bold mt-4">
              Atur Status
            </Typography>
            <div className="flex flex-col md:flex-row gap-4">
              <Button
                variant="contained"
                className="w-fit mt-4 "
                onClick={(event) => {
                  setConfirmEdit(event.currentTarget);
                  setSelectedStatus(2);
                }}
              >
                Dibayar
              </Button>
              <Button
                variant="contained"
                className="w-fit mt-4 bg-orange-500"
                onClick={(event) => {
                  setConfirmEdit(event.currentTarget);
                  setSelectedStatus(3);
                }}
              >
                DIANTAR
              </Button>
              <Button
                variant="contained"
                className="w-fit mt-4 bg-green-500"
                onClick={(event) => {
                  setConfirmEdit(event.currentTarget);
                  setSelectedStatus(4);
                }}
              >
                SELESAI
              </Button>
              <Button
                variant="contained"
                className="w-fit mt-4 bg-red-500"
                onClick={(event) => {
                  setConfirmEdit(event.currentTarget);
                  setSelectedStatus(5);
                }}
              >
                Batalkan
              </Button>
            </div>
            <Typography variant="h6" className="text-start font-bold mt-4">
              Produk
            </Typography>

            <TableContainer component={Paper} className="mt-4">
              <Table aria-label="simple table">
                <TableHead>
                  <TableCell className="font-bold">Nama Item</TableCell>
                  <TableCell className="font-bold">Jumlah</TableCell>
                  <TableCell className="font-bold">Harga</TableCell>
                </TableHead>
                {data?.items?.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{item?.itemName}</TableCell>
                      <TableCell>{item?.quantity}</TableCell>
                      <TableCell>{formatRupiah(item?.itemPrice)}</TableCell>
                    </TableRow>
                  );
                })}
              </Table>
            </TableContainer>
            <Typography variant="h6" className="text-start font-bold mt-4">
              Rincian Biaya
            </Typography>
            <TableContainer component={Paper} className="mt-4">
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className="font-bold">Total Produk</TableCell>
                    <TableCell>{formatRupiah(data?.totalAmount)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Ongkos Kirim</TableCell>
                    <TableCell>{formatRupiah(data?.totalAmount)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">
                      Total Pembayaran
                    </TableCell>
                    <TableCell>{formatRupiah(data?.totalAmount)}</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
          </div>
          <div className="bg-white w-full lg:w-1/2 xl:w-1/3 rounded-lg overflow-auto shadow p-4 flex flex-col">
            <Image
              src={data?.user?.picture || initData.user.picture}
              alt={data?.user?.name}
              width={200}
              height={200}
              className="w-32 aspect-square object-cover rounded-full self-center"
            />
            <Typography variant="body1" className="text-center mt-4 font-bold">
              {data?.user?.name}
            </Typography>
            <Typography variant="body2" className="text-center mt-1">
              {data?.user?.email}
            </Typography>
            <TableContainer component={Paper} className="mt-4">
              <Table aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold">Nomor HP</TableCell>
                    <TableCell>
                      {formatPhone(data?.user?.phone) || "Belum Diisi"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Alamat</TableCell>
                    <TableCell>
                      {data?.user?.address || "Belum Diisi"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Link href={`/admin/pengguna/${data?.user?.userId}`}>
              <Button variant="contained" className="w-full mt-4">
                Lihat Detail Pengguna
              </Button>
            </Link>
          </div>
        </div>
      </LayoutAdmin>
    </>
  );
};

export default AuthPage(DetailTransactionPage);

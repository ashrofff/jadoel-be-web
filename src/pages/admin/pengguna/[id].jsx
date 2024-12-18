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
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TbExternalLink } from "react-icons/tb";

const initData = {
  userId: "Loading...",
  name: "Loading...",
  email: "Loading...",
  address: "Loading...",
  picture: "/profile.png",
  phone: "Loading...",
  isDeleted: false,
  createdAt: "2024-08-20T12:12:12.000Z",
  updatedAt: "2024-08-20T12:12:12.000Z",
  transactions: [],
};

const DetailUserPage = () => {
  const router = useRouter();
  const { id } = router.query;


  // HANDLING DATA
  const [data, setData] = useState(initData);

  const fetchData = async () => {
    try {
      const { data } = await axiosInstance.get(`/users/${id}`);
      console.log(data);
      setData(data.data);
    } catch (error) {
      router.push("/admin/pengguna");
      console.error(error);
    }
  };
  useEffect(() => {
    if (router.isReady) {
      fetchData();
    }
  }, [router.isReady]);

  return (
    <>
      <LayoutAdmin title={"Detail Pengguna"}>
        <div className="w-full flex flex-col lg:flex-row justify-center gap-4">
          <div className="bg-white w-full lg:w-full xl:w-full rounded-lg overflow-auto shadow p-4">
            <div className="flex flex-col md:flex-row justify-center items-center mx-auto gap-4 my-4">
              <Image
                src={data?.picture || initData.picture}
                alt={data?.name}
                width={200}
                height={200}
                className="w-32 aspect-square object-cover rounded-full"
              />
              <div className="flex flex-col text-center md:text-start">
                <Typography variant="body1" className="font-bold md:text-2xl">
                  {data?.name}
                </Typography>
                <Typography variant="body2" className="font-normal">
                  {data?.email}
                </Typography>
              </div>
            </div>
            <TableContainer component={Paper} className="mt-4">
              <Table aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold">ID Pengguna</TableCell>
                    <TableCell>{data?.userId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Nomor HP</TableCell>
                    <TableCell>
                      {formatPhone(data?.phone) || "Belum Diisi"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Alamat</TableCell>
                    <TableCell>{data?.address || "Belum Diisi"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">
                      Status
                    </TableCell>
                    <TableCell>{data?.status}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">
                      Dibuat Pada
                    </TableCell>
                    <TableCell>{data.createdAt? formatDate(data.createdAt) : "Belum Diisi"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

          </div>

        </div>
      </LayoutAdmin>
    </>
  );
};

export default AuthPage(DetailUserPage);

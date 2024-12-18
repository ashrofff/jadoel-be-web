import {
  resClientError,
  resNotAllowed,
  resNotFound,
  resServerError,
  resSuccess,
} from "@/helper/response";
import sevenDaysAgo from "@/helper/sevenDaysAgo";
import adminAuth from "@/middleware/adminAuth";
import { getUserById, deleteUser, setAttached } from "@/models/user";
import threeDaysAhead from "@/helper/threeDaysAhead";
import oneMonthAhead from "@/helper/oneMonthAhead";
import removeCloudinary from "@/utils/cloudinary/removeCloudinary";

async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json(resClientError("ID harus diisi"));
  try {
    if (req.method === "GET") {
      const user = await getUserById(id);

      if (!user) return res.status(404).json(resNotFound());
      delete user.password;
      delete user.refreshToken;
      if (user.status === 1) {
        user.status = "Aktif";
      } else if (user.status === 2) {
        user.status = "Nonaktif";
      } else {
        user.status = "Undefined";
      }

      return res.status(200).json(resSuccess("Data Pengguna", user));
    }

    if (req.method === "DELETE") {
      const user = await getUserById(id);
      if (!user) return res.status(404).json(resNotFound());
      if (user.isDeleted) {
        return res.status(404).json(resNotFound());
      }
      if (user.picture) {
        await removeCloudinary(user.picture, "profile");
      }
      await deleteUser(id);
      return res.status(200).json(resSuccess("Berhasil menghapus user", user));
    }

    if (req.method === "PATCH") {
      const user = await getUserById(id);
      if (!user) return res.status(404).json(resNotFound());
      const edited = await setAttached(id, !user.isAttached);
      return res
        .status(200)
        .json(
          resSuccess(
            edited.isAttached
              ? "Berhasil menandai terpasang"
              : "Berhasil menandai tidak terpasang",
            edited
          )
        );
    }

    return res.status(405).json(resNotAllowed());
  } catch (error) {
    console.log(error);
    return res.status(500).json(resServerError());
  }
}

export default adminAuth(handler);

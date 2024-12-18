import {
  resClientError,
  resNotAllowed,
  resServerError,
  resSuccess,
} from "@/helper/response";
import userAuth from "@/middleware/userAuth";
import { editUserShipping, getUserShipping } from "@/models/userShipping";

async function handler(req, res) {
  try {
    if (req.method === "PUT") {
      const { userId } = req.decoded;
      const { address, longitude, latitude } = req.body;
      const edit = await editUserShipping(userId, address, longitude, latitude);
      return res
        .status(200)
        .json(resSuccess("Update Data Pengiriman Berhasil", edit));
    } else if (req.method === "GET") {
      const { userId } = req.decoded;
      const userShipping = await getUserShipping(userId);

      if (!userShipping) {
        return res
          .status(400)
          .json(resClientError("Data pengiriman tidak ditemukan"));
      }

      return res.status(200).json(resSuccess("data pengiriman lengkap", userShipping));
    }

    return res.status(405).json(resNotAllowed());
  } catch (error) {
    console.log(error);
    return res.status(500).json(resServerError());
  }
}

export default userAuth(handler);

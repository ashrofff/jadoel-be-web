import {
  resClientError,
  resNotAllowed,
  resServerError,
  resSuccess,
} from "@/helper/response";
import sevenDaysAgo from "@/helper/sevenDaysAgo";
import adminAuth from "@/middleware/adminAuth";
import { getAllUsers } from "@/models/user";
import threeDaysAhead from "@/helper/threeDaysAhead";
import oneMonthAhead from "@/helper/oneMonthAhead";

async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const users = await getAllUsers();

      for (const user of users) {
        delete user.password;
        delete user.refreshToken;
        if (user.status === 1) {
          user.status = "Aktif";
        } else if (user.status === 2) {
          user.status = "Nonaktif";
        } else {
          user.status = "Undefined";
        }

      }

      return res.status(200).json(resSuccess("Data Pengguna", users));
    }

    return res.status(405).json(resNotAllowed());
  } catch (error) {
    console.log(error);
    return res.status(500).json(resServerError());
  }
}

export default adminAuth(handler);

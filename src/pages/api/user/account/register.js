import {
  resClientError,
  resNotAllowed,
  resServerError,
  resSuccess,
} from "@/helper/response";
import { getUserByEmail, registerUser } from "@/models/user";
import bcrypt from "bcrypt";
import { addUserShipping } from "@/models/userShipping";

async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { name, email, password, phone, address } = req.body;
      if (!name || !email || !password || !phone || !address) {
        return res.status(400).json(resClientError("Data harus diisi"));
      }
      const user = await getUserByEmail(email);

      if (user) {
        return res.status(400).json(resClientError("Email sudah terdaftar"));
      }

      const hash = await bcrypt.hash(password, 10);
      const newUser = await registerUser(name, email, hash, phone, address);
      await addUserShipping(newUser.userId, address);
      delete newUser.password;
      delete newUser.refreshToken;

      return res.status(200).json(resSuccess("Register Berhasil", newUser));
    }

    return res.status(405).json(resNotAllowed());
  } catch (error) {
    console.log(error);
    return res.status(500).json(resServerError());
  }
}

export default handler;

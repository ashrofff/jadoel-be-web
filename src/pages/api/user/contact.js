import {
  resClientError,
  resNotAllowed,
  resServerError,
  resSuccess,
} from "@/helper/response";
import userAuth from "@/middleware/userAuth";

import { getStoreConfig } from "@/models/storeConfig";

async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const storeConfig = await getStoreConfig();


      return res.status(200).json(resSuccess("data ongkir", storeConfig.phoneStore));
    }

    return res.status(405).json(resNotAllowed());
  } catch (error) {
    console.log(error);
    return res.status(500).json(resServerError());
  }
}

export default userAuth(handler);

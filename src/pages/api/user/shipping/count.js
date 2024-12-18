import {
  resClientError,
  resNotAllowed,
  resServerError,
  resSuccess,
} from "@/helper/response";
import userAuth from "@/middleware/userAuth";
import { getUserShipping } from "@/models/userShipping";

import { getStoreConfig } from "@/models/storeConfig";

import hitungOngkir from "@/helper/shippingFee";

async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { userId } = req.decoded;
      const userShipping = await getUserShipping(userId);

      if (!userShipping) {
        return res
          .status(400)
          .json(resClientError("Data pengiriman tidak ditemukan"));
      }

      const { longitude, latitude } = userShipping;
      if (!longitude || !latitude) {
        return res
          .status(400)
          .json(resClientError("Lengkapi data pengiriman terlebih dahulu"));
      }
      const storeConfig = await getStoreConfig();
      const ongkir = hitungOngkir(
        latitude,
        longitude,
        storeConfig.latitudeStore,
        storeConfig.longitudeStore,
        storeConfig.costPerKm
      );
      return res.status(200).json(resSuccess("data ongkir", ongkir));
    }

    return res.status(405).json(resNotAllowed());
  } catch (error) {
    console.log(error);
    return res.status(500).json(resServerError());
  }
}

export default userAuth(handler);

import {
  resClientError,
  resNotAllowed,
  resServerError,
  resSuccess,
} from "@/helper/response";
import adminAuth from "@/middleware/adminAuth";
import { getStoreConfig, updateStoreConfig } from "@/models/storeConfig";

async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const config = await getStoreConfig();
      return res.status(200).json(resSuccess("Item", config));
    }

    if (req.method === "PUT") {
      const { longitudeStore, latitudeStore, costPerKm, phoneStore } = req.body;

      if (!longitudeStore || !latitudeStore || !costPerKm || !phoneStore) {
        return res.status(400).json(resClientError("Semua field harus diisi"));
      }

      const config = await updateStoreConfig(
        longitudeStore,
        latitudeStore,
        costPerKm,
        phoneStore
      );

      return res.status(200).json(resSuccess("Data Paket", config));
    }

    return res.status(405).json(resNotAllowed());
  } catch (error) {
    console.log(error);
    return res.status(500).json(resServerError());
  }
}

export default adminAuth(handler);

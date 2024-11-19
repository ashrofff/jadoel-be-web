import {
  resClientError,
  resNotAllowed,
  resNotFound,
  resServerError,
  resSuccess,
} from "@/helper/response";
import adminAuth from "@/middleware/adminAuth";
import { getItemById, deleteItem, setActive, editItem } from "@/models/item";
import removeCloudinary from "@/utils/cloudinary/removeCloudinary";

async function handler(req, res) {
  const { id } = req.query;

  if (!id) return res.status(400).json(resClientError("ID harus diisi"));

  try {
    if (req.method === "GET") {
      const items = await getItemById(id);
      if (!items) return res.status(404).json(resNotFound());
      return res.status(200).json(resSuccess("Data Paket", items));
    }

    if (req.method === "PATCH") {
      const { isAvailable } = req.body;
      if (typeof isAvailable !== "boolean")
        return res
          .status(400)
          .json(resClientError("isAvailable harus berupa boolean"));
      const items = await getItemById(id);
      if (!items) return res.status(404).json(resNotFound());
      const edited = await setActive(id, isAvailable);
      return res
        .status(200)
        .json(
          resSuccess(
            isAvailable
              ? "Berhasil mengaktifkan paket"
              : "Berhasil menonaktifkan paket",
            edited
          )
        );
    }

    if (req.method === "DELETE") {
      const items = await getItemById(id);
      if (!items) return res.status(404).json(resNotFound());
      if (items.image) {
        await removeCloudinary(items.image, "item");
      }
      await deleteItem(id);
      return res
        .status(200)
        .json(resSuccess("Berhasil menghapus paket", items));
    }

    if (req.method === "PUT") {
      const { name, description, price } = req.body;

      if (!name || !description || !price) {
        return res.status(400).json(resClientError("Semua field harus diisi"));
      }
      if (isNaN(Number(price))) {
        return res.status(400).json(resClientError("Harga harus berupa angka"));
      }

      const items = await getItemById(id);
      if (!items) return res.status(404).json(resNotFound());

      await Promise.all([editItem(id, name, description, price)]);

      return res.status(200).json(resSuccess("Berhasil mengedit paket"));
    }

    return res.status(405).json(resNotAllowed());
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json(resServerError());
  }
}

export default adminAuth(handler);

import { resClientError, resNotAllowed, resNotFound, resServerError, resSuccess } from "@/helper/response";
import userAuth from "@/middleware/userAuth";
import { getItemById, } from "@/models/item";

async function handler(req, res) {
    const { id } = req.query;

    if (!id) return res.status(400).json(resClientError('ID harus diisi'));

    try {
        if (req.method === 'GET') {
            const items = await getItemById(id);
            if (!items) return res.status(404).json(resNotFound());
            return res.status(200).json(resSuccess("Data Produk", items));
        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json(resServerError());
    }
}

export default userAuth(handler);

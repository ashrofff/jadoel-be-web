import { resClientError, resNotAllowed, resServerError, resSuccess } from "@/helper/response";
import userAuth from "@/middleware/userAuth";
import { getAllItems, getAllItemsPopular } from "@/models/item";

async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const isPopular = req.query.query === 'popular' ? true : false
            if (isPopular) {                
                const items = await getAllItemsPopular()
                return res.status(200).json(resSuccess("Data Produk", items));
            } else {                
                const items = await getAllItems()
                return res.status(200).json(resSuccess("Data Produk", items));
            }
        }        

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.log(error)
        return res.status(500).json(resServerError());
    }
}

export default userAuth(handler)
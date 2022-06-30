import products from './products.json';
import fs from "fs";

/**
 * 製品を追加で扱うためのAPI
 */
export default function handler(req, res){
    if (req.method === "POST"){
        try {
            console.log("body is ", req.body)
            // リクエストパラメータから情報を取得する。
            const { name, price, image_url, description, filename, hash } = req.body;

            // 前回のプロダクトIDを元に新しいプロダクトIDを作成します。
            const maxID = products.reduce((max, product) => Math.max(max, product.id), 0);
            // 変数に詰める。
            products.push({
                id: maxID + 1,
                name,
                price,
                image_url,
                description,
                filename,
                hash,
            });
            // 製品情報を書き込む
            fs.writeFileSync("./pages/api/products.json", JSON.stringify(products, null, 2));
            res.status(200).send({ status: "ok" });
        } catch (error) {
            console.error(error);
            res.status(500).json({error: "error adding product"});
            return;
        }
    } else {
        res.status(405).send(`Method ${req.method} not allowed`);
    }
}
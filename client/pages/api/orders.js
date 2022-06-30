import orders from "./order.json";
import { writeFile } from "fs/promises";

/**
 * 注文内容を取得するためのAPI
 */
function get(req, res) {
  const { buyer } = req.query;

  // このアドレスに注文があるかどうかを確認します。
  const buyerOrders = orders.filter((order) => order.buyer === buyer);

  if (buyerOrders.length === 0) {
    // 204はリクエストを正常に処理し、コンテンツを返さないステータスです。
    res.status(204).send();
  } else {
    res.status(200).json(buyerOrders);
  }
}

/**
 * 注文内容を追加するためのAPI
 */
async function post(req, res) {
  console.log("Received add order request", req.body);
  // 新しい注文をorders.jsonに追加します。
  try {
    const newOrder = req.body;

    // このアドレスが対象の商品を購入していない場合は、orders.jsonに注文を追加します。
    if (!orders.find((order) => order.buyer === newOrder.buyer.toString() && order.itemID === newOrder.itemID)) {
      orders.push(newOrder);
      await writeFile("./orders.json", JSON.stringify(orders, null, 2));
      res.status(200).json(orders);
    } else {
      res.status(400).send("Order already exists");
    }
  } catch (err) {
    res.status(400).send(err);
  }
}

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      get(req, res);
      break;
    case "POST":
      await post(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed`);
  }
}
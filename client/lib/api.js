/**
 * 注文データを追加するメソッド
 */
export const addOrder = async (order) => {
    console.log("adding order ", order, "To DB");
    await fetch("../api/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
    });
};

/**
 * 接続しているアドレスが購入済みかどうか判断するメソッド
 */
export const hasPurchased = async (publicKey, itemID) => {
    // 公開鍵をパラメータとしてGETリクエストを送信します。
    const response = await fetch(`../api/orders?buyer=${publicKey.toString()}`);

    // レスポンスコードが200の場合の処理です。
    if (response.status === 200) {
        const json = await response.json();
        console.log("Current wallet's orders are:", json);
        // 注文が存在した場合の処理です。
        if (json.length > 0) {
            // この購入者とアイテムIDのレコードがあるかどうかを確認します。
            const order = json.find((order) => order.buyer === publicKey.toString() && order.itemID === itemID);
            if (order) {
                return true;
            }
        }
    }
    return false;
};
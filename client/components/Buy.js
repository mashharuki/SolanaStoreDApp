import React, { useState, useMemo, useEffect } from "react";
import { Keypair, Transaction } from "@solana/web3.js";
import { findReference, FindReferenceError } from "@solana/pay";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { InfinitySpin } from "react-loader-spinner";
import IPFSDownload from "./IpfsDownload";
import { addOrder, hasPurchased, fetchItem  } from '../lib/api';

/**
 * 支払いのステータスを管理する変数
 */
const STATUS = {
    Initial: "Initial",
    Submitted: "Submitted",
    Paid: "Paid",
};

/**
 * Buyコンポーネント
 */
export default function Buy({ itemID }) {
    // 必要な変数を用意する。
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    // 注文を識別するために使用される公開鍵を設定する。
    const orderID = useMemo(() => Keypair.generate().publicKey, []);   

    const [item, setItem] = useState(null); 
    const [status, setStatus] = useState(STATUS.Initial);
    const [loading, setLoading] = useState(false); // 上記全てのロード状態を設定します。

    // Reactフック
    const order = useMemo(() => ({
        buyer: publicKey.toString(),
        orderID: orderID.toString(),
        itemID: itemID,
    }), [publicKey, orderID, itemID]);

    // サーバーからトランザクションオブジェクトを取得します。
    const processTransaction = async () => {
        setLoading(true);
        // createTransaction APIを呼び出す。
        const txResponse = await fetch("./../api/createTransaction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(order),
        });

        const txData = await txResponse.json();
        console.log("txData", txData)

        // トランザクションオブジェクトを作成します。
        const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
        console.log("Tx data is", tx);

        try {
            // ネットワークにトランザクションを送信します。
            const txHash = await sendTransaction(tx, connection);
            console.log(`Transaction sent: https://solscan.io/tx/${txHash}?cluster=devnet`);
            // この処理は失敗する可能性がありますが、現段階ではtrueを設定しておきます。
            setStatus(STATUS.Submitted);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // 副作用フック
    useEffect(() => {
        // トランザクションが確認されたかどうかを確認します。
        if (status === STATUS.Submitted) {
            setLoading(true);
            const interval = setInterval(async () => {
                try {
                    const result = await findReference(connection, orderID);
                    console.log("Finding tx reference", result.confirmationStatus);
                    if (result.confirmationStatus === "confirmed" || result.confirmationStatus === "finalized") {
                        clearInterval(interval);
                        setStatus(STATUS.Paid);
                        setLoading(false);
                        addOrder(order); 
                        alert("Thank you for your purchase!");
                    }
                } catch (e) {
                    if (e instanceof FindReferenceError) {
                        return null;
                    }
                    console.error("Unknown error", e);
                } finally {
                    setLoading(false);
                }
            }, 1000);

            return () => {
                clearInterval(interval);
            };
        }

        /**
         * 製品情報を取得するメソッド
         */
        async function getItem(itemID) {
            // fetchItemメソッドを呼び出す。
            const item = await fetchItem(itemID);
            // ステート変数を更新する。
            setItem(item);
        }

        if (status === STATUS.Paid) {
            getItem(itemID);
        }
    }, [status]);

    // 副作用フック
    useEffect(() => {
        // 購入済みかどうかチェックする。
        async function checkPurchased() {
            const purchased = await hasPurchased(publicKey, itemID);
            // 購入済みの場合は、状態を Paidにする。
            if (purchased) {
                setStatus(STATUS.Paid);
                // 相手も情報を取得する。
                const item = await fetchItem(itemID);
                setItem(item);
            }
        }
        checkPurchased();
    }, [publicKey, itemID]);

    if (!publicKey) {
        return (
            <div>
                <p>You need to connect your wallet to make transactions</p>
            </div>
        );
    }

    if (loading) {
        return <InfinitySpin color="gray" />;
    }

    return (
        <div>
            {item ? (
                /* トランザクションの送金が完了した場合は、ファイル名とハッシュ値を指定してダウンロードリンクコンポーネントを呼び出す。 */
                <IPFSDownload filename={item.filename} hash={item.hash}/>
            ) : (
                <button disabled={loading} className="buy-button" onClick={processTransaction}>
                    Buy now →
                </button>
            )}
        </div>
    );
}
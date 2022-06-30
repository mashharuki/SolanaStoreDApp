import React, { useEffect, useState } from "react";
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Product from "../components/Product";
import CreateProduct from "../components/CreateProduct";

const TWITTER_HANDLE = "HARUKI05758694";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

/**
 * Appコンポーネント
 */
const App = () => {  
  // サポートしているウォレットからユーザーのウォレットアドレスを取得します。
  const { publicKey } = useWallet();
  // ownerであるか確認する。
  const isOwner = ( publicKey ? publicKey.toString() === process.env.NEXT_PUBLIC_OWNER_PUBLIC_KEY : false );
  // ステート変数
  const [products, setProducts] = useState([]);
  const [creating, setCreating] = useState(false);

  /**
   * ウォレットが接続されていない時に描画するコンポーネント
   */
  const renderNotConnectedContainer = () => (
    <div>
      <img src="https://media.giphy.com/media/FWAcpJsFT9mvrv0e7a/giphy.gif" alt="anya" />
      <div className="button-container">
        <WalletMultiButton className="cta-button connect-wallet-button" />
      </div>
    </div>
  );

  /**
   * 商品内容をレンダリンするコンポーネント
   */
  const renderItemBuyContainer = () => (
    <div className="products-container">
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  );

  // 副作用フック
  useEffect(() => {
    if (publicKey) {
      // fetchProducts APIを実行して製品情報を取得する。
      fetch(`/api/fetchProducts`)
        .then(response => response.json())
        .then(data => {
          setProducts(data);
          console.log("Products", data);
        });
    }
  }, [publicKey]);


  return (
    <div className="App">
      <div className="container">
        {/* ヘッダー */}
        <header className="header-container">
          <p className="header"> ✨ My Solana Image Store ✨</p>
          <p className="sub-text">The only Image store that accepts shitcoins</p>
          {/* ownerであるときのみ描画 */}
          {isOwner && (
            <button className="create-product-button" onClick={() => setCreating(!creating)}>
              {creating ? "Close" : "Create Product"}
            </button>
          )}
        </header>
        {/* メイン */}
        <main>
          {creating && <CreateProduct />}
          {publicKey ? renderItemBuyContainer() : renderNotConnectedContainer()}
        </main>
        {/* フッター */}
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src="twitter-logo.svg" />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;

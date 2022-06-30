import React from "react";
import styles from "../styles/Product.module.css";
import IPFSDownload from './IpfsDownload';

/**
 * Productコンポーネント
 */
export default function Product({ product }) {
    // 引数から値を得る。
  const { id, name, price, description, image_url } = product;

  return (
    <div className={styles.product_container}>
      <div >
        <img className={styles.product_image}src={image_url} alt={name} />
      </div>

      <div className={styles.product_details}>
        <div className={styles.product_text}>
          <div className={styles.product_title}>{name}</div>
          <div className={styles.product_description}>{description}</div>
        </div>

        <div className={styles.product_action}>
          <div className={styles.product_price}>{price} USDC</div>
          {/* 以下の部分は後ほどAPIからハッシュを取得する処理に変更します。 */}
          <IPFSDownload filename="anya" hash="QmcJPLeiXBwA17WASSXs5GPWJs1n1HEmEmrtcmDgWjApjm" cta="Download goods"/>
        </div>
      </div>
    </div>
  );
}
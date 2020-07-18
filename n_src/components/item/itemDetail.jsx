import React, { useEffect } from "react";
import "./itemDetail.css";

const ItemDetail = ({ item }) => {
  const lang = "fr";

  useEffect(() => {
    document.getElementById("desc").innerHTML = item.description;
  }, [item, lang]);

  return (
    <div className="desc_container">
      <img src={`https://xivapi.com${item.icon}`} alt={item.name} />
      <h3>{item.name}</h3>
      <p id="desc"></p>
    </div>
  );
};

export default ItemDetail;

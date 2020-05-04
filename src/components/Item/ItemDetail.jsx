import React, { useEffect, useContext } from "react";
import { LangContext } from "../../AppContext";
import "./ItemDetail.css";

const ItemDetail = ({ item }) => {
  const lang = useContext(LangContext);

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

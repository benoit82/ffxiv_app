import React, { useEffect, useContext } from "react";
import { LangContext } from "../AppContext";
import "./ItemDetail.css";

const ItemDetail = ({ item }) => {
  const lang = useContext(LangContext);

  useEffect(() => {
    document.getElementById("desc").innerHTML = item[`Description_${lang}`];
  }, [item, lang]);

  return (
    <div className="desc_container">
      <img src={`https://xivapi.com${item.Icon}`} alt={item[`Name_${lang}`]} />
      <h1>{item[`Name_${lang}`]}</h1>
      <p id="desc"></p>
    </div>
  );
};

export default ItemDetail;

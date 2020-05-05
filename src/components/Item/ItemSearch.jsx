import React, { useState, useEffect, useContext } from "react";
import { LangContext } from "../../AppContext";
import axios from "axios";

import ItemDetail from "./ItemDetail";
import { Item } from "../../models";

const ItemSearch = () => {
  const [item, setItem] = useState({});
  const [id, setId] = useState(29509);
  const lang = useContext(LangContext);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`https://xivapi.com/item/${id}`);
      setItem(new Item(res.data, lang));
    })();
  }, [id, lang]);

  return (
    <>
      <input
        type="number"
        name="id"
        id="id"
        value={id}
        onChange={(event) => {
          setId(event.target.value);
        }}
      />
      <ItemDetail item={item} />
    </>
  );
};

export default ItemSearch;

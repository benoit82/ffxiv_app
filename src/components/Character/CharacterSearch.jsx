import React, { useState } from "react";
import CharacterDetail from "./CharacterDetail";
import axios from "axios";
import Loading from "../Loading";

const CharacterSearch = () => {
  const min_caracter = 6;
  const [charactersId, setCharactersId] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCharacter = async (chrName, server) => {
    setLoading(true);
    setCharactersId([]);
    const res = await axios.get(
      `https://xivapi.com/character/search?name=${chrName}&server=${server}`
    );
    if (res.data.Results.length === 1) {
      setCharactersId([res.data.Results[0].ID]);
    } else {
      let resCumul = [];
      res.data.Results.forEach((res) => {
        resCumul = [...resCumul, res.ID];
        console.log("res", resCumul);
      });
      setCharactersId(resCumul);
    }
    setLoading(false);
  };

  const handleClickSearch = (e) => {
    e.preventDefault();
    const chrName = document.querySelector("#chr_name").value;
    const server = document.querySelector("#select_server").value;
    chrName.length >= min_caracter
      ? fetchCharacter(chrName, server)
      : alert(
          `Nom indiqué trop petit (minimum : ${min_caracter} caractères !)`
        );
  };

  return (
    <div className="form_container">
      <div className="form_grp">
        <label htmlFor="chr_name" className="form_grp_label">
          Nom du personnage
        </label>
        <input
          type="text"
          className="form_grp_text_field"
          id="chr_name"
          name="chr_name"
        />
      </div>
      <div className="form_grp">
        <label htmlFor="server" className="form_grp_label">
          Serveur
        </label>
        <select name="select_server" id="select_server">
          <option value="ragnarok" defaultValue>
            ragnarok
          </option>
        </select>
      </div>
      <button type="submit" onClick={handleClickSearch}>
        rechercher
      </button>
      {loading && <Loading />}
      {charactersId.map((id) => {
        return <CharacterDetail key={id} chrId={id} />;
      })}
    </div>
  );
};

export default CharacterSearch;

import React, { useState, useEffect } from "react";
import CharacterDetail from "./CharacterDetail";
import axios from "axios";
import Loading from "../Loading";

import "./CharacterSearch.css";

const CharacterSearch = () => {
  const [loading, setLoading] = useState(false);
  const [serverList, setServerList] = useState([]);
  const [charactersId, setCharactersId] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get("https://xivapi.com/servers");
      setServerList(response.data);
    })();
  }, []);

  const requestCharactersList = async (chrName, server) => {
    let resCumul = [];
    setLoading(true);
    setCharactersId([]);
    const res = await axios.get(
      `https://xivapi.com/character/search?name=${chrName}&server=${server}`
    );
    res.data.Results.forEach((res) => {
      resCumul = [...resCumul, res.ID];
      console.log("res", resCumul);
    });
    setCharactersId(resCumul);
    setLoading(false);
  };

  const fetchCharacters = (e) => {
    e.preventDefault();
    const chrName = document.querySelector("#chr_name").value;
    const server = document.querySelector("#select_server").value;
    requestCharactersList(chrName, server);
  };

  return (
    <>
      <div className="form_container">
        <form onSubmit={fetchCharacters}>
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
            <select
              name="select_server"
              id="select_server"
              className="form_grp_select_field"
            >
              {serverList.length > 0 &&
                serverList.map((server, index) => {
                  return (
                    <option key={index} value={`${server}`}>
                      {server}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="form_grp">
            <button type="submit">rechercher</button>
          </div>
        </form>
      </div>
      {loading && <Loading />}
      {charactersId.map((id) => {
        return <CharacterDetail key={id} chrId={id} />;
      })}
    </>
  );
};

export default CharacterSearch;

import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import { Character } from "../../models";
import axios from "axios";

import "./CharacterDetail.css";

const CharacterDetail = ({ chrId }) => {
  const [character, setCharacter] = useState({ loading: true });

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        `https://xivapi.com/character/${chrId}?data=CJ`
      );
      setCharacter(new Character(res.data.Character));
    })();
  }, [chrId]);

  const containerHandleClick = (e) => {
    const characterContainers = document.querySelectorAll(
      ".character_main_container"
    );
    characterContainers.forEach((container) => {
      container.classList.remove("active");
    });
    e.currentTarget.classList.add("active");
  };

  const { id, name, avatar } = character;
  return (
    <>
      {character.loading && <Loading />}
      {!character.loading && (
        <div
          className="character_main_container"
          onClick={containerHandleClick}
        >
          <aside>
            <img src={avatar} alt={name} />
          </aside>
          <aside className="character_details_container">
            <h3>{name}</h3>
            <p>id = {id}</p>
          </aside>
        </div>
      )}
    </>
  );
};

export default CharacterDetail;

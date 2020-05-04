import React, { useEffect, useState } from "react";
import axios from "axios";

import "./CharacterDetail.css";

const CharacterDetail = ({ chrId }) => {
  const [character, setCharacter] = useState({ loading: true });

  useEffect(() => {
    const getCharacter = async () => {
      const res = await axios.get(`https://xivapi.com/character/${chrId}`);
      setCharacter(res.data.Character);
    };

    getCharacter();
  }, [chrId]);

  const containerHandleClick = (e) => {
    const characterContainers = document.querySelectorAll(
      ".character_container"
    );
    characterContainers.forEach((container) => {
      container.classList.remove("active");
    });
    e.currentTarget.classList.add("active");
  };

  const { ID, Name, Avatar } = character;
  return (
    <>
      <div className="character_container" onClick={containerHandleClick}>
        {character.loading ? (
          <p>Chargement ...</p>
        ) : (
          <>
            <aside>
              <img src={Avatar} alt={Name} />
            </aside>
            <aside>
              <h3>{Name}</h3>
              <p>ID = {ID}</p>
            </aside>
          </>
        )}
      </div>
    </>
  );
};

export default CharacterDetail;

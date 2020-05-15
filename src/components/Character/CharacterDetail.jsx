import React from "react";
import "./CharacterDetail.css";

const CharacterDetail = ({ chr }) => {


  const { name, avatar } = chr;
  return (
    <div
      className="character_main_container"
    >
      <aside>
        <img src={avatar} alt={name} />
      </aside>
      <aside className="character_details_container">
        <h4>{name}</h4>
      </aside>
    </div>

  );
};

export default CharacterDetail;

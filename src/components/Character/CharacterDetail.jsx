import React from "react";
import "./CharacterDetail.css";

const CharacterDetail = ({ chr }) => {
  const containerHandleClick = (e) => {
    const characterContainers = document.querySelectorAll(
      ".character_main_container"
    );
    characterContainers.forEach((container) => {
      container.classList.remove("active");
    });
    e.currentTarget.classList.add("active");
  };

  const { id, name, avatar } = chr;
  return (
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

  );
};

export default CharacterDetail;

import React from "react";

import "./Navbar.scss";

const Navbar = () => {
  return (
    <nav className="navbar_container">
      <input type="checkbox" className="burger" defaultChecked />
      <ul className="grp_list">
        <li className="list_item">
          <a href="#">lien 1</a>
        </li>
        <li className="list_item">
          <a href="#">lien 2</a>
        </li>
        <li className="list_item">
          <a href="#">lien 3</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

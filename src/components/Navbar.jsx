import React from "react";
import { NavLink } from "react-router-dom";

import "./Navbar.scss";

const Navbar = () => {
  return (
    <nav className="navbar_container">
      <input type="checkbox" className="burger" defaultChecked />
      <ul className="grp_list">
        <li className="list_item">
          <NavLink to="/itemSearch">Items</NavLink>
        </li>
        <li className="list_item">
          <NavLink to="/characterSearch">Characters</NavLink>
        </li>
        <li className="list_item">
          <NavLink to="/signup">Inscription</NavLink>
        </li>
        <li className="list_item">
          <NavLink to="/login">Connection</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

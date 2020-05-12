import React from "react";
import { NavLink, Link } from "react-router-dom"
import Navbar from 'react-bootstrap/Navbar'
import Nav from "react-bootstrap/Nav"
import { Disconnect } from "./index"


const Menu = ({ auth }) => {

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" >
      <Link className="navbar-brand" to="/">FFXIV-Roster Manager</Link>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          {/* si l'utilisateur est connecté */
            auth && (<>
              <NavLink className="nav-link" to="/itemSearch">Item</NavLink>
              <NavLink className="nav-link" to="/characterSearch">Personnage</NavLink>
            </>)}
        </Nav>
        <Nav>
          {/* si l'utilisateur n'est pas connecté */
            !auth && (<>
              <NavLink className="nav-link login" to="/login"><i className="fas fa-sign-in-alt"></i>Login</NavLink>
              <NavLink className="nav-link" to="/signup"><i className="fas fa-user-plus"></i>Inscription</NavLink>
            </>)}
          {/* si l'utilisateur est connecté */
            auth && (<>
              <NavLink className="nav-link" to="/admin"><i className="fas fa-meteor"></i>Admin</NavLink>
              <Disconnect />
            </>)}

        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Menu;

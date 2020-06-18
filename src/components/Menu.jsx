import React from "react";
import { NavLink, Link } from "react-router-dom"
import Navbar from 'react-bootstrap/Navbar'
import Nav from "react-bootstrap/Nav"
import { Disconnect } from "./index"


const Menu = ({ user }) => {
  const { isLoggedIn, isAdmin } = user;
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" >
      <Link className="navbar-brand" to="/">FFXIV-Roster Helper <span class="font-italic">{process.env.REACT_APP_VERSION}</span></Link>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          {/* si l'utilisateur est connecté */
            isLoggedIn && <>
              {/* <NavLink className="nav-link" to="/item">Item</NavLink> NOT USED */}
              <NavLink className="nav-link" to="/chr"><i className="fas fa-gamepad"></i>Mes persos - roster</NavLink>
              <NavLink className="nav-link" to="/param"><i className="fas fa-cog"></i>Mes paramètres</NavLink>
            </>}
        </Nav>
        <Nav>
          {/* si l'utilisateur n'est pas connecté */
            !isLoggedIn && <>
              <NavLink className="nav-link login" to="/login"><i className="fas fa-sign-in-alt"></i>Login</NavLink>
              <NavLink className="nav-link" to="/signup"><i className="fas fa-user-plus"></i>Inscription</NavLink>
            </>}
          {/* si l'utilisateur est admin */
            isAdmin && <>
              <NavLink className="nav-link" to="/admin"><i className="fas fa-meteor"></i>Admin</NavLink>
            </>
          }
          {/* Si l'utilisateur est connecté */
            isLoggedIn && <Disconnect />
          }

        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Menu;

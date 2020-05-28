import React from "react";
import { NavLink, Link } from "react-router-dom"
import Navbar from 'react-bootstrap/Navbar'
import Nav from "react-bootstrap/Nav"
import { Disconnect } from "./index"


const Menu = ({ user }) => {
  const { isLoggedIn, isAdmin, isRaidLeader } = user;
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" >
      <Link className="navbar-brand" to="/">FFXIV-Roster Manager</Link>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          {/* si l'utilisateur est connecté */
            isLoggedIn && (<>
              <NavLink className="nav-link" to="/itemSearch">Item</NavLink>
              <NavLink className="nav-link" to="/user"><i className="fas fa-cog"></i>Mon profile</NavLink>
            </>)}
        </Nav>
        <Nav>
          {/* si l'utilisateur n'est pas connecté */
            !isLoggedIn && (<>
              <NavLink className="nav-link login" to="/login"><i className="fas fa-sign-in-alt"></i>Login</NavLink>
              <NavLink className="nav-link" to="/signup"><i className="fas fa-user-plus"></i>Inscription</NavLink>
            </>)}
          {/* si l'utilisateur est admin */
            (isAdmin || isRaidLeader) && (<>
              <NavLink className="nav-link" to="/admin"><i className="fas fa-meteor"></i>Admin</NavLink>
            </>)
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

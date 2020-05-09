import React from "react";
import { NavLink } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar'
import Nav from "react-bootstrap/Nav"


const Menu = () => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="container-fluid">
      <Navbar.Brand href="/">FFXIV-Roster Manager</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <NavLink className="nav-link" to="/itemSearch">Item</NavLink>
          <NavLink className="nav-link" to="/characterSearch">Personnage</NavLink>
        </Nav>
        <Nav>
          <NavLink className="nav-link" to="/login">Se connecter</NavLink>
          <NavLink className="nav-link" to="/signup">Inscription</NavLink>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Menu;

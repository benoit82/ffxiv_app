import React, { useState, useEffect } from "react";
import { UserApi } from "./AppContext";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";
import Container from "react-bootstrap/Container";
import { Menu } from "./components";

import "./App.css";

function App() {
  const [user, setUser] = useState({
    userId: "",
    isLoggedIn: false,
  });

  const checkStorage = () => {
    if (localStorage.getItem("user") !== null) {
      const userId = JSON.parse(localStorage.getItem("user")).uid;
      //!TODO : se connecter à la DB et chercher si le user est admin / raidleader puis mettre à jour le User
      setUser({ ...user, userId, isLoggedIn: true, isAdmin: true }); //! mettre à jour l'info : isAdmin selon la data récupéré
    }
  };

  useEffect(() => {
    checkStorage();
  }, []);

  return (
    <Container fluid className="App">
      <Router>
        <UserApi.Provider value={{ user, setUser }}>
          <Menu user={user} />
          <div className="row mt-3 d-flex justify-content-center align-items-center">
            <Routes />
          </div>
        </UserApi.Provider>
      </Router>
    </Container>
  );
}

export default App;

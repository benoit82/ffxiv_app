import React, { useState, useEffect, useContext } from "react";
import { UserApi, XIVApi } from "./utils/appContext";
import { FirebaseContext } from "./components/firebase";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes";
import Container from "react-bootstrap/Container";
import { Menu, Footer } from "./components";
import XIVAPI from "xivapi-js";
import checkStorage from "./utils/checkStorage";
import { showInfoMessage } from "./utils/globalFunctions";

import "./App.css";

function App() {
  const firebase = useContext(FirebaseContext);
  const [user, setUser] = useState({
    uid: "",
    isLoggedIn: false,
  });
  const xivapi = new XIVAPI({
    private_key: process.env.REACT_APP_XIV_API_KEY,
    language: "fr",
    snake_case: true,
  });

  useEffect(() => {
    try {
      checkStorage(firebase, setUser);
    } catch (error) {
      showInfoMessage("error", error.message);
    }
  }, [firebase]);

  return (
    <Container fluid className="App">
      <Router>
        <UserApi.Provider value={{ user, setUser }}>
          <XIVApi.Provider value={xivapi}>
            <Menu user={user} />
            <Container fluid>
              <div className="row mt-3 d-flex" style={{ minHeight: "90vh" }}>
                <Routes />
              </div>
            </Container>
          </XIVApi.Provider>
        </UserApi.Provider>
      </Router>
      <Footer />
    </Container>
  );
}

export default App;

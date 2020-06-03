import React, { useState, useEffect, useContext } from "react";
import { UserApi, XIVApi } from "./utils/appContext";
import { FirebaseContext } from "./components/firebase";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { Menu, Footer } from "./components";
import XIVAPI from "xivapi-js";
import checkStorage from "./utils/checkStorage";

import "./App.css";

function App() {
  const firebase = useContext(FirebaseContext);
  const [infoMsg, setInfoMsg] = useState(null);
  const [user, setUser] = useState({
    uid: "",
    isLoggedIn: false,
  });
  const xivapi = new XIVAPI({
    language: "fr",
    snake_case: true,
  });

  useEffect(() => {
    try {
      checkStorage(firebase, setUser);
    } catch (error) {
      setInfoMsg(
        <Alert variant="danger">
          Une érreur est survenu :<br /> {error.message}
        </Alert>
      );
    }
  }, [firebase]);

  return (
    <Container fluid className="App">
      <Router>
        <UserApi.Provider value={{ user, setUser }}>
          <XIVApi.Provider value={xivapi}>
            <Menu user={user} />
            <Container>
              {infoMsg}
              <div className="row mt-3 d-flex justify-content-center align-items-center">
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

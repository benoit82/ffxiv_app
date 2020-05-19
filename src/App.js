import React, { useState, useEffect, useContext } from "react";
import { UserApi } from "./AppContext";
import { FirebaseContext } from "./components/firebase";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { Menu, Footer } from "./components";
import checkStorage from "./utils/checkStorage";

import "./App.css";

function App() {
  const firebase = useContext(FirebaseContext);
  const [infoMsg, setInfoMsg] = useState(null);
  const [user, setUser] = useState({
    uid: "",
    isLoggedIn: false,
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
  }, []);

  return (
    <Container fluid className="App">
      <Router>
        <UserApi.Provider value={{ user, setUser }}>
          <Menu user={user} />
          {infoMsg}
          <div className="row mt-3 d-flex justify-content-center align-items-center">
            <Routes />
          </div>
        </UserApi.Provider>
      </Router>
      <Footer />
    </Container>
  );
}

export default App;

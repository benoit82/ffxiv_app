import React, { useState, useEffect, useContext } from "react";
import { UserApi } from "./AppContext";
import { FirebaseContext } from "./components/firebase";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { Menu } from "./components";

import "./App.css";

function App() {
  const firebase = useContext(FirebaseContext);
  const [infoMsg, setInfoMsg] = useState(null);
  const [user, setUser] = useState({
    uid: "",
    isLoggedIn: false,
  });

  const checkStorage = async () => {
    if (localStorage.getItem("uid") !== null) {
      const uid = JSON.parse(localStorage.getItem("uid"));
      console.log(uid);
      try {
        const userFromDB = await firebase.getUser(uid); // new User()
        setUser(userFromDB); // instance of User
      } catch (error) {
        setInfoMsg(
          <Alert variant="danger">
            Une érreur est survenu :<br /> {error.message}
          </Alert>
        );
      }
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
          {infoMsg}
          <div className="row mt-3 d-flex justify-content-center align-items-center">
            <Routes />
          </div>
        </UserApi.Provider>
      </Router>
    </Container>
  );
}

export default App;

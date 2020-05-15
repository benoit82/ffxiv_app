import React, { useState, useEffect, useContext } from "react";
import { User } from "./models";
import { UserApi } from "./AppContext";
import { FirebaseContext } from "./components/firebase";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";
import Container from "react-bootstrap/Container";
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
    if (localStorage.getItem("user") !== null) {
      const storagedUser = new User(JSON.parse(localStorage.getItem("user")));
      setUser(storagedUser);
      try {
        const updatedUser = await firebase.getUser(storagedUser.uid);
        if (updatedUser)
          localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser); // instance of User
      } catch (error) {
        setInfoMsg(<p>Info error : {error.message}</p>);
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

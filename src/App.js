import React, { useState, useEffect } from "react";
import { AuthApi } from "./AppContext";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";
import { Menu } from "./components";

import "./App.css";

function App() {
  const [auth, setAuth] = useState(false);

  const checkStorage = () => {
    const userId = localStorage.getItem("user");
    if (userId) {
      sessionStorage.setItem("user", localStorage.getItem("user"));
      setAuth(true);
    }
  };

  useEffect(() => {
    checkStorage();
  }, [auth]);

  return (
    <div className="App container-fluid">
      <Router>
        <AuthApi.Provider value={{ auth, setAuth }}>
          <Menu auth={auth} />
          <div className="row mt-5 d-flex justify-content-center align-items-center">
            <Routes />
          </div>
        </AuthApi.Provider>
      </Router>
    </div>
  );
}

export default App;

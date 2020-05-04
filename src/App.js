import React, { useState } from "react";
import { LangContext } from "./AppContext";
import ItemSearch from "./components/ItemSearch";

import "./App.css";

function App() {
  const [lang, setLang] = useState("fr");

  return (
    <div className="App">
      <select name="lang" id="lang" onChange={(e) => setLang(e.target.value)}>
        <option value="fr" defaultValue>
          français
        </option>
        <option value="en">anglais</option>
        <option value="ja">Japonais</option>
        <option value="de">Allemand</option>
      </select>
      <LangContext.Provider value={lang}>
        <ItemSearch />
      </LangContext.Provider>
    </div>
  );
}

export default App;

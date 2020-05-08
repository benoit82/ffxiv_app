import React, { useState } from "react";
import { LangContext } from "./AppContext";
import {
  Navbar,
  CharacterDetail,
  ItemSearch,
  CharacterSearch,
} from "./components";

import "./App.css";

function App() {
  const [lang, setLang] = useState("fr");

  return (
    <div className="App">
      {/* <select name="lang" id="lang" onChange={(e) => setLang(e.target.value)}>
        <option value="fr" defaultValue>
          français
        </option>
        <option value="en">anglais</option>
        <option value="ja">Japonais</option>
        <option value="de">Allemand</option>
      </select>
      <LangContext.Provider value={lang}>
        {charactersIdTable.map((id) => {
          return <CharacterDetail key={id} chrId={id} />;
        })}
        <ItemSearch />
      </LangContext.Provider> */}
      <Navbar />
      <CharacterSearch />
    </div>
  );
}

export default App;

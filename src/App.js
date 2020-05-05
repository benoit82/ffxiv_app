import React, { useState } from "react";
import { LangContext } from "./AppContext";
import { CharacterDetail, ItemSearch, CharacterSearch } from "./components";

import "./App.css";

function App() {
  const [lang, setLang] = useState("fr");
  //const lang = "fr";
  const charactersIdTable = [734000, 11271710, 16399835, 4315237];

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
      <CharacterSearch />
    </div>
  );
}

export default App;

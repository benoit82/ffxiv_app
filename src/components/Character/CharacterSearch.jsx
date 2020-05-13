import React, { useState, useEffect } from "react";
import CharacterDetail from "./CharacterDetail";
import axios from "axios";
import Loading from "../Loading";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container'
import SearchBtn from "../formElements/SearchBtn";
import XIVAPI from 'xivapi-js';

import "./CharacterSearch.css";

const CharacterSearch = () => {
  const [loading, setLoading] = useState(false);
  const [serverList, setServerList] = useState([]);
  const [charactersId, setCharactersId] = useState([]);
  const xiv = new XIVAPI({
    language: 'fr',
    snake_case: true
  });

  useEffect(() => {
    // retrieve server list by datacenter  [dc, [...servers]], [dc, [...servers]],...
    (async () => {
      const datacenters = await xiv.data.datacenters();
      setServerList(Object.entries(datacenters));
    })();
  }, []);

  const serverListRender = () => {
    console.log(serverList)
    // for (const [datacenter, servers] in Object.entries(serverList)) {
    // return <optgroup label={[datacenter]}>
    //   {servers.map(server => <option key={server}>{server}</option>)}
    // </optgroup>
    // }
  }

  const requestCharactersList = async (chrName, server) => {
    let resCumul = [];
    setLoading(true);
    setCharactersId([]);
    const res = await axios.get(
      `https://xivapi.com/character/search?name=${chrName}&server=${server}`
    );
    res.data.Results.forEach((res) => {
      resCumul = [...resCumul, res.ID];
      console.log("res", resCumul);
    });
    setCharactersId(resCumul);
    setLoading(false);
  };

  const fetchCharacters = (e) => {
    e.preventDefault();

    /*
    const chrName = document.querySelector("#chr_name").value;
    const server = document.querySelector("#select_server").value;
    requestCharactersList(chrName, server);
    */
  };

  const servers = serverList.map((datacenter, index) => {
    return (
      <optgroup key={index} label={datacenter[0].toUpperCase()}>
        {datacenter[1].map(server => {
          return <option key={server}>{server}</option>
        })}
      </optgroup>
    )
  })

  return (
    <Container>
      <Form onSubmit={fetchCharacters}>
        <Form.Group controlId="characterName">
          <Form.Label>Nom du personnage</Form.Label>
          <Form.Control type="text" placeholder="Nom du personnage" />
        </Form.Group>

        <Form.Group controlId="selectServer">
          <Form.Label>Server</Form.Label>
          <Form.Control as="select" custom onChange={(e) => { console.log(e.target.value) }}>
            {servers}
          </Form.Control>
        </Form.Group>

        <SearchBtn />
      </Form>
      {loading && <Loading />}
      {charactersId.map((id) => {
        return <CharacterDetail key={id} chrId={id} />;
      })}
    </Container>
  );
};

export default CharacterSearch;

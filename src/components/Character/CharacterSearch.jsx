import React, { useState, useEffect } from 'react'
import Loading from "../Loading"
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { SearchBtn, AddBtn } from '../formElements'
import XIVAPI from 'xivapi-js'
import { Formik } from 'formik'
import * as Yup from 'yup'
import pluralize from 'pluralize'

import "./CharacterSearch.css"

const CharacterSearch = ({ handleAdd }) => {
  const [loading, setLoading] = useState(false);
  const [serverList, setServerList] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [infoMsg, setInfoMsg] = useState(null);
  const [characterSelected, setCharacterSelected] = useState(null);
  const xiv = new XIVAPI({
    language: 'fr',
    snake_case: true
  });

  useEffect(() => {
    // retrieve server list and add "all server" option for global search
    (async () => {
      const datacenters = await xiv.data.datacenters();
      setServerList([["Choisir un serveur", ["Tous"]], ...Object.entries(datacenters)]);
    })();
  }, []);

  const fetchCharacters = async (values) => {
    setCharacterSelected(null);
    let resCumul = [];
    setLoading(true);
    setCharacters([]);
    const res = await xiv.character.search(values.characterName, { server: values.selectServer });
    res.results.forEach((res) => {
      resCumul = [...resCumul, res];
    });
    setCharacters(resCumul);
    setCharacterSelected(resCumul[0]);
    setLoading(false);
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

  const characterDetailDisplay = (event) => {
    setCharacterSelected(characters.find(character => character.id === parseInt(event.target.value)))
  }

  const ChrSearchSchema = Yup.object().shape({
    characterName: Yup.string()
      .min(3, "Veuillez indiquer au moins 3 lettres")
      .required("champs obligatoire")
    ,
    selectServer: Yup.string(),
  });

  /*
  * !TODO handleClick à gerer pour ajouter un personnage au compte / au roster
  * voir si le personnage selectionné n'est pas déjà dans la liste sauvegardé
  */
  const handleAddChr = () => {
    handleAdd(characterSelected)
    setCharacters(null)
    setCharacterSelected(null)
    setInfoMsg(<Alert variant="info"><strong>{characterSelected.name}</strong> ajouté !</Alert>)
    setTimeout(() => {
      setInfoMsg(null)
    }, 2000)
  }


  return (
    <Container>
      <Formik
        validationSchema={ChrSearchSchema}
        onSubmit={values => fetchCharacters(values)}
        initialValues={{
          characterName: '',
          selectServer: '',
        }}
      >
        {
          ({ handleSubmit,
            handleChange,
            values,
            touched,
            errors, }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="characterName">
                  <Form.Label>Nom du personnage :</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nom du personnage"
                    value={values.characterName}
                    onChange={handleChange}
                    isValid={touched.characterName && !errors.characterName}
                    isInvalid={!!errors.characterName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.characterName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="selectServer">
                  <Form.Label>Serveur :</Form.Label>
                  <Form.Control
                    as="select"
                    custom
                    onChange={handleChange}
                    value={values.selectServer}
                  >
                    {servers}
                  </Form.Control>
                </Form.Group>
                <SearchBtn />
              </Form>
            )
        }
      </Formik>
      <div className="mt-3">
        {infoMsg}
        {loading && <Loading />}
        {
          characterSelected &&
          <>
            <Row>
              <Col>
                <Form.Group controlId="selectChr">
                  <Form.Label>Résultat : {pluralize("personnage", characters.length, true)}</Form.Label>
                  <Form.Control
                    as="select"
                    custom
                    onChange={characterDetailDisplay}
                  >
                    {characters.map((character) => {
                      return <option value={character.id} key={character.id} >{character.name} - {character.server}</option>
                    })}
                  </Form.Control>
                </Form.Group>
                <AddBtn label="ce personnage" handleClick={handleAddChr} />
              </Col>
            </Row>
          </>
        }
      </div>
    </Container>
  );
};

export default CharacterSearch;

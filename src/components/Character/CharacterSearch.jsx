import React, { useState, useEffect, useContext } from 'react'
import Loading from "../Loading"
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { SearchBtn, AddBtn } from '../formElements'
import { Formik } from 'formik'
import * as Yup from 'yup'
import pluralize from 'pluralize'

import "./CharacterSearch.css"
import { XIVApi } from '../../AppContext'

const CharacterSearch = ({ handleAdd, userCharacters }) => {
  const [loading, setLoading] = useState(false)
  const [serverList, setServerList] = useState([])
  const [characters, setCharacters] = useState([])
  const [characterSelected, setCharacterSelected] = useState(null)
  const xiv = useContext(XIVApi);

  useEffect(() => {
    // retrieve server list and add "all server" option for global search
    (async () => {
      const datacenters = await xiv.data.datacenters()
      setServerList([["Choisir un serveur", ["Tous"]], ...Object.entries(datacenters)])
    })()
  }, [])

  const fetchCharacters = async (values, { resetForm }) => {
    setCharacterSelected(null)
    let allDatas = []
    setLoading(true)
    setCharacters([])
    const res = await xiv.character.search(values.characterName, { server: values.selectServer })
    res.results.forEach(data => {
      if (!userCharacters.some(storedChr => storedChr.id === data.id)) {
        allDatas = [...allDatas, data]
      }
    })
    setCharacters(allDatas)
    setCharacterSelected(allDatas[0])
    if (characters.length > 0) {
      resetForm({})
    }
    setLoading(false)
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
  * ! TODO handleClick à gerer pour ajouter un personnage au compte / au roster
  * voir si le personnage selectionné n'est pas déjà dans la liste sauvegardé
  */
  const handleAddChr = () => {
    handleAdd(characterSelected)
    setCharacters(null)
    setCharacterSelected(null)
  }


  return (
    <>
      <Formik
        validationSchema={ChrSearchSchema}
        onSubmit={fetchCharacters}
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
              <>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col>
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
                    </Col>
                    <Col>
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
                    </Col>
                  </Row>
                  <Row>
                    <SearchBtn />
                  </Row>
                </Form>
                {loading && <Loading />}
              </>
            )
        }
      </Formik>
      <Col>
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
                <AddBtn label="ajouter ce personnage" handleClick={handleAddChr} />
              </Col>
            </Row>
          </>
        }
      </Col>
    </>
  );
};

export default CharacterSearch;

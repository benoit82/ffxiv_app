import React, { useState, useEffect, useContext } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import AddCharacter from './AddCharacter'
import EditCharacter from './EditCharacter'
import Table from 'react-bootstrap/Table'
import EditBtn from '../formElements/EditBtn'
import DeleteBtn from '../formElements/DeleteBtn'
import CharacterDetailInline from '../character/CharacterDetailInline'
import { FirebaseContext } from '../firebase'
import Msg from '../../utils/Msg'
import { UserApi } from '../../AppContext'
import { Switch, Route, Link } from 'react-router-dom'

const UserOptionPage = () => {

    // créer un useEffect pour charger le personnage, sinon, proposer de chercher le personnage et 
    const [characters, setCharacters] = useState([])
    const [msgInfo, setMsgInfo] = useState(null)
    const firebase = useContext(FirebaseContext);
    const User = useContext(UserApi)
    const { uid } = User.user

    useEffect(() => {
        // load the character list from DB linked to the uid
        const unsubcribe = firebase.db
            .collection("users")
            .doc(uid)
            .collection("characters")
            .orderBy("name", "asc")
            .onSnapshot(
                (snapshot) => {
                    const cList = snapshot.docs.map((character, index) => ({
                        ...character.data(),
                        _id: snapshot.docs[index].id,
                    }));
                    setCharacters(cList);
                },
                (error) => {
                    throw setMsgInfo(<Msg error={{ message: error.message }} />);
                }
            );


        return () => unsubcribe()
    }, [])

    const findCharacter = _id => {
        return characters.some(chr => chr._id === _id)
            ? characters.find(chr => chr._id === _id)
            : {};
    };

    const handleDelete = character => {
        const confirmation = window.confirm(`êtes-vous certain de supprimer ${character.name} de votre compte ?`)
        if (confirmation) {
            firebase.deleteCharacter(uid, character);
        }
    }

    return (
        <Container fluid>
            <h1>Mes personnages</h1>
            <Row>
                <Col xs={12} lg={3}>
                    <ul>
                        <Link to="/user/add">Ajouter un perso</Link>
                    </ul>
                </Col>
                {/* routes */}
                <Col>
                    <Row>
                        {msgInfo}
                        {characters.length > 0 ? (
                            <>
                                <h3>Vos personnages enregistré</h3>
                                <Table striped bordered hover variant="dark">
                                    <thead>
                                        <tr>
                                            <th>Personnage</th>
                                            <th>Options</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {characters.map((character, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <CharacterDetailInline
                                                        character={findCharacter(character._id)}
                                                    />
                                                </td>
                                                <td>
                                                    {/* ! TODO edit character */}
                                                    <Link to={`/user/${character._id}`}> <EditBtn /></Link>
                                                    {" "}
                                                    <DeleteBtn handleClick={() => handleDelete(character)} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </>
                        ) : (
                                <p>aucun personnage lié à votre compte.</p>
                            )}
                    </Row>
                    <Row>
                        <Switch>
                            <Route path="/user/add">
                                <AddCharacter characters={characters} />
                            </Route>
                            <Route path="/user/:chr_id">
                                <EditCharacter />
                            </Route>
                        </Switch>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default UserOptionPage

import React, { useState, useEffect, useContext } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import AddCharacter from './AddCharacter'
import Table from 'react-bootstrap/Table'
import CharacterDetailInline from '../character/CharacterDetailInline'
import { FirebaseContext } from '../firebase'
import Msg from '../../utils/Msg'
import { UserApi } from '../../AppContext'
import { AddBtn, CloseBtn, DeleteBtn } from '../formElements'
import { Link } from 'react-router-dom'

const UserOptionPage = () => {

    // créer un useEffect pour charger le personnage, sinon, proposer de chercher le personnage et 
    const [characters, setCharacters] = useState([])
    const [addShow, setAddShow] = useState(false)
    const [msgInfo, setMsgInfo] = useState(null)
    const firebase = useContext(FirebaseContext)
    const User = useContext(UserApi)

    const { uid } = User.user



    useEffect(() => {
        // load the character list from DB linked to the uid
        let unsubcribe;
        if (uid) {
            unsubcribe = firebase.db
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
        }


    }, [uid, firebase])

    const findCharacter = _id => {
        return characters.some(chr => chr._id === _id)
            ? characters.find(chr => chr._id === _id)
            : {};

    }

    const handleDelete = character => {
        const confirmation = window.confirm(`êtes-vous certain de supprimer ${character.name} de votre compte ?`)
        if (confirmation) {
            firebase.deleteCharacter(uid, character);
        }
    }

    const handleUnmount = () => {
        setAddShow(false)
    }



    return (
        <Container fluid className="ml-2 mr-2">
            <h1>Mes personnages</h1>
            <Row>
                {msgInfo}

                {characters.length > 0 ? (
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>Personnage</th>
                                <th>Main Job</th>
                                <th>Job 2</th>
                                <th>Job 3</th>
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
                                        main job
                                    </td>
                                    <td>
                                        job 2
                                    </td>
                                    <td>
                                        job 3
                                    </td>
                                    <td>

                                        <DeleteBtn handleClick={() => { handleDelete(character) }} />
                                        <Link to={`/chr/${character._id}`} className="btn btn-success">Editer</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                        <p>aucun personnage lié à votre compte.</p>
                    )}
                {!addShow ? <AddBtn handleClick={() => setAddShow(true)} /> : <CloseBtn handleClick={() => setAddShow(false)} />}
            </Row>
            <Row>
                {addShow && <AddCharacter characters={characters} unmount={handleUnmount} />}
            </Row>
        </Container>
    )
}

export default UserOptionPage

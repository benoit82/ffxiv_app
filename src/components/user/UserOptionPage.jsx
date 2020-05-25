import React, { useState, useEffect, useContext } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import AddCharacter from './AddCharacter'
import CardDeck from 'react-bootstrap/CardDeck'
import { FirebaseContext } from '../firebase'
import Msg from '../../utils/Msg'
import { UserApi } from '../../AppContext'
import { AddBtn, CloseBtn, } from '../formElements'
import CharacterDetailCard from '../character/CharacterDetailCard'

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

    return (
        <Container fluid className="ml-2 mr-2">
            <Row>
                {msgInfo}
                {characters.length > 0
                    ? (
                        <CardDeck>
                            {characters.map((character, index) =>
                                <CharacterDetailCard
                                    key={index}
                                    character={findCharacter(character._id)} />
                            )}
                        </CardDeck>
                    )
                    : (
                        <p>aucun personnage lié à votre compte.</p>
                    )}
            </Row>
            <Row className="mt-3">
                {!addShow ? <AddBtn handleClick={() => setAddShow(true)} /> : <CloseBtn handleClick={() => setAddShow(false)} />}
            </Row>
            <Row>
                {addShow && <AddCharacter characters={characters} unmount={() => setAddShow(false)} />}
            </Row>
        </Container>
    )
}

export default UserOptionPage

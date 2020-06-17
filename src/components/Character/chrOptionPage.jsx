import React, { useState, useEffect, useContext } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import AddCharacter from './addCharacter'
import { FirebaseContext } from '../firebase'
import Msg from '../../utils/msg'
import { UserApi } from '../../utils/appContext'
import { AddBtn, CloseBtn, } from '../formElements'
import CharacterDetailCard from './characterDetailCard'
import CharacterMenu from './characterMenu'
import { Character } from '../../models'
import Col from 'react-bootstrap/Col'

/**
 * @route /chr
 */
const ChrOptionPage = () => {

    // créer un useEffect pour charger le personnage, sinon, proposer de chercher le personnage et 
    const MAX_CHR_ALLOWED = 2
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
                .collection("characters")
                .where("userRef", "==", firebase.db.collection("users").doc(uid))
                .orderBy("name", "asc")
                .onSnapshot(
                    (snapshot) => {
                        const cList = snapshot.docs.map((characterRefDoc, index) => new Character(characterRefDoc));
                        setCharacters(cList);
                    },
                    (error) => {
                        throw setMsgInfo(<Msg error={error.message} />);
                    }
                );
            return () => unsubcribe()
        }
    }, [firebase.db, uid])

    return (
        <Container fluid className="ml-2 mr-2">
            <Row><h3>Vos personnages ({`${characters.length}/${MAX_CHR_ALLOWED}`})</h3></Row>
            <Row>
                {characters.length < MAX_CHR_ALLOWED &&
                    <Col lg={3}>
                        <Row>
                            {!addShow ? <AddBtn handleClick={() => setAddShow(true)} /> : <CloseBtn handleClick={() => setAddShow(false)} />}
                            {addShow && <AddCharacter characters={characters} unmount={() => setAddShow(false)} />}
                        </Row>
                    </Col>
                }
                <Col>
                    <Row>{msgInfo}</Row>
                    {characters.length > 0 &&
                        <Row className="justify-content-around">
                            {characters.map((character, index) =>
                                <Row key={index} className="w-75 d-flex justify-content-center">
                                    {/* < CharacterDetailCard
                                        character={character} /> */}
                                    {/* Character menu */}
                                    < CharacterMenu
                                        character={character} />
                                </Row>
                            )}
                        </Row>
                    }
                </Col>
            </Row>
        </Container>
    )
}

export default ChrOptionPage

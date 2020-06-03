import React, { useState, useEffect, useContext } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import AddCharacter from './addCharacter'
import { FirebaseContext } from '../firebase'
import Msg from '../../utils/msg'
import { UserApi } from '../../utils/appContext'
import { AddBtn, CloseBtn, } from '../formElements'
import CharacterDetailCard from './characterDetailCard'

const ChrOptionPage = () => {

    // créer un useEffect pour charger le personnage, sinon, proposer de chercher le personnage et 
    const MAX_CHR_ALLOWED = 2
    const [characters, setCharacters] = useState([])
    const [addShow, setAddShow] = useState(false)
    const [msgInfo, setMsgInfo] = useState(null)
    const firebase = useContext(FirebaseContext)
    const User = useContext(UserApi)

    const { uid } = User.user

    const userDocRef = firebase.db.collection("users").doc(uid)



    useEffect(() => {
        // load the character list from DB linked to the uid
        let unsubcribe;
        if (uid) {
            unsubcribe = firebase.db
                .collection("characters")
                .where("userRef", "==", userDocRef)
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
                        throw setMsgInfo(<Msg error={error.message} />);
                    }
                );
            return () => unsubcribe()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uid, firebase]) // <-- avoid repeating request

    const findCharacter = _id => {
        return characters.some(chr => chr._id === _id)
            ? characters.find(chr => chr._id === _id)
            : {};

    }

    return (
        <Container fluid className="ml-2 mr-2">

            {msgInfo}
            {characters.length > 0
                ? (<>
                    <h3>Vos personnages ({`${characters.length}/${MAX_CHR_ALLOWED}`})</h3>
                    <Row className="justify-content-around">
                        {characters.map((character, index) =>
                            < CharacterDetailCard
                                key={index}
                                character={findCharacter(character._id)} />
                        )}
                    </Row>
                </>
                )
                : (
                    <h3>aucun personnage lié à votre compte.</h3>
                )}

            {characters.length < MAX_CHR_ALLOWED &&
                <>
                    <Row className="mt-3">
                        {!addShow ? <AddBtn handleClick={() => setAddShow(true)} /> : <CloseBtn handleClick={() => setAddShow(false)} />}
                    </Row>
                    <Row>
                        {addShow && <AddCharacter characters={characters} unmount={() => setAddShow(false)} />}
                    </Row>
                </>}
        </Container>
    )
}

export default ChrOptionPage
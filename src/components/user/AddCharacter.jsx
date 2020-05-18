import React, { useState, useEffect, useContext } from 'react'
import { UserApi } from '../../AppContext'
import { FirebaseContext } from '../firebase'
import CharacterSearch from '../character/CharacterSearch'
import CharacterDetail from '../character/CharacterDetail'
import Alert from 'react-bootstrap/Alert'
import Msg from '../../utils/Msg'

const AddCharacter = () => {
    const [msgInfo, setMsgInfo] = useState(null)
    const [charactersList, setCharactersList] = useState([])

    const firebase = useContext(FirebaseContext)
    const User = useContext(UserApi)
    const { uid } = User.user;

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
                    setCharactersList(cList);
                },
                (error) => {
                    throw setMsgInfo(<Msg error={{ message: error.message }} />);
                }
            );


        return () => unsubcribe()
    }, [])


    const handleAdd = async (character) => {
        if (!charactersList.some(storedChr => storedChr.id === character.id)) {
            // new character record on DB
            await firebase.addCharacter(uid, character)
        }
    }

    const handleDelete = async (character) => {
        const confirmation = window.confirm(`êtes-vous certain de supprimer ${character.name} de votre compte ?`)
        if (confirmation) {
            firebase.deleteCharacter(uid, character);
        }
    }


    return (
        <>
            {msgInfo}
            {charactersList &&
                <>
                    <h3>Vos personnages enregistré</h3>
                    <ul>
                        {charactersList.map(character =>
                            <li key={character.id}><CharacterDetail chr={character} handleDelete={handleDelete} /></li>
                        )}
                    </ul>
                </>
            }
            <h3>Ajouter un nouveau personnage</h3>
            <CharacterSearch handleAdd={handleAdd} />
        </>
    )
}

export default AddCharacter

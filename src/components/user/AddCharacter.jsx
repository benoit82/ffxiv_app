import React, { useState, useEffect, useContext } from 'react'
import { UserApi } from '../../AppContext'
import { FirebaseContext } from '../firebase'
import CharacterSearch from '../character/CharacterSearch'
import CharacterDetail from '../character/CharacterDetail'
import Alert from 'react-bootstrap/Alert'

const AddCharacter = () => {
    const [msgInfo, setMsgInfo] = useState(null)
    const [charactersList, setCharactersList] = useState([])
    const firebase = useContext(FirebaseContext)
    const User = useContext(UserApi)
    const { uid } = User.user;

    useEffect(() => {
        // load the character list from DB linked to the uid
        const unsubcribe = firebase.userListCharacter(uid, setCharactersList)
        return () => unsubcribe()
    }, [charactersList])


    const handleAdd = async (character) => {
        if (!charactersList.some(storedChr => storedChr.id === character.id)) {
            // new character record on DB
            const storedChr = await firebase.addCharacter(uid, character)
            setCharactersList([...charactersList, storedChr])
            console.log('storedChr :>> ', storedChr);
        } else {
            setMsgInfo(<Alert variant="danger"><strong>{character.name}</strong> est déjà dans la liste</Alert>)
            setTimeout(() => {
                setMsgInfo(null)
            }, 2000);
        }
    }

    const handleDelete = async (character) => {
        const confirmation = window.confirm(`êtes-vous certain de supprimer ${character.name} de votre compte ?`)
        if (confirmation) {
            firebase.deleteCharacter(uid, character);
            setCharactersList(charactersList.filter(chr => chr.id !== character.id));
        }
    }


    return (
        <>
            {msgInfo}
            {charactersList.length > 0 &&
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

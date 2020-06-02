import React, { useContext } from 'react'
import { UserApi } from '../../AppContext'
import { FirebaseContext } from '../firebase'
import CharacterSearch from '../character/CharacterSearch'


const AddCharacter = ({ characters, unmount }) => {

    const firebase = useContext(FirebaseContext)
    const User = useContext(UserApi)
    const { uid } = User.user
    const userRef = firebase.db.doc(`users/${uid}`)


    const handleAdd = async (character) => {
        if (!characters.some(storedChr => storedChr.id === character.id)) {
            // new character record on DB
            character.userRef = userRef
            await firebase.addCharacter(uid, character)
            unmount()
        }
    }

    return (
        <CharacterSearch handleAdd={handleAdd} />
    )
}

export default AddCharacter

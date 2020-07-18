import React, { useContext } from 'react'
import { UserApi } from '../../utils/appContext'
import { FirebaseContext } from '../firebase'
import CharacterSearch from './characterSearch'


const AddCharacter = ({ characters, unmount }) => {

    const firebase = useContext(FirebaseContext)
    const User = useContext(UserApi)
    const { uid } = User.user
    const userRef = firebase.db.doc(`users/${uid}`)


    const handleAdd = async (character) => {
        character.userRef = userRef
        character.bis = {}
        await firebase.addCharacter(uid, character)
        unmount()
    }

    return (
        <CharacterSearch handleAdd={handleAdd} userCharacters={characters} />
    )
}

export default AddCharacter

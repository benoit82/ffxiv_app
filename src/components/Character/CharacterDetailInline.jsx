import React, { useEffect, useState, useContext } from 'react'
import { FirebaseContext } from '../firebase'


const CharacterDetailInline = ({ character }) => {



    return (
        <>
            <p><img style={{ height: "50px" }} src={character.avatar} alt={`avatar de ${character.name}`} /> - {character.name}</p>
        </>
    )
}

export default CharacterDetailInline

import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FirebaseContext } from '../firebase'
import Container from 'react-bootstrap/Container'
import UserOptionPage from './UserOptionPage'

const EditCharacter = () => {

    const { chr_id } = useParams()
    const firebase = useContext(FirebaseContext)
    const [character, setCharacter] = useState({})

    useEffect(() => {
        // fetch a specific character by _id on param
        firebase.getCharacter(chr_id, setCharacter)
    }, [])

    const jobs = [
        ['tank', ['DRK', 'GNB', 'PLD', 'WAR']],
        ['heal', ['AST', 'SCH', 'WHM']],
        ['dps', ['BRD', 'BLM', 'DNC', 'DRG', 'MCH', 'MNK', 'NIN', 'RDM', 'SAM', 'SMN']]
    ]

    const optJobs = jobs.map((role, index) => {
        return (
            <optgroup key={index} label={role[0].toUpperCase()}>
                {role[1].map(job => {
                    return <option key={job}>{job}</option>
                })}
            </optgroup>
        )
    })

    const { name, id } = character
    return (
        <>
            <Container>
                <div className="bg-light">
                    job 1 / 2 / 3

                    wish list pour chaque jobs : 1 par patch => admin : ajouter un patch
                    son stuff actuel (import depuis lodestone ?)

            </div>
                <hr />
                <div className="bg-light">
                    <h3>Edition de : {name}</h3>

                    <a
                        href={`https://fr.finalfantasyxiv.com/lodestone/character/${id}`}
                        className="btn btn-primary"
                        target={"_blanck"}
                    >Voir le profil lodestone</a>



                </div>
            </Container>
        </>
    )
}

export default EditCharacter

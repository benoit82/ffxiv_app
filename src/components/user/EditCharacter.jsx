import React, { useState } from 'react'

const EditCharacter = ({ character }) => {

    const [chr, setChr] = useState(character)

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

    const onSubmit = (values, { resetForm }) => {
        console.log("submit !")
    }

    const { name, id } = chr
    return (
        <>
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
        </>
    )
}

export default EditCharacter

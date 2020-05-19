import React from 'react'


const CharacterDetailInline = ({ character }) => {

    const { avatar, name, id } = character;

    return (
        <>
            <p><img style={{ height: "50px" }} src={avatar} alt={`avatar de ${name}`} /><a
                href={`https://fr.finalfantasyxiv.com/lodestone/character/${id}`}
                className="ml-2 btn btn-primary"
                target={"_blanck"}
            >{name}</a></p>
        </>
    )
}

export default CharacterDetailInline




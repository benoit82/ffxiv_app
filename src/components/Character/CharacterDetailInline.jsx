import React from 'react'


const CharacterDetailInline = ({ character }) => {

    const { avatar, name, id } = character;

    return (
        <>
            <p><img style={{ height: "50px" }} src={avatar} alt={`avatar de ${name}`} />{name}{" "}<a
                className="ml-auto"
                href={`https://fr.finalfantasyxiv.com/lodestone/character/${id}`}
                target={"_blanck"}
            ><span className="badge badge-pill badge-info">lodestone</span></a></p>
        </>
    )
}

export default CharacterDetailInline




import React from 'react'
import Msg from '../../utils/msg';


const CharacterDetailInline = ({ character }) => {

    const { avatar, name, id } = character;

    return (
        <>

            {id ? <p><img style={{ height: "50px" }} src={avatar} alt={`avatar de ${name}`} />{name}{" "}<a
                className="ml-auto"
                href={`https://fr.finalfantasyxiv.com/lodestone/character/${id}`}
                target={"_blanck"}
            ><span className="badge badge-pill badge-info">lodestone</span></a></p> : <Msg error={"Le personnage n'a pas été trouvé"} />}
        </>
    )
}

export default CharacterDetailInline




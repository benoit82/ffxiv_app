import React from 'react'
import { PropTypes } from 'prop-types'
import { Character } from '../../models'


const CharacterDetailInline = ({ character }) => {

    const { avatar, name, id } = character;

    return (
        <>
            {id && <p><img style={{ height: "50px" }} src={avatar} alt={`avatar de ${name}`} />{name}{" "}<a
                className="ml-auto"
                href={`https://fr.finalfantasyxiv.com/lodestone/character/${id}`}
                target={"_blanck"}
            ><span className="badge badge-pill badge-info">lodestone</span></a></p>}
        </>
    )
}
CharacterDetailInline.propTypes = {
    character: PropTypes.instanceOf(Character).isRequired,
}
export default CharacterDetailInline




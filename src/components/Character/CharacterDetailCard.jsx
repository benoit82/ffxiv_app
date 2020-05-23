import React, { useContext } from 'react'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'
import { DeleteBtn } from '../formElements'
import { FirebaseContext } from '../firebase'
import { UserApi } from '../../AppContext'

import './CharacterDetailCard.scss'

const CharacterDetailCard = ({ character }) => {

    const firebase = useContext(FirebaseContext)
    const User = useContext(UserApi)

    const { uid } = User.user

    const { avatar, name, id } = character

    const portrait = avatar.replace("c0_96x96.jpg", "l0_640x873.jpg")


    const handleDelete = character => {
        const confirmation = window.confirm(`êtes-vous certain de supprimer ${character.name} de votre compte ?`)
        if (confirmation) {
            firebase.deleteCharacter(uid, character);
        }
    }

    return (
        <Card border="dark" style={{ width: '18rem' }}>
            <Card.Img variant="top" src={portrait} />
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text><a
                    href={`https://fr.finalfantasyxiv.com/lodestone/character/${id}`}
                    target={"_blanck"}
                ><span className="badge badge-pill badge-info">lodestone</span></a>
                </Card.Text>
            </Card.Body>
            <Card.Footer>
                <Link to={`/chr/${character._id}`} className="btn btn-success">Editer</Link>{" "}
                <DeleteBtn handleClick={() => { handleDelete(character) }} />
            </Card.Footer>
        </Card>
    )
}

export default CharacterDetailCard

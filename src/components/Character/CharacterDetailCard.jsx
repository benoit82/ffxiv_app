import React, { useContext } from 'react'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'
import { DeleteBtn } from '../formElements'
import { FirebaseContext } from '../firebase'

import './CharacterDetailCard.scss'

const CharacterDetailCard = ({ character }) => {

    const firebase = useContext(FirebaseContext)

    const { avatar, name, id, _id } = character

    const portrait = avatar.replace("c0_96x96.jpg", "l0_640x873.jpg")


    const handleDelete = character => {
        const confirmation = window.confirm(`êtes-vous certain de supprimer ${name} de votre compte ?`)
        if (confirmation) {
            firebase.deleteCharacter(character);
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
            <Card.Footer className="d-flex justify-content-around">
                <Link to={`/chr/${_id}`} className="btn btn-success"><i className="fas fa-edit"></i>Editer</Link>
                <DeleteBtn handleClick={() => { handleDelete(character) }} />
            </Card.Footer>
        </Card>
    )
}

export default CharacterDetailCard
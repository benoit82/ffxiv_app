import React, { useContext } from 'react'
import Card from 'react-bootstrap/Card'
import { Link, useHistory } from 'react-router-dom'
import { DeleteBtn } from '../formElements'
import { FirebaseContext } from '../firebase'

import './characterDetailCard.scss'
import JobListDisplay from '../../utils/jobListDisplay'
import { styleRole } from '../../utils/styleRole'

const CharacterDetailCard = ({ character }) => {

    const history = useHistory()

    const firebase = useContext(FirebaseContext)

    const { portrait, name, id, _id, mainJob, secondJob, thirdJob } = character

    const style = styleRole(character.mainJob)


    const handleDelete = character => {
        const confirmation = window.confirm(`êtes-vous certain de supprimer ${name} de votre compte ?\nSi ce personnage était un raid lead, cela supprimera également son roster`)
        if (confirmation) {
            firebase.deleteCharacter(character);
        }
    }

    return (
        <Card border="dark" style={{ width: '18rem' }} >
            <div onClick={() => history.push(`/chr/${_id}`)}>
                <Card.Img variant="top" src={portrait} />
                <Card.Body style={style}>
                    <Card.Title>{name}</Card.Title>
                </Card.Body>
                {mainJob &&
                    <div className="d-flex justify-content-around">
                        <JobListDisplay job={mainJob} />{secondJob && <JobListDisplay job={secondJob} />}{thirdJob && <JobListDisplay job={thirdJob} />}
                    </div>
                }
                {!mainJob &&
                    <Card.Text className="d-flex justify-content-around">
                        Jobs à définir (éditez-le !)
                </Card.Text>
                }
            </div>
            <Card.Footer className="d-flex justify-content-around">
                <Card.Text><a
                    className="btn btn-info"
                    href={`https://fr.finalfantasyxiv.com/lodestone/character/${id}`}
                    target={"_blanck"}
                >lodestone</a>
                </Card.Text>
                <DeleteBtn handleClick={() => { handleDelete(character) }} />
            </Card.Footer>
        </Card>
    )
}

export default CharacterDetailCard

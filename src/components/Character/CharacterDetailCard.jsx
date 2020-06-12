import React, { useContext, useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card'
import { Link, useHistory } from 'react-router-dom'
import { DeleteBtn } from '../formElements'
import { FirebaseContext } from '../firebase'

import './characterDetailCard.scss'
import JobListDisplay from '../../utils/jobListDisplay'
import { styleRole } from '../../utils/styleRole'
import { Roster } from '../../models'

const CharacterDetailCard = ({ character }) => {

    const history = useHistory()

    const firebase = useContext(FirebaseContext)
    const [rosterRL, setRosterRL] = useState(null)
    const [rosterMember, setRosterMember] = useState(null)

    const { portrait, name, id, _id, mainJob, secondJob, thirdJob } = character

    const style = styleRole(character.mainJob)

    useEffect(() => {
        let unsubscribe = firebase.db
            .collection("characters")
            .doc(character._id)
            .onSnapshot(snap => {
                if (snap.data() && snap.data().rosterRaidLeader) snap.data().rosterRaidLeader.get().then(data => setRosterRL(new Roster(data)))
                else if (snap.data() && snap.data().rosterMember) snap.data().rosterMember.get().then(data => setRosterMember(new Roster(data)))
            }
            )
        return () => {
            unsubscribe()
        }
    }, [firebase.db, character._id])


    const handleDelete = character => {
        const confirmation = window.confirm(`êtes-vous certain de supprimer ${name} de votre compte ?\nSi ce personnage était un raid lead, cela supprimera également son roster`)
        if (confirmation) {
            firebase.deleteCharacter(character)
        }
    }

    return (
        <Card border="dark" style={{ width: '18rem' }} >
            <div onClick={() => history.push(`/chr/${_id}`)}>
                <Card.Img variant="top" src={portrait} />
                <Card.Body style={style}>
                    <Card.Title>{name}</Card.Title>
                    {mainJob &&
                        <div className="d-flex justify-content-around">
                            <JobListDisplay job={mainJob} />{secondJob && <JobListDisplay job={secondJob} />}{thirdJob && <JobListDisplay job={thirdJob} />}
                        </div>
                    }
                    {!mainJob &&
                        <Card.Text className="d-flex justify-content-around">
                            <span>Jobs à définir (cliques sur son portrait !)</span>
                        </Card.Text>
                    }
                </Card.Body>
            </div>

            <Card.Body>
                {!rosterRL && !rosterMember && <Link to={`/roster/create/${character._id}`} className="btn btn-primary"><i className="fas fa-edit"></i>créer un roster</Link>
                }
                {rosterRL && <>
                    <Link to={`/roster/view/${rosterRL._id}/1`} className="btn btn-success mb-1"><i className="fas fa-eye"></i>roster</Link>
                    <Link to={`/roster/edit/${rosterRL._id}`} className="btn btn-primary"><i className="fas fa-edit"></i>administer son roster</Link></>
                }
                {rosterMember &&
                    <Link to={`/roster/view/${rosterMember._id}/1`} className="btn btn-success"><i className="fas fa-eye"></i>roster</Link>
                }
            </Card.Body>

            <Card.Footer className="d-flex justify-content-around">
                <Card.Text><a
                    className="btn btn-info"
                    href={`https://fr.finalfantasyxiv.com/lodestone/character/${id}`}
                    target={"_blanck"}
                >lodestone</a>
                </Card.Text>
                <DeleteBtn handleClick={() => { handleDelete(character) }} label="supprimer le personnage" />
            </Card.Footer>
        </Card>
    )
}

export default CharacterDetailCard

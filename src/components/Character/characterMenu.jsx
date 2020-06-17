import React, { useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { DeleteBtn } from '../formElements'
import { FirebaseContext } from '../firebase'
import JobListDisplay from '../../utils/jobListDisplay'
import { styleRole } from '../../utils/styleRole'
import { Roster } from '../../models'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import classNames from 'classnames'
import styles from './characterMenu.scss'
import Alert from 'react-bootstrap/Alert'

const cx = classNames.bind(styles)

const CharacterMenu = ({ character }) => {

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

    const seeRoster = () => {
        let rosterID = rosterRL ? rosterRL._id : rosterMember._id
        return <Link to={`/roster/view/${rosterID}/1`} className="btn btn-success mb-1"><i className="fas fa-eye"></i>voir le roster</Link>
    }
    const updateRoster = () => <Link to={`/roster/edit/${rosterRL._id}`} className="btn btn-primary"><i className="fas fa-edit"></i>modifier le roster</Link>
    const createRoster = () => <Link to={`/roster/create/${character._id}`} className="btn btn-primary"><i className="fas fa-edit"></i>créer un roster</Link>
    const menu_roster = () => {
        if (rosterRL) {
            return (<>
                {seeRoster()}
                {updateRoster()}
            </>)
        }
        if (rosterMember) {
            return seeRoster()
        }
        return createRoster()
    }
    const menu_chr = () => {
        return (<>
            <a
                className="btn btn-info"
                href={`https://fr.finalfantasyxiv.com/lodestone/character/${id}`}
                target={"_blanck"}
            >lodestone</a>
            <DeleteBtn handleClick={() => { handleDelete(character) }} /></>)
    }


    const handleDelete = character => {
        const confirmation = window.confirm(`êtes-vous certain de supprimer ${name} de votre compte ?\nSi ce personnage était un raid lead, cela supprimera également son roster`)
        if (confirmation) {
            firebase.deleteCharacter(character)
        }
    }

    return (
        <Container className={classNames("mb-2", cx("main_chr_container"))}>
            <Row>
                <div className={cx("chr_portrait_container")} onClick={() => history.push(`/chr/${_id}`)}>
                    <img className={cx("chr_portrait")} src={portrait} alt={name} />
                    <h3 className={cx("chr_name")} >{name}</h3>
                    <div className={cx("chr_portrait_jobs")}>
                        {mainJob ?
                            <div className="d-flex justify-content-around">
                                <JobListDisplay job={mainJob} />{secondJob && <JobListDisplay job={secondJob} />}{thirdJob && <JobListDisplay job={thirdJob} />}
                            </div>
                            : <div className="d-flex justify-content-around">
                                <Alert variant="warning">Jobs à définir - cliques sur le portrait</Alert>
                            </div>
                        }
                    </div>
                </div>
                <div className={cx("chr_menu_container")}>
                    <div className="menu_roster">
                        {menu_roster()}
                    </div>
                    <div className="menu_chr">
                        {menu_chr()}
                    </div>
                </div>
            </Row>
        </Container>
    )
}

export default CharacterMenu

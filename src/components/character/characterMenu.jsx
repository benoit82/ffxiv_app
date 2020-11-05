import React, { useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { DeleteBtn } from '../formElements'
import { FirebaseContext } from '../firebase'
import JobListDisplay from '../../utils/jobListDisplay'
import { Roster } from '../../models'
import classNames from 'classnames'
import Alert from 'react-bootstrap/Alert'
import Swal from 'sweetalert2'

import styles from './characterMenu.scss'
const cx = classNames.bind(styles)

const CharacterMenu = ({ character }) => {

    const history = useHistory()

    const firebase = useContext(FirebaseContext)
    const [rosterRL, setRosterRL] = useState(null)
    const [rosterMember, setRosterMember] = useState(null)

    const { portrait, name, id, _id, mainJob, secondJob, thirdJob } = character

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
    const updateRoster = () => <Link to={`/roster/edit/${rosterRL._id}`} className="btn btn-warning mb-1"><i className="fas fa-edit"></i>modifier le roster</Link>
    const createRoster = () => <Link to={`/roster/create/${character._id}`} className="btn btn-primary mb-1"><i className="fas fa-edit"></i>créer un roster</Link>
    const menu_roster = () => {
        if (rosterRL) {
            return (<>
                {seeRoster()}
                {updateRoster()}
                {createRoster()}
            </>)
        }
        if (rosterMember) {
            return (<>
                {seeRoster()}
                {createRoster()}
            </>)
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

    const handleDelete = async character => {
        const confirmation = await Swal.fire({
            icon: "warning",
            title: "Suppression de personnage",
            html: `êtes-vous certain de supprimer ${name} de votre compte ? <br/>
            Si ce personnage était un raid lead, cela supprimera également son roster.`,
            showCancelButton: true,
            confirmButtonText: `Oui, je veux supprimer ${name}`,
        })
        if (confirmation.value) {
            firebase.deleteCharacter(character)
        }
    }


    const handlePortraitClick = () => {
        history.push(`/chr/${_id}`)
    }

    return (
        <div className={classNames("mb-2", cx("main_chr_container"))}>
            <div className={cx("chr_portrait_container")} onClick={handlePortraitClick}>
                <img className={cx("chr_portrait")} src={portrait} alt={name} />
                <h3 className={cx("chr_name")} >{name}</h3>
                <div className={classNames("d-flex", "justify-content-around", cx("chr_portrait_jobs"))}>
                    {mainJob ?
                        <><JobListDisplay job={mainJob} />{secondJob && <JobListDisplay job={secondJob} />}{thirdJob && <JobListDisplay job={thirdJob} />}</>
                        : <Alert variant="warning">Jobs à définir - cliques sur le portrait</Alert>}
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
        </div>
    )
}

export default CharacterMenu

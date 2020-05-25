import React, { useContext, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { FirebaseContext } from '../firebase'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Msg from '../../utils/Msg'
import { UserApi } from '../../AppContext'

const EditCharacter = () => {

    const { chr_id } = useParams()
    const history = useHistory()
    const firebase = useContext(FirebaseContext)
    const User = useContext(UserApi)
    const [character, setCharacter] = useState({})
    const [errorMsg, setErrorMsg] = useState(null)

    const { user } = User

    useEffect(() => {
        // fetch a specific character by _id on param
        firebase.getCharacterByAccount(user.uid, chr_id, setCharacter, setErrorMsg)
        if (errorMsg) {
            setTimeout(() => {
                history.push("/user")
            }, 2000);
        }
    }, [errorMsg])

    const jobs = [
        ['tank', ['DRK', 'GNB', 'PLD', 'WAR']],
        ['heal', ['AST', 'SCH', 'WHM']],
        ['dps', ['BRD', 'BLM', 'DNC', 'DRG', 'MCH', 'MNK', 'NIN', 'RDM', 'SAM', 'SMN']]
    ]

    const optJobs = jobs.map((role, index) => {
        return (
            <optgroup key={index} label={role[0].toUpperCase()}>
                {role[1].map(job => {
                    return <option key={job}>{job}</option>
                })}
            </optgroup>
        )
    })

    const { avatar, name, id } = character
    return (
        <Container>
            {errorMsg
                ? <Msg error={errorMsg} />
                : <>
                    <Row className="d-flex justify-content-center">
                        <div className="d-flex bg-light rounded p-2 w-auto align-items-center">
                            <img src={avatar} alt={`avatar de ${name}`} className="rounded rounded-circle" />
                            <div className="d-flex flex-column">
                                <h3 className="ml-5">{name}</h3>
                                <a
                                    className="ml-auto"
                                    href={`https://fr.finalfantasyxiv.com/lodestone/character/${id}`}
                                    target={"_blanck"}
                                ><span className="badge badge-pill badge-info">lodestone</span></a>
                            </div>
                        </div>

                    </Row>
                    <Row className="bg-light mt-2">
                        <h4>Jobs</h4>
                        <ul>
                            <li>Job 1 : <select name="job1" id=""><option>---</option>{optJobs}</select></li>
                            <li>Job 2 : <select name="job2" id=""><option>---</option>{optJobs}</select></li>
                            <li>Job 3 : <select name="job3" id=""><option>---</option>{optJobs}</select></li>
                        </ul>
                    </Row>
                    <Row className="bg-light mt-2">
                        <h4>Wish list</h4>
                        <p>wish list pour chaque jobs : 1 par patch => admin : ajouter un patch
                son stuff actuel (import depuis lodestone ?)</p>
                    </Row>
                </>
            }

        </Container>
    )
}

export default EditCharacter

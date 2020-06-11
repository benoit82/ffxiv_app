import React, { useContext, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { FirebaseContext } from '../firebase'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import Row from 'react-bootstrap/Row'
import ListGroup from 'react-bootstrap/ListGroup'
import { SendBtn, EditBtn, ResetBtn } from '../formElements'
import { UserApi } from '../../utils/appContext'
import Select from 'react-select'
import { selectJobsGroup } from '../../utils/jobs'
import { styleRole } from '../../utils/styleRole'
import Col from 'react-bootstrap/Col'
import JobListDisplay from '../../utils/jobListDisplay'
import BISForm from './bisForm'
import { resetGearSet } from '../../utils/jobs'

import './editCharacter.scss'
import { Character } from '../../models'

/**
 * @route /param/chr/:chr_id
 */
const EditCharacter = () => {
    const history = useHistory()
    const { chr_id } = useParams()
    const firebase = useContext(FirebaseContext)
    const User = useContext(UserApi)
    const [character, setCharacter] = useState({})
    const [msgUpdate, setMsgUpdate] = useState("")

    // select state
    const [job1, setJob1] = useState("")
    const [job2, setJob2] = useState("")
    const [job3, setJob3] = useState("")
    const [jobForBis, setJobForBis] = useState("")

    const { user } = User

    const formatGroupLabel = data => (
        <div style={{ height: "20px" }}>
            <span>{data.label}</span>
        </div>
    );

    useEffect(() => {
        // load the roster
        const unsubcribe = firebase.db
            .collection("characters")
            .doc(chr_id)
            .onSnapshot(
                (snapshot) => {
                    const chr = new Character(snapshot)
                    if (chr.userRef !== null) {
                        chr.userRef.get().then(
                            response => {
                                const userData = response.data()
                                if (userData.uid !== user.uid) history.goBack()
                            }
                        )
                    } else {
                        history.goBack()
                    }
                    setCharacter(chr)
                    if (chr.mainJob) setJob1(chr.mainJob)
                    if (chr.secondJob) setJob2(chr.secondJob)
                    if (chr.thirdJob) setJob3(chr.thirdJob)
                },
                (error) => {
                    console.log(error.message)
                }
            );

        return () => unsubcribe();
    }, [chr_id, firebase.db, history, user.uid]);


    const handleSubmit = (event) => {
        event.preventDefault()
        let jobFields = {}
        if (job1.value) jobFields = { ...jobFields, mainJob: job1.value }
        if (job2.value && job2.value !== job1.value && job2.value !== job3.value) jobFields = { ...jobFields, secondJob: job2.value }
        if (job3.value && job3.value !== job1.value && job2.value !== job3.value) jobFields = { ...jobFields, thirdJob: job3.value }
        firebase.updateCharacter(character._id, jobFields)
    }

    const editBis = (job) => {
        setJobForBis(<BISForm job={job} character={character} updateBis={updateBis} resetBis={resetBis} />)
    }

    const updateBis = (val, job) => {
        const bis = { ...character.bis, [job]: val }
        firebase.updateCharacter(character._id, { bis })
        setMsgUpdate(<Alert variant="info">BIS pour {job} mis à jour !</Alert>)
        setTimeout(() => {
            setMsgUpdate("")
        }, 1500)
    }

    const resetBis = (job) => {
        if (window.confirm(`Êtes-vous certain de remettre à zero la liste B.I.S. pour le job ${job} ?`)) {
            const bis = { ...character.bis, [job]: resetGearSet }
            firebase.updateCharacter(character._id, { bis })
            setJobForBis(null)
        }
    }

    const resetAllBis = () => {
        if (window.confirm(`Êtes-vous certain de remettre à zero les listes B.I.S. ?`)) {
            let bis = { ...character.bis }
            if (mainJob) bis = { ...bis, [mainJob]: resetGearSet }
            if (secondJob) bis = { ...bis, [secondJob]: resetGearSet }
            if (thirdJob) bis = { ...bis, [thirdJob]: resetGearSet }
            firebase.updateCharacter(character._id, { bis })
            setJobForBis("")
        }
    }

    const { avatar, name, id, mainJob, secondJob, thirdJob } = character

    const style_role = styleRole(character.mainJob)

    return (
        <Container>
            <Row className="d-flex justify-content-center">
                {/* cadre avatar */}
                <div className="d-flex rounded p-2 w-auto align-items-center"
                    style={style_role}>
                    <img src={avatar} alt={`avatar de ${name}`} className="rounded rounded-circle" />
                    <div className="d-flex flex-column">
                        <h3 className="title_name">{name}</h3>
                        <div className="ml-5">
                            <span className="badge badge-pill">{mainJob && <JobListDisplay job={mainJob} />}</span>
                            <span className="badge badge-pill">{secondJob && <JobListDisplay job={secondJob} />}</span>
                            <span className="badge badge-pill">{thirdJob && <JobListDisplay job={thirdJob} />}</span>
                        </div>
                        <a
                            className="ml-auto"
                            href={`https://fr.finalfantasyxiv.com/lodestone/character/${id}`}
                            target={"_blanck"}
                        ><span className="badge badge-pill badge-info">lodestone</span></a>
                    </div>
                </div>
            </Row>
            <Row className="mt-3">
                <Col lg={3} className="mr-2">
                    <h3>Jobs</h3>
                    <form onSubmit={handleSubmit}>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item selectJob">
                                <Select
                                    className="basic-single"
                                    placeholder={character.mainJob || "Main job"}
                                    onChange={setJob1}
                                    value={job1}
                                    isSearchable
                                    name="job1"
                                    options={selectJobsGroup}
                                    formatGroupLabel={formatGroupLabel}
                                />
                                {character.mainJob && <EditBtn label={`édit. BIS ${character.mainJob}`} handleClick={() => editBis(character.mainJob)} />}
                            </li>
                            {job1 && <ListGroup.Item className="selectJob">
                                <Select
                                    className="basic-single"
                                    placeholder={character.secondJob || "2eme Job"}
                                    onChange={setJob2}
                                    value={job2}
                                    isSearchable
                                    name="job2"
                                    options={selectJobsGroup}
                                    formatGroupLabel={formatGroupLabel}
                                />
                                {character.secondJob && <EditBtn label={`édit. BIS ${character.secondJob}`} handleClick={() => editBis(character.secondJob)} />}
                            </ListGroup.Item>}
                            {job2 && <ListGroup.Item className="selectJob">
                                <Select
                                    className="basic-single"
                                    placeholder={character.thirdJob || "3eme Job"}
                                    onChange={setJob3}
                                    value={job3}
                                    isSearchable
                                    name="job3"
                                    options={selectJobsGroup}
                                    formatGroupLabel={formatGroupLabel}
                                />
                                {character.thirdJob && <EditBtn label={`édit. BIS ${character.thirdJob}`} handleClick={() => editBis(character.thirdJob)} />}
                            </ListGroup.Item>}
                            <ListGroup.Item>
                                <SendBtn label="mettre à jour les jobs" />
                                {character.bis && <ResetBtn label="reset tous les BIS" handleReset={resetAllBis} />}
                            </ListGroup.Item>
                        </ul>

                    </form>
                </Col>
                <Col>
                    {msgUpdate}
                    {jobForBis}
                </Col>
            </Row>
        </Container>
    )
}

export default EditCharacter

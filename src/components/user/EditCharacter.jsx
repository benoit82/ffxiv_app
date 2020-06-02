import React, { useContext, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { FirebaseContext } from '../firebase'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import Row from 'react-bootstrap/Row'
import ListGroup from 'react-bootstrap/ListGroup'
import { SendBtn } from '../formElements'
import { UserApi } from '../../AppContext'
import Select from 'react-select'
import { selectJobsGroup } from '../../utils/jobs'
import { styleRole } from '../../utils/styleRole'
import Col from 'react-bootstrap/Col'
import JobListDisplay from '../../utils/JobListDisplay'
import BISForm from '../character/BISForm'

import './EditCharacter.scss'

const EditCharacter = () => {
    const history = useHistory()
    const { chr_id } = useParams()
    const firebase = useContext(FirebaseContext)
    const User = useContext(UserApi)
    const [character, setCharacter] = useState({})
    const [updated, setUpdated] = useState(false)

    // select state
    const [job1, setJob1] = useState("")
    const [job2, setJob2] = useState("")
    const [job3, setJob3] = useState("")

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
                    const chr = { ...snapshot.data(), _id: snapshot.id }
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
    }, [chr_id]);




    const handleSubmit = (event) => {
        event.preventDefault()
        let chrToUpdate = { ...character }
        if (job1.value) chrToUpdate = { ...chrToUpdate, mainJob: job1.value }
        if (job2.value) chrToUpdate = { ...chrToUpdate, secondJob: job2.value }
        if (job3.value) chrToUpdate = { ...chrToUpdate, thirdJob: job3.value }
        firebase.updateCharacter(chrToUpdate)
    }

    const updateBis = (val, job) => {
        let chrToUpdate = {
            ...character, bis: {
                [job]: val
            }
        }
        firebase.updateCharacter(chrToUpdate)
        setUpdated(true)
        setTimeout(() => {
            setUpdated(false)
        }, 1500)
    }

    const resetBis = (job, emptyGearSet) => {
        if (window.confirm(`Êtes-vous certain de remettre à zero la liste B.I.S. pour le job ${job} ?`)) {
            let chrToUpdate = { ...character, bis: { [job]: emptyGearSet } }
            firebase.updateCharacter(chrToUpdate)
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
            <Row className="mt-2">
                <Col>
                    <h4>Jobs</h4>
                    <form onSubmit={handleSubmit}>
                        <ListGroup horizontal>
                            <ListGroup.Item className="selectJob">
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
                            </ListGroup.Item>
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
                            </ListGroup.Item>}
                            <ListGroup.Item>
                                <SendBtn />
                            </ListGroup.Item>
                        </ListGroup>

                    </form>
                </Col>
            </Row>
            {mainJob && <Row className="mt-2">
                <Col>
                    <h4>BIS</h4>
                    {updated && <Alert variant="info">BIS mis à jour !</Alert>}
                    {/* TODO : select on job1/2/3 only */}
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

                    {character && <BISForm job={mainJob} character={character} updateBis={updateBis} resetBis={resetBis} />}
                </Col>
            </Row>}
        </Container>
    )
}

export default EditCharacter

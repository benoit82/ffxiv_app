import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FirebaseContext } from '../firebase'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Msg from '../../utils/Msg'
import { UserApi } from '../../AppContext'
import Select from 'react-select'
import { jobsGroup } from '../../utils/listSelect'
import Col from 'react-bootstrap/Col'
import JobListDisplay from '../../utils/JobListDisplay'

const EditCharacter = () => {

    const { chr_id } = useParams()
    const firebase = useContext(FirebaseContext)
    const User = useContext(UserApi)
    const [character, setCharacter] = useState({})

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
    }, [firebase]);

    // useEffect(() => {
    //     // fetch a specific character by _id on param
    //     firebase.getCharacterByAccount(user.uid, chr_id, setCharacter, setErrorMsg)
    //     if (errorMsg) {
    //         setTimeout(() => {
    //             history.push("/user")
    //         }, 2000);
    //     }
    // }, [errorMsg])

    const handleSubmit = (event) => {
        event.preventDefault()
        let chrToUpdate = { ...character }
        if (job1.value) chrToUpdate = { ...chrToUpdate, mainJob: job1.value }
        if (job2.value) chrToUpdate = { ...chrToUpdate, secondJob: job2.value }
        if (job3.value) chrToUpdate = { ...chrToUpdate, thirdJob: job3.value }
        firebase.updateCharacter(chrToUpdate)
    }

    const { avatar, name, id, mainJob, secondJob, thirdJob } = character
    return (
        <Container>


            <Row className="d-flex justify-content-center">
                <div className="d-flex bg-light rounded p-2 w-auto align-items-center">
                    <img src={avatar} alt={`avatar de ${name}`} className="rounded rounded-circle" />
                    <div className="d-flex flex-column">
                        <h3 className="ml-5">{name}</h3>
                        <div>
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
            <Row className="bg-light mt-2">
                <Col>
                    <h4>Jobs</h4>
                    <ul>
                        <li>
                            <form onSubmit={handleSubmit}>
                                <Select
                                    className="basic-single"
                                    placeholder="Main job"
                                    onChange={setJob1}
                                    value={job1}
                                    isSearchable
                                    name="job1"
                                    options={jobsGroup}
                                    formatGroupLabel={formatGroupLabel}
                                />
                                <button type="submit">Envoyer</button>
                            </form>
                        </li>
                        <li>
                            <form onSubmit={handleSubmit}>
                                <Select
                                    className="basic-single"
                                    placeholder="2eme Job"
                                    onChange={setJob2}
                                    value={job2}
                                    isSearchable
                                    name="job2"
                                    options={jobsGroup}
                                    formatGroupLabel={formatGroupLabel}
                                />
                                <button type="submit">Envoyer</button>
                            </form>
                        </li>
                        <li>
                            <form onSubmit={handleSubmit}>
                                <Select
                                    className="basic-single"
                                    placeholder="3eme Job"
                                    onChange={setJob3}
                                    value={job3}
                                    isSearchable
                                    name="job3"
                                    options={jobsGroup}
                                    formatGroupLabel={formatGroupLabel}
                                />
                                <button type="submit">Envoyer</button>
                            </form>
                        </li>
                    </ul>
                </Col>
            </Row>
            <Row className="bg-light mt-2">
                <h4>Wish list</h4>
                <p>wish list pour chaque jobs : 1 par patch => admin : ajouter un patch
                son stuff actuel (import depuis lodestone ?)</p>
            </Row>



        </Container>
    )
}

export default EditCharacter

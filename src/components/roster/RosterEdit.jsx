import React, { useEffect, useState, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { FirebaseContext } from '../firebase'
import Msg from '../../utils/Msg'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import { Formik, FieldArray, Field } from 'formik'
import Form from 'react-bootstrap/Form'
import { SendBtn, AddBtn } from '../formElements'
import * as Yup from 'yup'
import Col from 'react-bootstrap/Col'

const RosterEdit = () => {

    const { roster_id } = useParams()
    const history = useHistory()
    const firebase = useContext(FirebaseContext)
    const [roster, setRoster] = useState({})
    const [errorMsg, setErrorMsg] = useState(null)
    const [characters, setCharacters] = useState([])

    const { name, refRaidLeader } = roster

    useEffect(() => {
        firebase.getRoster(roster_id, setRoster, setErrorMsg)
        firebase.getAllCharacters(setCharacters)
    }, [])

    useEffect(() => {
        if (errorMsg) {
            setTimeout(() => {
                history.push("/admin")
            }, 2000);
        }
    }, [errorMsg])

    const findRefRaidLeader = () => {
        return characters.some(chr => chr._id === refRaidLeader) ? characters.find(chr => chr._id === refRaidLeader)._id : ''
    }

    const handleSubmit = (values) => {
        console.log(values)
    }

    const rosterSchema = Yup.object().shape({
        refRaidLeader: Yup.string()
            .required("choisissez une autre value")
        ,
    });

    return (
        <>
            {errorMsg
                ? <Msg error={errorMsg} />
                : <Container>
                    <Row>
                        <h2>Roster : {name}</h2>
                    </Row>

                    <Formik
                        enableReinitialize
                        initialValues={
                            {
                                refRaidLeader: findRefRaidLeader(),
                                refMembers: ["", "", "", "", "", "", "",]
                            }}
                        onSubmit={handleSubmit}
                        validationSchema={rosterSchema}
                    >
                        {({ handleSubmit, handleChange, values, errors }) => (
                            <Row>
                                <Form onSubmit={handleSubmit}>

                                    <Form.Group controlId="refRaidLeader">
                                        <Form.Label>Raid Leader : </Form.Label>
                                        <Form.Control
                                            custom
                                            as="select"
                                            value={values.refRaidLeader}
                                            onChange={handleChange}
                                            isInvalid={errors.refRaidLeader}
                                        >
                                            <option key={0} value="" disabled>Choisir un nouveau raid leader</option>
                                            {characters.map(chr => <option key={chr._id} value={chr._id} >{chr.name}</option>)}
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">{errors.refRaidLeader}</Form.Control.Feedback>
                                    </Form.Group>

                                    Membres :

                                    <FieldArray
                                        name="refMembers"
                                        render={arrayHelpers => (
                                            <>
                                                {
                                                    values.refMembers && values.refMembers.map((member, index) => (
                                                        <Form.Group key={index} controlId={`refMembers.${index}`}>
                                                            <Form.Control
                                                                custom
                                                                as="select"
                                                                value={values.refMembers[index]}
                                                                onChange={handleChange}
                                                                isInvalid={errors.refMembers}
                                                            >
                                                                <option key={0} value="" disabled>Choisir un nouveau membre</option>
                                                                {characters.map(chr => <option key={chr._id} value={chr._id} >{chr.name}</option>)}
                                                            </Form.Control>
                                                            <Form.Control.Feedback type="invalid">{errors.refMembers}</Form.Control.Feedback>

                                                        </Form.Group>
                                                    ))
                                                }
                                            </>
                                        )}
                                    />
                                    <Form.Group>
                                        <SendBtn />
                                    </Form.Group>
                                </Form>
                            </Row>
                        )}
                    </Formik>

                </Container>
            }
        </>
    )
}

export default RosterEdit

import React, { useState, useEffect, useContext } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import * as Yup from 'yup'
import { ROSTER_NAME_MIN, ROSTER_NAME_MAX, ROSTER_NAME_ERR_MSG, FIELD_REQUIRED } from "../../utils/consts";
import { Formik, Field } from 'formik'
import { SendBtn } from '../formElements'
import Msg from '../../utils/msg'
import { FirebaseContext } from '../firebase'
import Select from 'react-select'


const RosterCreate = ({ userChrList }) => {
    const firebase = useContext(FirebaseContext);
    const [characters, setCharacters] = useState([]);
    const [placeHolderChr, setPlaceHolderChr] = useState("Choisir un personnage")
    const [infoMsg, setInfoMsg] = useState(null);

    useEffect(() => {
        // get characters list
        userChrList !== undefined ? setCharacters(userChrList.filter(chr => chr.rosterRaidLeader === null))
            : firebase.getAllCharacters(setCharacters, { filter: "rosterRaidLeader" });
    }, [firebase]);


    const createRoster = (values) => {
        const { name, refRaidLeader } = values;
        //enregistrement DB
        try {
            firebase.addRoster({ name, refRaidLeader });
            let chrsCopy = [...characters].filter(chr => chr.rosterRaidLeader === null)
            setCharacters(chrsCopy)
        } catch (error) {
            setInfoMsg(<Row><Msg error={{ message: error.message }} /></Row>);
        }
    };

    const RosterSchema = Yup.object().shape({
        name: Yup.string()
            .min(ROSTER_NAME_MIN, ROSTER_NAME_ERR_MSG)
            .max(ROSTER_NAME_MAX, ROSTER_NAME_ERR_MSG)
            .required(FIELD_REQUIRED),
        refRaidLeader: Yup.string().required(FIELD_REQUIRED),
    });

    const onSubmit = (values, { resetForm }) => {
        createRoster(values)
        resetForm({})
    };

    return (
        <Container>
            {infoMsg}
            <Row><h2>Créer un roster</h2></Row>
            <Row>
                <Formik
                    enableReinitialize
                    validationSchema={RosterSchema}
                    onSubmit={onSubmit}
                    initialValues={{
                        name: ""
                    }}
                >
                    {({ handleSubmit, handleChange, values, touched, errors, field, options, setFieldValue }) => (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="name">
                                <Form.Control
                                    type="text"
                                    placeholder="nom du roster"
                                    value={values.name}
                                    onChange={handleChange}
                                    isValid={touched.name && !errors.name}
                                    isInvalid={!!errors.name}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="refRaidLeader">
                                <Field
                                    as={Select}
                                    isClearable
                                    placeholder={placeHolderChr}
                                    options={characters}
                                    name="refRaidLeader"
                                    onChange={(option) => {
                                        setFieldValue("refRaidLeader", option.value)
                                        setPlaceHolderChr(option.label)
                                    }}
                                    value={options ? options.find(option => option.value === field.value) : ''}
                                />
                            </Form.Group>

                            <SendBtn />
                        </Form>
                    )}
                </Formik>
            </Row>
        </Container>
    )
}

export default RosterCreate

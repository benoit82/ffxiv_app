import React, { useState, useEffect, useContext } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import * as Yup from 'yup'
import { ROSTER_NAME_MIN, ROSTER_NAME_MAX, ROSTER_NAME_ERR_MSG, FIELD_REQUIRED } from "../../utils/consts";
import { Formik } from 'formik'
import { SendBtn } from '../formElements'
import Msg from '../../utils/msg'
import { FirebaseContext } from '../firebase'


const RosterCreate = (
    // userChrList // TODO : to be developed , if null => getAllCharacters (witch is not raidleader yet)
) => {
    const firebase = useContext(FirebaseContext);
    const [characters, setCharacters] = useState([]);
    const [infoMsg, setInfoMsg] = useState(null);

    useEffect(() => {
        // get characters list
        firebase.getAllCharacters(setCharacters);
    }, [firebase]);


    const createRoster = (values) => {
        const { name, refRaidLeader } = values;
        //enregistrement DB
        try {
            firebase.addRoster({ name, refRaidLeader });
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

    const optCharacters = characters.map((character) => (
        <option key={character.id} value={character._id}>
            {character.name}
        </option>
    ));

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
                    {({ handleSubmit, handleChange, values, touched, errors }) => (
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col>
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
                                </Col>
                                <Col>
                                    <Form.Group controlId="refRaidLeader">
                                        <Form.Control
                                            as="select"
                                            custom
                                            onChange={handleChange}
                                            value={values.refRaidLeader}
                                        >
                                            <option value="">Choisir le perso raid leader</option>
                                            {optCharacters}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <SendBtn />
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Formik>
            </Row>
        </Container>
    )
}

export default RosterCreate

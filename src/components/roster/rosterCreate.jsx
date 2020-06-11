import React, { useState, useContext } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import * as Yup from 'yup'
import { ROSTER_NAME_MIN, ROSTER_NAME_MAX, ROSTER_NAME_ERR_MSG, FIELD_REQUIRED } from "../../utils/consts";
import { Formik } from 'formik'
import { SendBtn } from '../formElements'
import Msg from '../../utils/msg'
import { FirebaseContext } from '../firebase'
import { useParams, useHistory } from 'react-router-dom'
import { UserApi } from '../../utils/appContext'


const RosterCreate = () => {
    const { character_id } = useParams()
    const { user } = useContext(UserApi)
    const chrCreator = user.characters.find(chr => chr.id === character_id)
    const history = useHistory()
    const firebase = useContext(FirebaseContext);
    const [infoMsg, setInfoMsg] = useState(null);

    const RosterSchema = Yup.object().shape({
        name: Yup.string()
            .min(ROSTER_NAME_MIN, ROSTER_NAME_ERR_MSG)
            .max(ROSTER_NAME_MAX, ROSTER_NAME_ERR_MSG)
            .required(FIELD_REQUIRED),
    });

    const onSubmit = async (values) => {
        const { name } = values;
        //enregistrement DB
        try {
            const roster_id = await firebase.addRoster({ name, refRaidLeader: chrCreator, rosterMembers: [] });
            history.replace(`/roster/edit/${roster_id}`)
        } catch (error) {
            setInfoMsg(<Row><Msg error={{ message: error.message }} /></Row>);
        }
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
                            <SendBtn />
                        </Form>
                    )}
                </Formik>
            </Row>
        </Container>
    )
}

export default RosterCreate

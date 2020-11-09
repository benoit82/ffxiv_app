import React, { useContext } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Col, Form } from 'react-bootstrap'
import { API_KEY_REGEX, API_KEY_ERR_REGEX, FIELD_REQUIRED } from '../../utils/consts'
import { UpdateBtn } from '../formElements'
import { UserApi } from '../../utils/appContext'
import { FirebaseContext } from '../firebase'
import { showInfoMessage } from '../../utils/globalFunctions'

function FFlogAccountUpdate() {

    const User = useContext(UserApi)
    const firebase = useContext(FirebaseContext)

    const formik = useFormik({
        initialValues: {
            name: User.user.fflogsAccount.name || "",
            apiKey: User.user.fflogsAccount.apiKey || ""
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required(FIELD_REQUIRED),
            apiKey: Yup.string().required(FIELD_REQUIRED).matches(API_KEY_REGEX, API_KEY_ERR_REGEX),
        }),
        onSubmit: async (values) => {
            try {
                await firebase.updateUser(User.user, { fflogsAccount: values })
            } catch (error) {
                showInfoMessage("error", error.message)
            }

        }
    })

    return (
        <Col lg={5}>
            <Form onSubmit={formik.handleSubmit}>
                <h2>Mettre à jour son compte FF-Logs</h2>
                <Form.Group controlId="name">
                    <Form.Label>Pseudo du compte</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        isInvalid={formik.errors.name && formik.validateOnChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formik.errors.name}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Label>V1 Client Key, sur FF-Logs : <a href={"https://www.fflogs.com/profile"} target="_blank" rel="noopener noreferrer">Réglage > Web API</a></Form.Label>
                    <Form.Control
                        type="apiKey"
                        name="apiKey"
                        isInvalid={formik.errors.apiKey && formik.validateOnChange}
                        value={formik.values.apiKey}
                        onChange={formik.handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formik.errors.apiKey}
                    </Form.Control.Feedback>
                </Form.Group>
                <UpdateBtn />
                <pre>{JSON.stringify(formik.values, null, 2)}</pre>
            </Form>
        </Col>
    )
}

export default FFlogAccountUpdate;

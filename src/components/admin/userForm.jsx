import React, { useContext } from 'react'
import { useFormik } from 'formik'
import Form from 'react-bootstrap/Form'
import * as Yup from 'yup'
import { UpdateBtn } from '../formElements'
import { FirebaseContext } from '../firebase'
import { FIELD_REQUIRED, PSEUDO_MIN, PSEUDO_MAX, PSEUDO_ERR_MSG } from '../../utils/consts'
import FormCheck from 'react-bootstrap/FormCheck'
import { PropTypes } from 'prop-types'
import { User } from '../../models'

const UserForm = ({ user }) => {
    const firebase = useContext(FirebaseContext)
    const { pseudo, isAdmin, isCrafter, isGatherer } = user
    const formik = useFormik({
        initialValues: {
            pseudo,
            isAdmin,
            isCrafter,
            isGatherer
        },
        validationSchema: Yup.object().shape({
            pseudo: Yup.string()
                .min(PSEUDO_MIN, PSEUDO_ERR_MSG)
                .max(PSEUDO_MAX, PSEUDO_ERR_MSG)
                .required(FIELD_REQUIRED)
        }),
        onSubmit: values => updateUser(values)
    })


    const updateUser = (values) => {
        firebase.updateUser(user, values)
    }


    return (
        <Form onSubmit={formik.handleSubmit}>
            <Form.Group controlId="pseudo">
                <Form.Label>Pseudo</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Pseudo"
                    value={formik.values.pseudo}
                    onChange={formik.handleChange}
                    isValid={formik.touched.pseudo && !formik.errors.pseudo}
                    isInvalid={formik.errors.pseudo}
                />
                <Form.Control.Feedback type="invalid">
                    {formik.errors.pseudo}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="isAdmin">
                <FormCheck
                    type="checkbox"
                    checked={formik.values.isAdmin}
                    value={formik.values.isAdmin}
                    onChange={formik.handleChange}
                    label="Admin"
                    custom
                />
            </Form.Group>
            <Form.Group controlId="isCrafter">
                <FormCheck
                    type="checkbox"
                    checked={formik.values.isCrafter}
                    value={formik.values.isCrafter}
                    onChange={formik.handleChange}
                    label="Crafteur"
                    custom
                />
            </Form.Group>
            <Form.Group controlId="isGatherer">
                <FormCheck
                    type="checkbox"
                    checked={formik.values.isGatherer}
                    value={formik.values.isGatherer}
                    onChange={formik.handleChange}
                    label="Récolteur"
                    custom
                />
            </Form.Group>
            <UpdateBtn />
        </Form>
    )
}
UserForm.propTypes = {
    user: PropTypes.instanceOf(User).isRequired,
}
export default UserForm

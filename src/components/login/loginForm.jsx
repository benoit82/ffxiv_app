import React, { useContext } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { FirebaseContext } from '../firebase'
import { UserApi } from '../../utils/appContext'
import Form from 'react-bootstrap/Form'
import { SendBtn } from '../formElements'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import FormCheck from 'react-bootstrap/FormCheck'
import { EMAIL_ERR_MSG, FIELD_REQUIRED, PASSWORD_ERR_MSG, PASSWORD_MIN } from '../../utils/consts'
import { showInfoMessage } from '../../utils/globalFunctions'

const LoginForm = () => {
  const firebase = useContext(FirebaseContext)
  const history = useHistory()
  const location = useLocation()
  const User = useContext(UserApi)
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email(EMAIL_ERR_MSG)
        .required(FIELD_REQUIRED),
      password: Yup.string()
        .min(PASSWORD_MIN, PASSWORD_ERR_MSG)
        .required(FIELD_REQUIRED),
      remindMe: Yup.boolean()
        .notRequired()
    }),
    onSubmit: values => loginWithFirebase(values)

  })

  const loginWithFirebase = async (values) => {
    try {
      const response = await firebase.signInUser(values.email, values.password)
      User.setUser(response)
      values.remindMe ? localStorage.setItem('uid', response.uid) : localStorage.removeItem('uid')
      if (location.state && location.state.from.pathname === '/admin' &&
                !response.isAdmin) {
        showInfoMessage('error', "Accès insuffisant pour accèder à la page demandée, redirection dans 2 secondes vers la page d'acceuil")
        setTimeout(() => { history.push('/') }, 2000)
      } else {
        history.push(location.state ? location.state.from.pathname : '/')
      }
    } catch (error) {
      showInfoMessage('error', error.message)
    }
  }

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group controlId='email'>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type='email'
          placeholder='Email'
          value={formik.values.email}
          onChange={formik.handleChange}
          isValid={formik.touched.email && !formik.errors.email}
          isInvalid={!!formik.errors.email}
        />
        <Form.Control.Feedback type='invalid'>
          {formik.errors.email}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId='password'>
        <Form.Label>Mot de passe</Form.Label>
        <Form.Control
          type='password'
          placeholder='Mot de passe'
          value={formik.values.password}
          onChange={formik.handleChange}
          isValid={formik.touched.password && !formik.errors.password}
          isInvalid={!!formik.errors.password}
        />
        <Form.Control.Feedback type='invalid'>
          {formik.errors.password}
        </Form.Control.Feedback>
      </Form.Group>

      {/* checkbox à faire pour un remindMe */}
      <Form.Group controlId='remindMe'>
        <FormCheck
          type='checkbox'
          value={formik.values.remindMe}
          onChange={formik.handleChange}
          isValid={formik.touched.remindMe}
          label='Se souvenir de moi'
          custom
        />
      </Form.Group>
      <SendBtn />
    </Form>
  )
}

export default LoginForm

import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FirebaseContext } from '../firebase'
import Form from 'react-bootstrap/Form'
import { SendBtn, ResetBtn } from '../formElements'
import Alert from 'react-bootstrap/Alert'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { PSEUDO_MIN, PSEUDO_ERR_MSG, PSEUDO_MAX, FIELD_REQUIRED, PASSWORD_CONF_ERR_MSG, PASSWORD_MIN, PASSWORD_ERR_MSG, EMAIL_ERR_MSG } from '../../utils/consts'

const SignupForm = () => {
  const firebase = useContext(FirebaseContext)
  const [errorMsg, setErrorMsg] = useState(null)
  const history = useHistory()

  const signupToFirebase = async (values) => {
    setErrorMsg(null)
    try {
      const newUser = await firebase.signUpUser(values.email.trim(), values.password.trim())
      const uid = newUser.user.uid
      const configNewUser = {
        uid,
        pseudo: values.pseudo.trim(),
        email: values.email.trim(),
        createdAt: new Date(),
        isAdmin: false,
        refRosterRaidLeader: null,
        isCrafter: false,
        isGatherer: false,
        rosterRefs: null
      }
      firebase.addUser(uid, configNewUser)
      history.push('/')
    } catch (error) {
      setErrorMsg(<Alert variant='danger' className='mt-3'>Erreur : <br /><strong>{error.message}</strong></Alert>)
    }
  }
  // gestion du formulaire avec Formik
  // schema de validation
  const signupSchema = Yup.object().shape({
    pseudo: Yup.string()
      .min(PSEUDO_MIN, PSEUDO_ERR_MSG)
      .max(PSEUDO_MAX, PSEUDO_ERR_MSG)
      .required(FIELD_REQUIRED),
    email: Yup.string()
      .email(EMAIL_ERR_MSG)
      .required(FIELD_REQUIRED),
    password: Yup.string()
      .min(PASSWORD_MIN, PASSWORD_ERR_MSG)
      .required(FIELD_REQUIRED),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], PASSWORD_CONF_ERR_MSG)
      .required(FIELD_REQUIRED)
  })

  return (
    <>
      {errorMsg}
      <Formik
        validationSchema={signupSchema}
        onSubmit={values => signupToFirebase(values)}
        initialValues={{
          pseudo: '',
          email: '',
          password: '',
          confirmPassword: ''
        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleReset,
          values,
          touched,
          errors
        }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='pseudo'>
              <Form.Label>Pseudo</Form.Label>
              <Form.Control
                type='text'
                placeholder='Pseudo'
                value={values.pseudo}
                onChange={handleChange}
                isValid={touched.pseudo && !errors.pseudo}
                isInvalid={errors.pseudo}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.pseudo}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='Email'
                value={values.email}
                onChange={handleChange}
                isValid={touched.email && !errors.email}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId='password'>
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type='password'
                placeholder='Mot de passe'
                value={values.password}
                onChange={handleChange}
                isValid={touched.password && !errors.password}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId='confirmPassword'>
              <Form.Label>Confirmation du mot de passe</Form.Label>
              <Form.Control
                type='password'
                placeholder='Mot de passe'
                value={values.confirmPassword}
                onChange={handleChange}
                isValid={touched.confirmPassword && !errors.confirmPassword}
                isInvalid={!!errors.confirmPassword}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>
            <SendBtn />{' '}
            <ResetBtn handleReset={handleReset} />
          </Form>
        )}
      </Formik>

      <Alert variant='info' className='mt-3'>Déjà inscrit ? Aller à la page de <Link to='/login'>connexion</Link> !</Alert>
    </>
  )
}

export default SignupForm

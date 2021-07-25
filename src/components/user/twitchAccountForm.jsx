import React, { useContext } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Form } from 'react-bootstrap'
import { UpdateBtn } from '../formElements'
import { UserApi } from '../../utils/appContext'
import { FirebaseContext } from '../firebase'
import { showInfoMessage } from '../../utils/globalFunctions'

function TwitchAccountForm () {
  const User = useContext(UserApi)
  const firebase = useContext(FirebaseContext)

  const formik = useFormik({
    initialValues: {
      twitchAccount: User.user.twitchAccount || ''
    },
    validationSchema: Yup.object().shape({
      twitchAccount: Yup.string()
    }),
    onSubmit: async (values) => {
      const { twitchAccount } = values
      try {
        await firebase.updateUser(User.user, { twitchAccount })
      } catch (error) {
        showInfoMessage('error', error.message)
      }
    }
  })

  return (
    <Form onSubmit={formik.handleSubmit}>
      <h2>Mettre à jour son compte Twitch</h2>
      <Form.Group controlId='twitchAccount'>
        <Form.Label>Pseudo du compte</Form.Label>
        <Form.Control
          type='text'
          name='twitchAccount'
          value={formik.values.twitchAccount}
          onChange={formik.handleChange}
          isInvalid={formik.errors.twitchAccount && formik.validateOnChange}
        />
        <Form.Control.Feedback type='invalid'>
          {formik.errors.twitchAccount}
        </Form.Control.Feedback>
      </Form.Group>
      <UpdateBtn />
      {/* <pre>{JSON.stringify(formik.values, null, 2)}</pre> */}
    </Form>
  )
}

export default TwitchAccountForm

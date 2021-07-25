import React, { useState, useContext, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import * as Yup from 'yup'
import { ROSTER_NAME_MIN, ROSTER_NAME_MAX, ROSTER_NAME_ERR_MSG, FIELD_REQUIRED } from '../../utils/consts'
import { useFormik } from 'formik'
import { SendBtn } from '../formElements'
import { FirebaseContext } from '../firebase'
import { useParams, useHistory } from 'react-router-dom'
import { UserApi } from '../../utils/appContext'
import { Character } from '../../models'
import { toast } from '../../utils/globalFunctions'

const RosterCreate = () => {
  const { characterID } = useParams()
  const { user } = useContext(UserApi)
  const chrCreator = user.characters.find(chr => chr.id === characterID)
  const [chrFromDB, setChrFromDB] = useState({})
  const history = useHistory()
  const firebase = useContext(FirebaseContext)
  const formik = useFormik({
    initialValues: {
      name: '',
      tmp: (chrFromDB.rosterRaidLeader !== null || chrFromDB.rosterMember !== null)
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .min(ROSTER_NAME_MIN, ROSTER_NAME_ERR_MSG)
        .max(ROSTER_NAME_MAX, ROSTER_NAME_ERR_MSG)
        .required(FIELD_REQUIRED)
    }),
    onSubmit: async (values) => {
      const { name, tmp } = values
      const userRef = tmp ? firebase.db.collection('users').doc(user.uid) : null
      // payloadbuilder
      const payloadbuilder = tmp ? { name, tmp: true, userRef, rosterMembers: [chrCreator] } : { name, refRaidLeader: chrCreator, rosterMembers: [], tmp: false }
      // enregistrement DB
      try {
        const rosterID = await firebase.addRoster(payloadbuilder)
        history.replace(`/roster/edit/${rosterID}`)
      } catch (error) {
        toast('error', error.message)
      }
    }
  })

  useEffect(() => {
    // get ChrCreatorData
    const unsubscribe = firebase.db.collection('characters').doc(characterID)
      .onSnapshot(snap => {
        setChrFromDB(new Character(snap))
      })
    return () => unsubscribe()
  }, [characterID, firebase.db])

  return (
    <Form className='custom__container form__container auto_margin' onSubmit={formik.handleSubmit}>
      <Form.Group controlId='name'>
        <Form.Control
          type='text'
          placeholder='nom du roster'
          value={formik.values.name}
          onChange={formik.handleChange}
          isValid={formik.touched.name && !formik.errors.name}
          isInvalid={!!formik.errors.name}
        />
        <Form.Control.Feedback type='invalid'>
          {formik.errors.name}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId='tmp'>
        <Form.Check
          custom
          type='checkbox'
          label='roster temporaire'
          value={formik.values.tmp}
          onChange={formik.handleChange}
          checked={formik.values.tmp}
          disabled={(chrFromDB.rosterRaidLeader !== null || chrFromDB.rosterMember !== null)}
        />
      </Form.Group>
      <SendBtn />
    </Form>

  )
}

export default RosterCreate

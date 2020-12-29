import React, { useContext, useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { UserApi } from '../../utils/appContext'
import { FirebaseContext } from '../firebase'
import { ResetBtn, SendBtn } from '../formElements'
import Calendar from 'react-calendar'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FFXIV_ARR_RELEASE_DATE } from '../../utils/consts'
import { showInfoMessage } from '../../utils/globalFunctions'
import Axios from 'axios'
import { PropTypes } from 'prop-types'
import { Roster } from '../../models'

import 'react-calendar/dist/Calendar.css'
import './fflogAdd.scss'

function FFLogAdd({ roster, patchList, onFormSubmit }) {
  const [showCalendar, setShowCalendar] = useState(false)
  const [loading, setLoading] = useState(false)
  const firebase = useContext(FirebaseContext)
  const { user } = useContext(UserApi)

  const initialValues = {
    title: '',
    fflogurl: '',
    dateRaid: new Date(),
    patch: patchList[0]
  }
  const fflogValidationSchema = Yup.object().shape({
    title: Yup.string().trim().max(60, 'Titre trop long (max. 60 caractères)').notRequired(),
    fflogurl: Yup.string().trim().required('La saisie est vide').matches(/^https:\/\/([a-z]{2}|www)\.fflogs\.com\/reports\/([a-zA-Z0-9]{16,})\/?/gi, "Ce n'est pas une URL FFLog valide")
  })
  const formik = useFormik({
    initialValues,
    validationSchema: fflogValidationSchema,
    onSubmit: async (values) => {
      // hiding calendar
      setShowCalendar(false)
      // inserting user_uid on values
      values.pseudo = user.pseudo
      values.uid = user.uid
      // send datas to Firebase DB
      try {
        await firebase.addFFLog(values, roster)
      } catch (error) {
        showInfoMessage('error', 'problème de communication avec la base de donnée, réessayes plus tard.')
      }
      // enable sending btn again
      formik.setSubmitting(false)
      formik.resetForm()
      onFormSubmit()
    }
  })

  const handleCalendarClick = () => setShowCalendar(!showCalendar)

  const fetchPatch = (date) => formik.setFieldValue('dateRaid', date)

  const importFFLogsData = async () => {
    setLoading(true)
    try {
      const fflogUrlSearch = (roster.fflog) ? `https://www.fflogs.com/v1/reports/guild/${roster.fflog.guildName}/${roster.fflog.guildServer}/${roster.fflog.region}` : `https://www.fflogs.com/v1/reports/user/${user.fflogsAccount.name}`
      const lastUserLog = await (await Axios.get(`${fflogUrlSearch}?api_key=${user.fflogsAccount.apiKey}`)).data.shift()
      formik.setFieldValue('title', lastUserLog.title)
      formik.setFieldValue('fflogurl', `https://fr.fflogs.com/reports/${lastUserLog.id}`)
      fetchPatch(new Date(lastUserLog.start))
    } catch (error) {
      showInfoMessage('error', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {user.fflogsAccount.name &&
        <Button style={{ marginBottom: '1rem', width: '100%' }} variant='info' onClick={importFFLogsData}>
          <i className='fas fa-external-link-alt' />{loading ? 'Chargement des données' : 'Importer le dernier log depuis FF-Logs'}
        </Button>}
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group controlId='title'>
          <Form.Control
            type='text'
            placeholder='titre du run'
            value={formik.values.title}
            onChange={formik.handleChange}
            isInvalid={formik.touched.fflogurl && formik.errors.title}
          />
          <Form.Control.Feedback type='invalid'>{formik.errors.title}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId='fflogurl'>
          <InputGroup>
            <Form.Control
              type='text'
              placeholder='https://www.fflogs.com/reports/....'
              value={formik.values.fflogurl}
              onChange={formik.handleChange}
              isInvalid={formik.touched.fflogurl && formik.errors.fflogurl}
              required
            />
            {formik.values.fflogurl.match(/^https:\/\/([a-z]{2}|www)\.fflogs\.com\/reports\/([a-zA-Z0-9]{16,})$/gi) &&
              <InputGroup.Append>
                <InputGroup.Text>
                  <a href={formik.values.fflogurl} target='_blank' rel='noopener noreferrer'>
                    <i className='fas fa-external-link-alt' />vérifier
                  </a>
                </InputGroup.Text>
              </InputGroup.Append>}
          </InputGroup>
          <Form.Control.Feedback type='invalid'>{formik.errors.fflogurl}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId='patch'>
          <Form.Control
            as='select'
            value={formik.values.patch}
            onChange={formik.handleChange}
            custom
          >
            {patchList.map(patch => <option key={patch}>{patch}</option>)}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId='dateRaid'>
          <Button style={{ marginBottom: '1rem', width: '100%' }} variant='outline-primary' onClick={handleCalendarClick}><i className='far fa-calendar' />Raid du : {formik.values.dateRaid.toLocaleDateString()}</Button>
          {showCalendar &&
            <Calendar
              value={formik.values.dateRaid}
              minDate={FFXIV_ARR_RELEASE_DATE}
              maxDate={new Date()}
              onChange={(value) => fetchPatch(value)}
            />}
        </Form.Group>
        <div className='btn_container'>
          <SendBtn isDisabled={formik.isSubmitting} label='Envoyer le lien' />
          <ResetBtn isDisabled={formik.isSubmitting} handleReset={() => formik.handleReset()} />
        </div>
        {/* <pre>{JSON.stringify(formik.values, null, 2)}</pre> */}
      </Form>
    </>
  )
}
FFLogAdd.propTypes = {
  roster: PropTypes.instanceOf(Roster).isRequired,
  patchList: PropTypes.array.isRequired,
  onFormSubmit: PropTypes.func.isRequired
}
export default FFLogAdd

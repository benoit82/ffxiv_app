import React, { useContext, useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { UserApi } from '../../utils/appContext'
import { FirebaseContext } from '../firebase'
import { SendBtn } from '../formElements'
import Calendar from 'react-calendar'
import { useFormik } from 'formik'
import * as Yup from "yup"
import 'react-calendar/dist/Calendar.css';
import { FFXIV_ARR_RELEASE_DATE } from '../../utils/consts'
import { showInfoMessage } from '../../utils/globalFunctions'
import Axios from 'axios'

function FFLogAdd({ roster, patchList, onFormSubmit }) {
    const [showCalendar, setShowCalendar] = useState(false)
    const firebase = useContext(FirebaseContext)
    const { user } = useContext(UserApi)

    const initialValues = {
        title: "",
        fflogurl: "",
        dateRaid: new Date(),
        patch: patchList[0].name
    }
    const fflogValidationSchema = Yup.object().shape({
        title: Yup.string().trim().max(60, "Titre trop long (max. 60 caractères)").notRequired(),
        fflogurl: Yup.string().trim().required("La saisie est vide").matches(/^https:\/\/([a-z]{2}|www)\.fflogs\.com\/reports\/([a-zA-Z0-9]{16,})$/gi, "Ce n'est pas une URL FFLog valide")
    })
    const formik = useFormik({
        initialValues,
        validationSchema: fflogValidationSchema,
        onSubmit: async (values) => {
            // hiding calendar
            setShowCalendar(false)
            // inserting user_uid on values
            values.pseudo = user.pseudo
            // send datas to Firebase DB
            try {
                await firebase.addFFLog(values, roster)
            } catch (error) {
                console.log(error.message)
            }
            // enable sending btn again
            formik.setSubmitting(false)
            formik.resetForm()
            onFormSubmit()
        }
    })

    const handleCalendarClick = () => setShowCalendar(!showCalendar)


    const fetchPatch = (date) => {
        formik.setFieldValue("dateRaid", date)
        const parsedDate = date.getTime() / 1000
        const patchObj = patchList
            .filter(patch => patch.releaseDate < parsedDate)
            .reduce((prevPatch, currentPatch) => {
                return (prevPatch.releaseDate > currentPatch.releaseDate ? prevPatch : currentPatch);
            })
        formik.setFieldValue("patch", patchObj.name)
    }

    const importFFLogsData = async () => {
        try {
            const lastUserLog = await (await Axios.get(`https://www.fflogs.com/v1/reports/user/${user.fflogsAccount.name}?api_key=${user.fflogsAccount.apiKey}`)).data.shift()
            formik.setFieldValue("title", lastUserLog.title)
            formik.setFieldValue("fflogurl", `https://www.fflogs.com/reports/${lastUserLog.id}`)
            formik.setFieldValue("dateRaid", new Date(lastUserLog.start))
            //formik.setValues()

        } catch (error) {
            showInfoMessage("error", error.message)
        }
    }

    return (
        <>
            {user.fflogsAccount.name &&
                <Button style={{ marginBottom: "1rem", width: "100%" }} variant="info" onClick={importFFLogsData} ><i className="fas fa-external-link-alt"></i>Importer le dernier log depuis FF-Logs</Button>
            }
            <Form onSubmit={formik.handleSubmit}>
                <Form.Group controlId="title">
                    <Form.Control
                        type="text"
                        placeholder="titre du run"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        isInvalid={formik.touched.fflogurl && formik.errors.title}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.title}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="fflogurl">
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="https://www.fflogs.com/reports/...."
                            value={formik.values.fflogurl}
                            onChange={formik.handleChange}
                            isInvalid={formik.touched.fflogurl && formik.errors.fflogurl}
                            required
                        />
                        {formik.validateForm && <InputGroup.Append>
                            <InputGroup.Text>
                                <a href={formik.values.fflogurl} target="_blank" rel="noopener noreferrer">
                                    <i className="fas fa-external-link-alt"></i>vérifier
                                </a>
                            </InputGroup.Text>
                        </InputGroup.Append>}
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">{formik.errors.fflogurl}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="patch">
                    <Form.Control
                        as="select"
                        value={formik.values.patch}
                        onChange={formik.handleChange}
                        custom>
                        {patchList.map(patch => <option key={patch.releaseDate}>{patch.name}</option>)}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="dateRaid">
                    <Button style={{ marginBottom: "1rem", width: "100%" }} variant="outline-primary" onClick={handleCalendarClick} ><i className="far fa-calendar"></i>Raid du : {formik.values.dateRaid.toLocaleDateString()}</Button>
                    {showCalendar && <Calendar
                        value={formik.values.dateRaid}
                        minDate={FFXIV_ARR_RELEASE_DATE}
                        maxDate={new Date()}
                        onChange={(value) => fetchPatch(value)}
                    />}
                </Form.Group>

                <SendBtn isDisabled={formik.isSubmitting} label="Envoyer le lien" />
                {/* <pre>{JSON.stringify(formik.values, null, 2)}</pre> */}
            </Form>
        </>
    )
}

export default FFLogAdd

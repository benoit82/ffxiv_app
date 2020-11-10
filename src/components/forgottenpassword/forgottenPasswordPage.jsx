import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { FirebaseContext } from "../firebase";
import Form from "react-bootstrap/Form";
import { SendBtn } from "../formElements";
import { useFormik } from "formik";
import * as Yup from "yup";
import { EMAIL_ERR_MSG, FIELD_REQUIRED } from "../../utils/consts";
import { showInfoMessage } from "../../utils/globalFunctions";

const ForgottenPasswordPage = () => {
    const firebase = useContext(FirebaseContext);
    const history = useHistory();
    const formik = useFormik({
        initialValues: { email: "" },
        validationSchema: Yup.object().shape({
            email: Yup.string().email(EMAIL_ERR_MSG).required(FIELD_REQUIRED),
        }),
        onSubmit: (values) => submitPasswordReset(values.email)
    });

    const submitPasswordReset = (email) => {
        firebase
            .passwordReset(email)
            .then(() => {
                showInfoMessage("info", `Un email vous a été envoyé pour réinitialiser le mot de passe lié au
                compte${email}. 
                Redirection vers la page de login dans quelques instants...`)
                setTimeout(() => {
                    history.push("/login");
                }, 4000);
            })
            .catch((error) => showInfoMessage("error", error.message)
            );
    };

    return (
        <div className="custom__container form__container auto_margin">
            <h2>Réinitialiser votre mot de passe</h2>
            <Form onSubmit={formik.handleSubmit}>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        isValid={formik.touched.email && !formik.errors.email}
                        isInvalid={!!formik.errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formik.errors.email}
                    </Form.Control.Feedback>
                </Form.Group>
                <SendBtn />
            </Form>
        </div>
    );
};

export default ForgottenPasswordPage;

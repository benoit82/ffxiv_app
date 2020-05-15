import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { FirebaseContext } from "../firebase";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import { SendBtn } from "../formElements";
import { Formik } from "formik";
import * as Yup from "yup";

const ForgottenPasswordPage = () => {
  const [status, setStatus] = useState(null);
  const firebase = useContext(FirebaseContext);
  const history = useHistory();
  const ForgottenPasswordSchema = Yup.object().shape({
    email: Yup.string().email("email invalide.").required("champs obligatoire"),
  });

  const submitPasswordReset = (email) => {
    firebase
      .passwordReset(email)
      .then(() => {
        setStatus(
          <Alert variant="info">
            Un email vous a été envoyé pour réinitialiser le mot de passe lié au
            compte <strong>{email}</strong>
            <br />
            Redirection vers la page de login dans quelques instants...
          </Alert>
        );
        setTimeout(() => {
          history.push("/login");
        }, 4000);
      })
      .catch((error) =>
        setStatus(
          <Alert variant="danger">
            Une erreur est survenu lors de la requête envoyé pour réinitialiser
            le mot de passe lié au compte <strong>{email}</strong> :<br />
            <strong>{error.message}</strong>
          </Alert>
        )
      );
  };

  return (
    <Container>
      <h2>Réinitialiser votre mot de passe</h2>
      {status}
      <Formik
        validationSchema={ForgottenPasswordSchema}
        onSubmit={(values) => submitPasswordReset(values.email)}
        initialValues={{
          email: "",
        }}
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={values.email}
                onChange={handleChange}
                isValid={touched.email && !errors.email}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <SendBtn />
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default ForgottenPasswordPage;

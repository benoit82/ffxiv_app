import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import { Formik } from "formik";
import * as Yup from "yup";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { SendBtn } from "../components/formElements";

const RosterForm = () => {
  const [rosters, setRosters] = useState([]);
  const [infoMsg, setInfoMsg] = useState(null);

  const createRoster = (values) => {
    const { name } = values;
    //enregistrement DB
    setRosters([...rosters, name]);
  };

  const RosterSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "le nom doit comporter 3 lettres")
      .max(15, "le nom doit comporter un maximum de 15 lettres")
      .required("champs obligatoire"),
  });

  const onSubmit = (values, { resetForm }) => {
    createRoster(values);
    resetForm({});
  };

  return (
    <>
      <Container>
        <Row>
          <h2>Liste des rosters existants</h2>
        </Row>
        <Row>
          {rosters.length > 0 ? (
            <ul>
              {rosters.map((roster, index) => (
                <li key={index}>{roster}</li>
              ))}
            </ul>
          ) : (
            <p>aucun roster créer</p>
          )}
        </Row>
      </Container>
      <Container>
        <h2>Créer un roster</h2>
        {infoMsg}
        <Formik
          validationSchema={RosterSchema}
          onSubmit={onSubmit}
          initialValues={{
            name: "",
          }}
        >
          {({ handleSubmit, handleChange, values, touched, errors }) => (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <Form.Group controlId="name">
                    <Form.Control
                      type="text"
                      placeholder="nom du roster"
                      value={values.name}
                      onChange={handleChange}
                      isValid={touched.name && !errors.name}
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <SendBtn />
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Container>
    </>
  );
};

export default RosterForm;

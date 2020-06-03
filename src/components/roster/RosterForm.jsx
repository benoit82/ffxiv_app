import React, { useState, useEffect, useContext } from "react";
import Container from "react-bootstrap/Container";
import { Formik } from "formik";
import * as Yup from "yup";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { SendBtn } from "../formElements";
import { FirebaseContext } from "../firebase";
import Msg from "../../utils/msg";
import CharacterDetailInline from "../character/characterDetailInline";
import DeleteBtn from "../formElements/DeleteBtn";
import { Link } from "react-router-dom";
import RostersTable from "./rostersTable";

const RosterForm = () => {
    const firebase = useContext(FirebaseContext);
    const [characters, setCharacters] = useState([]);
    const [rosters, setRosters] = useState([]);
    const [infoMsg, setInfoMsg] = useState(null);

    useEffect(() => {
        // get characters list
        firebase.getAllCharacters(setCharacters);
        // load the roster
        const unsubcribe = firebase.db
            .collection("rosters")
            .orderBy("name", "asc")
            .onSnapshot(
                (snapshot) => {
                    const rostersList = snapshot.docs.map((roster, index) => ({
                        ...roster.data(),
                        _id: snapshot.docs[index].id,
                    }));
                    setRosters(rostersList);
                },
                (error) => {
                    throw setInfoMsg(<Msg error={error.message} />);
                }
            );

        return () => unsubcribe();
    }, [firebase]);


    const createRoster = (values) => {
        const { name, refRaidLeader } = values;
        //enregistrement DB
        try {
            firebase.addRoster({ name, refRaidLeader });
        } catch (error) {
            setInfoMsg(<Msg error={{ message: error.message }} />);
        }
    };

    const handleDelete = (roster) => {
        const confirmation = window.confirm(
            `êtes-vous certain de supprimer ${roster.name} de votre compte ?`
        );
        if (confirmation) {
            firebase.deleteRoster(roster._id);
        }
    };

    const RosterSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, "le nom doit comporter 3 lettres")
            .max(15, "le nom doit comporter un maximum de 15 lettres")
            .required("champs obligatoire"),
        refRaidLeader: Yup.string().required("champs obligatoire"),
    });

    const optCharacters = characters.map((character) => (
        <option key={character.id} value={character._id}>
            {character.name}
        </option>
    ));

    const onSubmit = (values, { resetForm }) => {
        createRoster(values)
        resetForm({})
    };

    const findCharacter = (_id) => {
        return characters.some((chr) => chr._id === _id)
            ? characters.find((chr) => chr._id === _id)
            : {};
    };


    return (
        <>
            <Container>
                <Row>
                    <h2>Liste des rosters existants</h2>
                </Row>
                <Row>
                    {rosters.length > 0 ? (
                        <RostersTable rosters={rosters} findCharacter={findCharacter} handleDelete={findCharacter} />
                    ) : (
                            <p>aucun roster créer</p>
                        )}
                </Row>
            </Container>
            <Container>
                <h2>Créer un roster</h2>
                {infoMsg}
                <Formik
                    enableReinitialize
                    validationSchema={RosterSchema}
                    onSubmit={onSubmit}
                    initialValues={{
                        name: ""
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
                                    <Form.Group controlId="refRaidLeader">
                                        <Form.Control
                                            as="select"
                                            custom
                                            onChange={handleChange}
                                            value={values.refRaidLeader}
                                        >
                                            <option value="">Choisir le perso raid leader</option>
                                            {optCharacters}
                                        </Form.Control>
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

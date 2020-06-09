import React, { useState, useEffect, useContext } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { FirebaseContext } from "../firebase";
import Msg from "../../utils/msg";
import { Roster } from "../../models";
import { RostersTable, RosterCreate, RosterEdit, RosterView } from "../roster";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const RosterAdmin = () => {
    const firebase = useContext(FirebaseContext);
    const [rosters, setRosters] = useState([]);
    const [infoMsg, setInfoMsg] = useState(null);

    useEffect(() => {
        // load the roster
        const unsubcribe = firebase.db
            .collection("rosters")
            .orderBy("name", "asc")
            .onSnapshot(
                (snapshot) => {
                    const rostersList = snapshot.docs.map(rosterRefDoc => (new Roster(rosterRefDoc)));
                    setRosters(rostersList);
                },
                (error) => {
                    throw setInfoMsg(<Msg error={error.message} />);
                }
            );

        return () => unsubcribe();
    }, [firebase]);

    return (
        <Container>
            {infoMsg}
            <Row>
                <h2>Liste des rosters existants</h2>
            </Row>
            <Row>
                {rosters.length > 0 ? (
                    <RostersTable rosters={rosters} />
                ) : (
                        <p>aucun roster créer</p>
                    )}
            </Row>
            <Row>
                <Router basename="/">
                    <Switch>
                        <Route exact path="/" component={RosterCreate} />
                        <Route path="/edit/:roster_id" component={RosterEdit} />
                        <Route path="/view/:roster_id" component={RosterView} />
                    </Switch>
                </Router>
            </Row>
        </Container>
    );
};

export default RosterAdmin;

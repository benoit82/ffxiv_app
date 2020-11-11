import React, { useState, useEffect, useContext } from "react";
import { FirebaseContext } from "../firebase";
import { Roster } from "../../models";
import { RostersTable, RosterEdit, RosterView } from "../roster";
import { Switch, Route } from "react-router-dom";
import { showInfoMessage } from "../../utils/globalFunctions";


const RosterAdmin = () => {
    const firebase = useContext(FirebaseContext);
    const [rosters, setRosters] = useState([]);

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
                    showInfoMessage("error", "Erreur de chargement des rosters")
                }
            );

        return () => unsubcribe();
    }, [firebase]);

    return (
        <section className="custom__container" style={{ display: "flex", flexDirection: "column" }}>
            <h2>Liste des rosters existants</h2>
            {rosters.length > 0 ? (
                <RostersTable rosters={rosters} />
            ) : (
                    <p>aucun roster créer</p>
                )}
            <Switch>
                <Route path="/admin/roster/edit/:roster_id" component={RosterEdit} />
                <Route path="/admin/roster/view/:roster_id/:jPriority" component={RosterView} />
            </Switch>
        </section>
    );
};

export default RosterAdmin;

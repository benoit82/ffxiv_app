import React, { useState, useEffect, useContext } from "react";
import { FirebaseContext } from "../firebase";
import { Roster } from "../../models";
import { RostersTable, RosterEdit, RosterView } from "../roster";
import { Switch, Route } from "react-router-dom";
import { showInfoMessage } from "../../utils/globalFunctions";
import { useFormik } from "formik";
import { Form } from "react-bootstrap";
import Select from "react-select";
import { ALL } from "../../utils/consts";


const RosterAdmin = () => {
    const firebase = useContext(FirebaseContext);
    const [rosters, setRosters] = useState([]);
    const formik = useFormik({
        initialValues: { roster: { value: ALL, label: ALL } }
    })

    const handleSelectChange = (selected) => {
        const value = (selected) ? { label: selected.label, value: selected.value } : formik.initialValues.roster
        formik.setFieldValue("roster", value)

    }
    const filteredRosters = (roster) => {
        let copyRosters = rosters;
        if (roster.value !== ALL) copyRosters = copyRosters.filter(r => r.value === roster.value)
        return copyRosters;
    }
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
    }, [firebase.db]);

    return (
        <section style={{ display: "flex", flexDirection: "column", minWidth: "800px" }}>
            <h2>Liste des rosters existants</h2>
            {rosters.length > 0 ? (
                <>
                    <Form>
                        <Form.Group controlId="roster">
                            <Select
                                name="roster"
                                options={[{ label: ALL, value: ALL }, ...rosters]}
                                isClearable={true}
                                value={formik.values.roster}
                                clearValue={() => formik.setFieldValue("roster", formik.initialValues.roster)}
                                onChange={handleSelectChange}
                            />
                        </Form.Group>
                    </Form>
                    <RostersTable rosters={filteredRosters(formik.values.roster)} />
                </>
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

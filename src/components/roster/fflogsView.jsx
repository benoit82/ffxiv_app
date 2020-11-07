import React, { useContext, useEffect, useState } from 'react'
import { FirebaseContext } from '../firebase'
import Row from "react-bootstrap/Row"
import FFlog from "../../models/fflog"
import FFLogAdd from './fflogAdd'
import { Button, ListGroup } from 'react-bootstrap'
import { DeleteBtn } from '../formElements'
import Swal from 'sweetalert2'
import { UserApi } from '../../utils/appContext'

function FFlogsView({ roster }) {
    const firebase = useContext(FirebaseContext)
    const { user } = useContext(UserApi)
    const [showFormAddLog, setShowFormAddLog] = useState(false)
    const [ffLogs, setFfLogs] = useState([])
    // user is admin, or the raidLead, or the author of the log => can edit
    const isRaidLeadOrAdmin = user.isAdmin || user.characters.some(chr => chr.id === roster.refRaidLeader.id)
    const showError = (err) => {
        Swal.fire({
            title: "Oups, erreur !",
            icon: "error",
            text: `une erreur est survenu... 
        ${err.message}`
        })
    }

    useEffect(() => {
        const fflogRef = firebase.db.collection("rosters/" + roster._id + "/fflogs");
        let unsubscribe;
        if (fflogRef) {
            unsubscribe = fflogRef.onSnapshot((snapshot) => {
                let tabLogs = []
                snapshot.forEach(function (childSnapshot) {
                    tabLogs = [...tabLogs, new FFlog(childSnapshot)]
                });
                setFfLogs(tabLogs)
            })
        }
        return () => {
            unsubscribe()
        }
    }, [roster._id, firebase.db])

    const handleShowFormAddLog = () => setShowFormAddLog(!showFormAddLog)
    const handleDeleteLog = async (log) => {
        Swal.fire({
            title: 'Attention !',
            text: `Es-tu certain de vouloir supprimer le log du ${log.showDate()} envoyé par ${log.pseudo} ?`,
            icon: 'warning',
            confirmButtonText: 'Oui',
            cancelButtonText: "Annuler l'action",
            showCancelButton: true
        })
            .then(async result => {
                if (result.isConfirmed) {
                    try {
                        await firebase.deleteLog(log, roster)
                    } catch (error) {
                        showError(error)
                    }

                }
            })
            .catch(err => showError(err))
    }


    return (
        <>
            <Button onClick={handleShowFormAddLog} style={{ marginBottom: "1rem", width: "100%" }} variant={showFormAddLog ? "outline-primary" : "primary"}>Ajouter un rapport de raid</Button>
            {showFormAddLog && <FFLogAdd roster={roster} onFormSubmit={handleShowFormAddLog} />}
            <Row className="d-flex flex-column flex-start">
                <h3>FF-Logs</h3>
                <ListGroup style={{ marginRight: "10px" }}>
                    {ffLogs.sort((log1, log2) => log2.dateRaid - log1.dateRaid).map((log) => {
                        return (
                            <ListGroup.Item key={log._id}>
                                <span style={{ display: "flex", justifyContent: "space-between", lineHeight: "24px" }}>
                                    <span><a href={log.fflogurl} target="_blank" rel="noopener noreferrer">{log.title} {log.showDate()}</a><br />par {log.pseudo}</span>
                                    {(isRaidLeadOrAdmin || user.uid === log.uid) && <DeleteBtn label=" " handleClick={() => handleDeleteLog(log)} />}
                                </span>
                            </ListGroup.Item>
                        )
                    })}
                </ListGroup>
            </Row>

        </>
    )
}

export default FFlogsView
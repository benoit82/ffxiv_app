import React, { useContext, useEffect, useState } from 'react'
import { FirebaseContext } from '../firebase'
import Row from "react-bootstrap/Row"
import FFlog from "../../models/fflog"

function FFlogsView({ roster }) {
    const firebase = useContext(FirebaseContext)
    const [ffLogs, setFfLogs] = useState([])

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

    return (
        <Row className="d-flex flex-column">
            {ffLogs.map((log, index) => {
                return <p key={index}><a href={log.url} target="_blank" rel="noopener noreferrer">{log.date}</a></p>
            })}
        </Row>
    )
}

export default FFlogsView
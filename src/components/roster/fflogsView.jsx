import React, { useContext, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { FirebaseContext } from '../firebase'
import Row from "react-bootstrap/Row"
import FFlog from "../../models/fflog"
import FFLogAdd from './fflogAdd'
import { Button, ListGroup } from 'react-bootstrap'
import { DeleteBtn } from '../formElements'
import Swal from 'sweetalert2'
import { UserApi } from '../../utils/appContext'
import { showInfoMessage } from '../../utils/globalFunctions'

import "./fflogsView.scss"

function FFlogsView({ roster }) {
    const firebase = useContext(FirebaseContext)
    const { user } = useContext(UserApi)
    const [showFormAddLog, setShowFormAddLog] = useState(false)
    const [ffLogs, setFfLogs] = useState([])
    const [offset, setOffset] = useState(0)
    const MAX_LOGS_PER_PAGE = 5
    // user is admin, or the raidLead, or the author of the log => can edit
    const isRaidLeadOrAdmin = user.isAdmin || user.characters.some(chr => chr.id === roster.refRaidLeader.id)

    useEffect(() => {
        const fflogRef = firebase.db.collection("rosters/" + roster._id + "/fflogs");
        let unsubscribe;
        if (fflogRef) {
            unsubscribe = fflogRef
                .orderBy("dateRaid", "desc")
                .onSnapshot((snapshot) => {
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


    const handlePaginationChange = ({ selected }) => {
        setOffset(Math.ceil(selected * MAX_LOGS_PER_PAGE))
    }

    const handleShowFormAddLog = () => {
        setShowFormAddLog(!showFormAddLog)
    }

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
                if (result.isConfirmed) await firebase.deleteLog(log, roster)
            })
            .catch(error => showInfoMessage("error", error.message))
    }


    return (
        <>
            <Row className="d-flex flex-column flex-start mr-3">
                <Button onClick={handleShowFormAddLog} style={{ marginBottom: "1rem", width: "100%" }} variant={showFormAddLog ? "outline-primary" : "primary"}>Ajouter un rapport de raid</Button>
                {showFormAddLog && <FFLogAdd roster={roster} onFormSubmit={handleShowFormAddLog} />}
                {ffLogs.length > 0 &&
                    <>
                        <h3>FF-Logs</h3>
                        <ReactPaginate
                            containerClassName={'pagination'}
                            pageCount={Math.ceil(ffLogs.length / MAX_LOGS_PER_PAGE)}
                            initialPage={0}
                            pageRangeDisplayed={2}
                            marginPagesDisplayed={2}
                            breakLabel={'...'}
                            pageLinkClassName={'linkpage'}
                            onPageChange={handlePaginationChange}
                            pageSize={MAX_LOGS_PER_PAGE}
                            activeClassName={'active'}
                            previousLabel={'<'}
                            previousClassName={'prevBtn'}
                            nextLabel={'>'}
                            nextClassName={'nextBtn'}
                            disabledClassName={'disBtn'}
                        />
                        <ListGroup>
                            {ffLogs
                                .slice(offset, offset + MAX_LOGS_PER_PAGE)
                                .map((log) => {
                                    return (
                                        <ListGroup.Item key={log._id}>
                                            <div style={{ display: "flex", justifyContent: "space-between", lineHeight: "24px" }}>
                                                <span>
                                                    <a href={log.fflogurl} target="_blank" rel="noopener noreferrer">{log.title} {log.showDate()}</a><br />
                                                    <span style={{ fontStyle: "italic" }} > envoyé par {log.pseudo}</span>
                                                </span>
                                                {(isRaidLeadOrAdmin || user.uid === log.uid) && <DeleteBtn label=" " handleClick={() => handleDeleteLog(log)} />}
                                            </div>
                                        </ListGroup.Item>
                                    )
                                })}
                        </ListGroup>
                    </>
                }
            </Row>

        </>
    )
}

export default FFlogsView
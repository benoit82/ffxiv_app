import React, { useCallback, useContext, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { FirebaseContext } from '../firebase'
import Row from "react-bootstrap/Row"
import FFlog from "../../models/fflog"
import FFLogAdd from './fflogAdd'
import { Alert, Button, Form, ListGroup } from 'react-bootstrap'
import { DeleteBtn } from '../formElements'
import Swal from 'sweetalert2'
import { UserApi } from '../../utils/appContext'
import { showInfoMessage } from '../../utils/globalFunctions'
import pluralize from 'pluralize'

import "./fflogsView.scss"
import Axios from 'axios'
import { useFormik } from 'formik'
import { ALL } from '../../utils/consts'

function FFlogsView({ roster }) {
    const firebase = useContext(FirebaseContext)
    const { user } = useContext(UserApi)
    const [showFormAddLog, setShowFormAddLog] = useState(false)
    const [showFilter, setShowFilter] = useState(false)
    const [patchList, setPatchList] = useState([])
    const [ffLogs, setFfLogs] = useState([])
    const [offset, setOffset] = useState(0)
    const formik = useFormik({
        initialValues: {
            patch: ALL
        }
    })
    const MAX_LOGS_PER_PAGE = 5
    // user is admin, or the raidLead, or the author of the log => can edit
    const isRaidLeadOrAdmin = user.isAdmin || user.characters.some(chr => chr.id === roster.refRaidLeader.id)

    const getPatchList = useCallback(async () => {
        try {
            const response = await Axios.get("https://xivapi.com/patchlist");
            if (response.status === 200) {
                let tabPatchList = []
                Array.from(response.data).forEach(patch => {
                    tabPatchList = [...tabPatchList, { extension: patch.ExName, name: patch.Name, releaseDate: patch.ReleaseDate }]
                })
                setPatchList(tabPatchList.sort((p1, p2) => p2.name > p1.name ? 1 : -1))
            } else {
                showInfoMessage("warning", "Le serveur API n'a pas pu fournir la liste des patchs.")
            }
        } catch (error) {
            showInfoMessage("error", error.message)
        }
    },
        [])

    const handlePaginationChange = ({ selected }) => {
        setOffset(Math.ceil(selected * MAX_LOGS_PER_PAGE))
    }

    const handleShowFormAddLog = () => {
        setShowFormAddLog(!showFormAddLog)
    }
    const handleShowFilter = () => {
        setShowFilter(!showFilter)
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

    const getFilteredLogs = () => {
        let arrFilteredLogs = ffLogs
        if (formik.values.patch !== ALL) {
            arrFilteredLogs = ffLogs.filter(log => log.patch === formik.values.patch)
        }
        return arrFilteredLogs;
    }

    useEffect(() => {
        const fflogRef = firebase.db.collection("rosters/" + roster._id + "/fflogs");
        getPatchList()
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
    }, [roster._id, firebase.db, getPatchList])




    return (
        <>
            <Row className="d-flex flex-column flex-start mr-3">
                <Button onClick={handleShowFormAddLog} style={{ marginBottom: "1rem", width: "100%" }} variant={showFormAddLog ? "outline-primary" : "primary"}>Ajouter un rapport de raid</Button>
                {showFormAddLog && <FFLogAdd roster={roster} patchList={patchList} onFormSubmit={handleShowFormAddLog} />}
                {ffLogs.length > 0 &&
                    <>
                        <h3>FF-Logs</h3>
                        <Button onClick={handleShowFilter} style={{ marginBottom: "1rem", width: "100%" }} variant={showFormAddLog ? "outline-primary" : "primary"}>Filtrer la liste par patch</Button>
                        {showFilter &&
                            <>
                                <Form.Group controlId="patch">
                                    <Form.Control
                                        as="select"
                                        value={formik.values.patch}
                                        onChange={formik.handleChange}
                                        custom>
                                        <option value={ALL}>{`${ALL} patchs confondus`}</option>
                                        {patchList.map(patch => {
                                            if (ffLogs.some(log => log.patch === patch.name)) return <option key={patch.releaseDate}>{patch.name}</option>
                                        })}
                                    </Form.Control>
                                </Form.Group>
                                {/* <pre>{JSON.stringify(formik.values, null, 2)}</pre> */}
                            </>}
                        {getFilteredLogs().length > 0 ? <ReactPaginate
                            containerClassName={'pagination'}
                            pageCount={Math.ceil(getFilteredLogs().length / MAX_LOGS_PER_PAGE)}
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
                        /> : <Alert variant="warning">Aucun log pour le patch {formik.values.patch}</Alert>}
                        <ListGroup>
                            {getFilteredLogs()
                                .slice(offset, offset + MAX_LOGS_PER_PAGE)
                                .map((log) => {
                                    return (
                                        <ListGroup.Item key={log._id} className="list__log">
                                            <div style={{ display: "flex", justifyContent: "space-between", lineHeight: "24px" }}>
                                                <span>
                                                    <a href={log.fflogurl} target="_blank" rel="noopener noreferrer">{log.title} {log.showDate()}</a><br />
                                                    {log.patch && <span style={{ fontStyle: "italic" }} > Patch : {log.patch},</span>}<span style={{ fontStyle: "italic" }} > envoyé par {log.pseudo}</span>
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
import React, { useCallback, useContext, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { FirebaseContext } from '../firebase'
import FFlog from "../../models/fflog"
import FFLogAdd from './fflogAdd'
import { Alert, Button, Form, ListGroup } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { UserApi } from '../../utils/appContext'
import { showInfoMessage } from '../../utils/globalFunctions'
import CopyToClipboard from "react-copy-to-clipboard"

import "./fflogsView.scss"
import Axios from 'axios'
import { useFormik } from 'formik'
import { ALL } from '../../utils/consts'
import { PropTypes } from 'prop-types'
import { Roster } from '../../models'


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
            patch: ALL,
            author: ALL
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

    const getAuthorsList = () => {
        let authors = []
        ffLogs.forEach(log => authors = [...authors, log.pseudo])
        return Array.from(new Set(authors))
    }

    const getFilteredLogs = () => {
        let arrFilteredLogs = ffLogs
        if (formik.values.patch !== ALL) {
            arrFilteredLogs = arrFilteredLogs.filter(log => log.patch === formik.values.patch)
        }
        if (formik.values.author !== ALL) {
            arrFilteredLogs = arrFilteredLogs.filter(log => log.pseudo === formik.values.author)
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
            <div className="d-flex flex-column flex-start p-1">
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
                                        <option value={ALL}>{`${ALL} : patchs confondus`}</option>
                                        {/* eslint-disable-next-line */}
                                        {patchList.map(patch => {
                                            if (ffLogs.some(log => log.patch === patch.name)) return <option key={patch.releaseDate}>{patch.name}</option>
                                        })}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="author">
                                    <Form.Control
                                        as="select"
                                        value={formik.values.author}
                                        onChange={formik.handleChange}
                                        custom>
                                        <option value={ALL}>{`${ALL} : auteurs confondus`}</option>
                                        {getAuthorsList().map(author => {
                                            return <option key={author}>{author}</option>
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
                        /> : <Alert variant="warning">Aucun log trouvé avec les paramètres de filtre</Alert>}
                        <ListGroup>
                            {getFilteredLogs()
                                .slice(offset, offset + MAX_LOGS_PER_PAGE)
                                .map((log) => {
                                    return (
                                        <ListGroup.Item key={log._id} className="list__log">
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span>
                                                    <a href={log.fflogurl} target="_blank" rel="noopener noreferrer">{log.title} {log.showDate()}</a><br />
                                                    {log.patch && <span style={{ fontStyle: "italic" }} > Patch : {log.patch},</span>}<span style={{ fontStyle: "italic" }} > envoyé par {log.pseudo}</span>
                                                </span>
                                                <div className="d-flex flex-row">
                                                    <CopyToClipboard text={log.fflogurl}>
                                                        <Button><i className="fas fa-clipboard"></i></Button>
                                                    </CopyToClipboard>
                                                    {(isRaidLeadOrAdmin || user.uid === log.uid) && <Button variant="danger" style={{ marginLeft: "2px" }} onClick={() => handleDeleteLog(log)}><i className="fas fa-trash"></i></Button>}
                                                </div>

                                            </div>
                                        </ListGroup.Item>
                                    )
                                })}
                        </ListGroup>
                    </>
                }
            </div>

        </>
    )
}

FFlogsView.propTypes = {
    roster: PropTypes.instanceOf(Roster).isRequired
}

export default FFlogsView
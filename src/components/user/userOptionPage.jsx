import React, { useState, useContext, useEffect } from 'react'
import Row from 'react-bootstrap/Row'
import ListGroup from 'react-bootstrap/ListGroup'
import EmailUpdateForm from './emailUpdateForm'
import { FirebaseContext } from '../firebase'
import { UserApi } from '../../utils/appContext'
import { User, Roster } from '../../models'
import { Link } from 'react-router-dom'
import { DeleteBtn } from '../formElements'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Button from 'react-bootstrap/Button'
import Swal from 'sweetalert2'
import { Col, Container } from 'react-bootstrap'
import { showInfoMessage } from '../../utils/globalFunctions'
import FFlogAccountForm from './FFlogAccountForm'
import TwitchAccountForm from './twitchAccountForm'

import './userOptionPage.scss'

/**
 * @route /param
 */
const UserOptionPage = () => {
  const [userFromDb, setUserFromDb] = useState({})
  const [rosterTmp, setRosterTmp] = useState(null)
  const firebase = useContext(FirebaseContext)
  const { user } = useContext(UserApi)
  const [form, setForm] = useState(<EmailUpdateForm />)

  const handleRosterTmpDelete = async () => {
    const confirmation = await Swal.fire({
      icon: 'warning',
      html: `êtes-vous certain de supprimer le roster temporaire: ${rosterTmp.name} ?`,
      cancelButtonText: 'annuler',
      showCancelButton: true,
      confirmButtonText: 'oui, certain'
    })
    if (confirmation.value) {
      firebase.deleteRoster(rosterTmp._id)
      setRosterTmp(null)
      const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true
      })
      Toast.fire({
        icon: 'success',
        title: `${rosterTmp.name} supprimé !`
      })
    }
  }

  useEffect(() => {
    const unsubcribe = firebase.db
      .collection('users')
      .doc(user.uid)
      .onSnapshot(
        (snapshot) => {
          const usr = new User(snapshot)
          setUserFromDb(usr)
          if (usr.refRosterRaidLeader) {
            const getRoster = async () => {
              const rost = new Roster(await usr.refRosterRaidLeader.get())
              setRosterTmp(rost)
            }
            getRoster()
          }
        },
        (error) => {
          showInfoMessage('error', error.message)
        }
      )
    return () => unsubcribe()
  }, [])

  return (
    <Container fluid>
      <Row>
        <Col lg={3} className='mr-3 ml-3'>
          <div className='custom__container'>
            <h2>Mes infos</h2>
            <ListGroup>
              <ListGroup.Item>
                <div className='info_user_listgrp_item'>
                  <span>Pseudo : {userFromDb.pseudo}</span>
                </div>
              </ListGroup.Item>
              <ListGroup.Item>
                <div className='info_user_listgrp_item'>
                  <span>Email : {userFromDb.email}</span>
                  <Button variant='info' onClick={() => setForm(<EmailUpdateForm />)}>modifier</Button>
                </div>
              </ListGroup.Item>
              <ListGroup.Item>
                <div className='info_user_listgrp_item'>
                  <span>Compte FF-Logs : {userFromDb.fflogsAccount && userFromDb.fflogsAccount.name}</span>
                  <Button variant='info' onClick={() => setForm(<FFlogAccountForm />)}>modifier</Button>
                </div>
              </ListGroup.Item>
              <ListGroup.Item>
                <div className='info_user_listgrp_item'>
                  <span>Compte Twitch : {userFromDb.twitchAccount}</span>
                  <Button variant='info' onClick={() => setForm(<TwitchAccountForm />)}>modifier</Button>
                </div>
              </ListGroup.Item>
            </ListGroup>
            {rosterTmp &&
              <>
                <hr />
                <div className='d-flex flex-column'>
                  <CopyToClipboard text={`${window.location.origin}/roster/view/${rosterTmp._id}/1`}>
                    <Button><i className='fas fa-clipboard' />Mon roster temporaire : {rosterTmp.name}</Button>
                  </CopyToClipboard>
                  <div className='d-flex mt-1'>
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                      <Link to={`/roster/view/${rosterTmp._id}/1`} className='btn btn-primary'><i className='fas fa-eye' />Voir</Link>
                      <Link to={`/roster/edit/${rosterTmp._id}`} className='btn btn-success'><i className='fas fa-edit' />Editer</Link>
                      <DeleteBtn handleClick={handleRosterTmpDelete} />
                    </div>
                  </div>
                </div>
              </>}
          </div>
        </Col>
        <Col className='mr-3 ml-3'>
          <div className='custom__container form__container'>
            {form}
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default UserOptionPage

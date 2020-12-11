import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { FirebaseContext } from '../firebase'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import ListGroup from 'react-bootstrap/ListGroup'
import { SendBtn, EditBtn, ResetBtn } from '../formElements'
import { UserApi } from '../../utils/appContext'
import Select from 'react-select'
import { selectJobsGroup } from '../../utils/jobs'
import { styleRole } from '../../utils/styleRole'
import Col from 'react-bootstrap/Col'
import JobListDisplay from '../../utils/jobListDisplay'
import BISForm from './bisForm'
import { showInfoMessage, toast } from '../../utils/globalFunctions'
import { Character } from '../../models'
import Swal from 'sweetalert2'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

import './editCharacter.scss'

/**
 * @route /chr/:chrID
 */
const EditCharacter = () => {
  dayjs.extend(isSameOrAfter)
  const garlandtools = require('garlandtools-api')
  const history = useHistory()
  const { chrID } = useParams()
  const firebase = useContext(FirebaseContext)
  const User = useContext(UserApi)
  const [character, setCharacter] = useState({})
  const [lastFFXIVversion, setLastFFXIVversion] = useState(null)

  // select state
  const [job1, setJob1] = useState('')
  const [job2, setJob2] = useState('')
  const [job3, setJob3] = useState('')
  const [jobForBis, setJobForBis] = useState('')

  const { user } = User

  const formatGroupLabel = data => (
    <div style={{ height: '20px' }}>
      <span>{data.label}</span>
    </div>
  )

  const getFFXIVLastPatchVersion = useCallback(async () => {
    const garlandData = await garlandtools.data()
    setLastFFXIVversion(garlandData.patch.current)
  }, [garlandtools])

  const infoResetBis = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true
    })
    Toast.fire({
      icon: 'success',
      title: 'reset de tous vos B.I.S. effecté !'
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    let jobFields = {}
    if (job1.value) jobFields = { ...jobFields, mainJob: job1.value }
    if (job2.value && job2.value !== job1.value && job2.value !== job3.value) jobFields = { ...jobFields, secondJob: job2.value }
    if (job3.value && job3.value !== job1.value && job2.value !== job3.value) jobFields = { ...jobFields, thirdJob: job3.value }
    firebase.updateCharacter(character._id, jobFields)
  }

  const editBis = (job) => {
    setJobForBis(null)
    setTimeout(() => {
      setJobForBis(<BISForm job={job} character={character} updateBis={updateBis} resetBis={resetBis} />)
    }, 200)
  }

  const updateBis = (val, job) => {
    const bis = { ...character.bis, [job]: val }
    if (!character.BISPatch && lastFFXIVversion) {
      firebase.updateCharacter(character._id, { BISPatch: lastFFXIVversion })
    }
    firebase.updateCharacter(character._id, { bis })
    toast('info', `BIS pour ${job} mis à jour !`)
  }

  const resetBis = async (job) => {
    const confirmation = await Swal.fire({
      icon: 'warning',
      html: `Êtes-vous certain de remettre à zero la liste B.I.S. pour le job ${job} ?`,
      cancelButtonText: 'annuler',
      showCancelButton: true,
      confirmButtonText: 'oui, certain'
    })
    if (confirmation.value) {
      const bis = { ...character.bis, [job]: null }
      firebase.updateCharacter(character._id, { bis })
      setJobForBis(null)
      const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true
      })
      Toast.fire({
        icon: 'success',
        title: 'reset du B.I.S. effecté !'
      })
    }
  }
  const resetAllBis = async () => {
    const confirmation = await Swal.fire({
      icon: 'warning',
      html: 'Êtes-vous certain de remettre à zero tous les B.I.S. ?',
      cancelButtonText: 'annuler',
      showCancelButton: true,
      confirmButtonText: 'oui, certain'
    })
    if (confirmation.value) {
      firebase.updateCharacter(character._id, { bis: {} })
      setJobForBis(null)
      infoResetBis()
    }
  }

  const { avatar, name, id, mainJob, secondJob, thirdJob } = character

  const styleR = styleRole(character.mainJob)

  useEffect(() => {
    // getting FFXIV last version and set it in lastFFXIVversion
    getFFXIVLastPatchVersion()
  }, [getFFXIVLastPatchVersion])

  useEffect(() => {
    // load the characters
    const unsubcribe = firebase.db
      .collection('characters')
      .doc(chrID)
      .onSnapshot(
        (snapshot) => {
          const chr = new Character(snapshot)
          if (chr.userRef !== null) {
            chr.userRef.get().then(
              response => {
                const userData = response.data()
                if (userData.uid !== user.uid) history.goBack()
              }
            )
          } else {
            history.goBack()
          }
          setCharacter(chr)
          if (chr.mainJob) setJob1(chr.mainJob)
          if (chr.secondJob) setJob2(chr.secondJob)
          if (chr.thirdJob) setJob3(chr.thirdJob)
          if (chr.BISPatch &&
            lastFFXIVversion &&
            chr.BISPatch !== lastFFXIVversion
          ) {
            Swal.fire({
              icon: 'question',
              title: `Nouveau patch : ${lastFFXIVversion}`,
              html: `FFXIV a déployé un nouveau patch ! <br/>
                            Les BIS de ce personnage datent du patch ${chr.BISPatch}.<br/>
                            Veux-tu reset les BIS de ce personnage (dernière mise à jour ) ? <br/>
                            En répondant ou annulant l'action, tes BIS actuels seront marqué par le nouveau patch.`,
              cancelButtonText: 'Non',
              showCancelButton: true
            }).then(response => {
              if (response.isConfirmed) {
                firebase.updateCharacter(chr._id, { bis: {} })
                infoResetBis()
              }
              // in all cases, we set the new patch version on character
              firebase.updateCharacter(chr._id, { BISPatch: lastFFXIVversion })
            }).catch(error => showInfoMessage('error', error.message))
          }
        },
        (error) => {
          showInfoMessage('error', error.message)
        }
      )

    return () => unsubcribe()
    // eslint-disable-next-line
  }, [chrID, firebase.db, history, user.uid, lastFFXIVversion])

  return (
    <Container fluid>
      <Row className='d-flex justify-content-center'>
        {/* cadre avatar */}
        <div
          className='d-flex rounded p-2 w-auto align-items-center'
          style={styleR}
        >
          <img src={avatar} alt={`avatar de ${name}`} className='rounded rounded-circle' />
          <div className='d-flex flex-column'>
            <h3 className='title_name'>{name}</h3>
            <div className='ml-5'>
              <span className='badge badge-pill'>{mainJob && <JobListDisplay job={mainJob} />}</span>
              <span className='badge badge-pill'>{secondJob && <JobListDisplay job={secondJob} />}</span>
              <span className='badge badge-pill'>{thirdJob && <JobListDisplay job={thirdJob} />}</span>
            </div>
            <a
              className='ml-auto'
              href={`https://fr.finalfantasyxiv.com/lodestone/character/${id}`}
              target='_blanck'
            ><span className='badge badge-pill badge-info'>lodestone</span>
            </a>
          </div>
        </div>
      </Row>
      <Row className='mt-3'>
        {/* cadre menu job */}
        <Col xs={2} className='mr-2 mb-2'>
          <div className='custom__container jobSelect__container'>
            <h3>Jobs</h3>
            <form onSubmit={handleSubmit}>
              <ListGroup variant='flush'>
                <ListGroup.Item className='selectJob'>
                  <Select
                    className='basic-single'
                    placeholder={character.mainJob || 'Main job'}
                    onChange={setJob1}
                    value={job1}
                    isSearchable
                    name='job1'
                    options={selectJobsGroup}
                    formatGroupLabel={formatGroupLabel}
                  />
                  {character.mainJob && <EditBtn label={`édit. BIS ${character.mainJob}`} handleClick={() => editBis(character.mainJob)} />}
                </ListGroup.Item>
                {job1 &&
                  <ListGroup.Item className='selectJob'>
                    <Select
                      className='basic-single'
                      placeholder={character.secondJob || '2eme Job'}
                      onChange={setJob2}
                      value={job2}
                      isSearchable
                      name='job2'
                      options={selectJobsGroup}
                      formatGroupLabel={formatGroupLabel}
                    />
                    {character.secondJob && <EditBtn label={`édit. BIS ${character.secondJob}`} handleClick={() => editBis(character.secondJob)} />}
                  </ListGroup.Item>}
                {job2 &&
                  <ListGroup.Item className='selectJob'>
                    <Select
                      className='basic-single'
                      placeholder={character.thirdJob || '3eme Job'}
                      onChange={setJob3}
                      value={job3}
                      isSearchable
                      name='job3'
                      options={selectJobsGroup}
                      formatGroupLabel={formatGroupLabel}
                    />
                    {character.thirdJob && <EditBtn label={`édit. BIS ${character.thirdJob}`} handleClick={() => editBis(character.thirdJob)} />}
                  </ListGroup.Item>}
                <ListGroup.Item className='selectJob'>
                  <div className='d-flex flex-column'>
                    <SendBtn label='mettre à jour les jobs' />
                    <ResetBtn label='reset tous les BIS' handleReset={resetAllBis} />
                  </div>
                </ListGroup.Item>
              </ListGroup>

            </form>
          </div>
        </Col>
        <Col>
          {jobForBis}
        </Col>
      </Row>
    </Container>
  )
}

export default EditCharacter

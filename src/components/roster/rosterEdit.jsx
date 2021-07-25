import React, { useEffect, useState, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { FirebaseContext } from '../firebase'
import Form from 'react-bootstrap/Form'
import Select from 'react-select'
import * as pluralize from 'pluralize'
import { UpdateBtn, DeleteBtn } from '../formElements'
import { Character, Roster } from '../../models'
import { MAX_MEMBERS_ALLOWED } from '../../utils/consts'
import { UserApi, XIVApi } from '../../utils/appContext'
import { showInfoMessage, toast } from '../../utils/globalFunctions'

const RosterEdit = () => {
  const { rosterID } = useParams()
  const history = useHistory()
  const firebase = useContext(FirebaseContext)
  const User = useContext(UserApi)
  const { user } = User
  const xiv = useContext(XIVApi)

  const [roster, setRoster] = useState(new Roster(null))
  const [characters, setCharacters] = useState([])
  const [raidLeader, setRaidLeader] = useState(null)
  const [serverList, setServerList] = useState([])

  // --- select
  const [name, setName] = useState('')
  const [fflog, setFflog] = useState({ guildName: '', guildServer: '', region: 'EU' })
  const [rosterMembers, setRosterMembers] = useState([])

  useEffect(() => {
    if (roster.fflog) setFflog(roster.fflog)
  }, [roster])

  useEffect(() => {
    // retrieve server list and add "all server" option for global search
    (async () => {
      const datacenters = await xiv.data.datacenters()
      setServerList([...Object.entries(datacenters)])
      if (fflog.guildServer === '') {
        setFflog({ ...fflog, guildServer: [...Object.values(datacenters)][0][0] })
      }
    })()
    // eslint-disable-next-line
  }, [fflog])

  useEffect(() => {
    if (roster.tmp) {
      firebase.getAllCharacters(setCharacters, { filter: null })
    } else {
      firebase.getAllCharacters(setCharacters, { filter: 'rosterRaidLeader' })
    }
    // eslint-disable-next-line
  }, [roster, firebase])

  useEffect(() => {
    // load the roster
    const unsubcribe = firebase.db
      .collection('rosters')
      .doc(rosterID)
      .onSnapshot(
        (snapshot) => {
          const rosterData = snapshot.data()
          setRoster(new Roster(snapshot))
          if (rosterData.refRaidLeader) {
            rosterData.refRaidLeader.get().then(resp => {
              // check if  the user is allowed to access to roster edit
              if (user.isAdmin || user.uid === resp.data().userRef.id) {
                setRaidLeader(new Character(resp))
              } else {
                history.push('/')
              }
            })
          }
          if (rosterData.rosterMembers) {
            let rosterMembers = []
            rosterData.rosterMembers.forEach(chrRef => {
              chrRef.get().then(data => {
                rosterMembers = [...rosterMembers, new Character(data)]
              })
            })
            setRosterMembers(rosterMembers)
          }
        },
        (error) => {
          showInfoMessage('error', error.message)
        }
      )

    return () => unsubcribe()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (roster.rosterMembers) {
      let initChrs = []
      const convertRefMemberToChr = async () => {
        for (const memberRef of roster.rosterMembers) {
          const res = (await memberRef.get())
          if (res) {
            initChrs = [...initChrs, new Character(res)]
          }
        }
        setRosterMembers(initChrs)
      }
      convertRefMemberToChr()
    }
    setName(roster.name)
  }, [roster])

  const servers = serverList.map((datacenter, index) => {
    return (
      <optgroup key={index} label={datacenter[0].toUpperCase()}>
        {datacenter[1].map(server => {
          return <option key={server}>{server}</option>
        })}
      </optgroup>
    )
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    // record characters to refs
    let rosterMembersTmp = []
    rosterMembers.forEach(member => {
      rosterMembersTmp = [...rosterMembersTmp, firebase.db.doc(`characters/${member._id}`)]
    })
    if (name) {
      const rosterPayload = {
        _id: roster._id,
        name,
        rosterMembers: rosterMembersTmp,
        tmp: roster.tmp,
        fflog: (fflog.guildName !== '') ? fflog : null
      }
      try {
        firebase.updateRoster(rosterPayload)
        toast('success', 'Roster mis à jour !')
      } catch (error) {
        toast('danger', error.message)
      }
    } else {
      toast('danger', 'champs invalides ou non completé')
    }
  }

  const handleChangeMembers = (tabValues) => {
    if (tabValues !== null) {
      const limitMembers = roster.tmp ? MAX_MEMBERS_ALLOWED + 1 : MAX_MEMBERS_ALLOWED
      if (tabValues.length <= limitMembers) {
        tabValues.sort((a, b) => a.label > b.label ? 1 : -1)
        setRosterMembers(tabValues)
      }
    } else {
      setRosterMembers([])
    }
  }

  const deleteRoster = () => {
    firebase.deleteRoster(rosterID)
    history.replace('/chr')
  }

  return (
    <>
      <Form className='custom__container form__container auto_margin' onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Nom du roster</Form.Label>
          <br />
          <Form.Control
            custom
            type='text'
            id='name'
            placeholder='Nom du roster'
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </Form.Group>

        <h2>Configuration groupe FFlog</h2>

        <Form.Group>
          <Form.Label>Nom guilde</Form.Label>
          <Form.Control
            custom
            type='text'
            id='fflog.guildName'
            placeholder='Nom guilde sur fflogs.com'
            onChange={(e) => setFflog({ ...fflog, guildName: e.target.value })}
            value={fflog.guildName}
          />
        </Form.Group>

        <Form.Group controlId='fflog.guildServer'>
          <Form.Label>Serveur :</Form.Label>
          <Form.Control
            as='select'
            custom
            onChange={(e) => setFflog({ ...fflog, guildServer: e.target.value })}
            value={fflog.guildServer}
          >
            {servers}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId='fflog.region'>
          <Form.Label>Région</Form.Label>
          <Form.Control
            custom
            as='select'
            onChange={(e) => setFflog({ ...fflog, region: e.target.value })}
            value={fflog.region}
          >
            {['US', 'EU', 'KR', 'TW', 'CN'].map(region => <option key={region}>{region}</option>)}
          </Form.Control>
        </Form.Group>

        {raidLeader && <h2>Raid Leader : {raidLeader.name}</h2>}

        <Form.Group>
          <Form.Label>{rosterMembers && `${pluralize('membre', rosterMembers.length, true)} / ${roster.tmp ? MAX_MEMBERS_ALLOWED + 1 : MAX_MEMBERS_ALLOWED}`}</Form.Label>
          <Select
            id='refRosterMembers'
            isMulti
            placeholder='Selection des membres...'
            options={characters}
            onChange={(optionSelected) => handleChangeMembers(optionSelected)}
            value={rosterMembers}
          />
        </Form.Group>
        <div className='d-flex'>
          <UpdateBtn />
          <DeleteBtn
            label='supprimer le roster'
            handleClick={deleteRoster}
          />
        </div>

      </Form>
    </>
  )
}

export default RosterEdit

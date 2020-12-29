import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { FirebaseContext } from '../firebase'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import { Roster, Character } from '../../models'
import { getCategory, resetGearSet } from '../../utils/jobs'
import CharacterTRRoster from '../character/characterTRRoster'
import RosterCheckUpgradeGear from './rosterCheckUpgradeGear'

import Loading from '../loading'
import Button from 'react-bootstrap/Button'
import FFlogsView from './fflogsView'

import './rosterView.scss'
import { showInfoMessage } from '../../utils/globalFunctions'
/**
 * @route /param /roster/view/:rosterId/:jPriority
 */
const RosterView = () => {
  const { rosterID, jPriority } = useParams()
  const history = useHistory()
  const jobPriority = parseInt(jPriority)
  const firebase = useContext(FirebaseContext)
  const [roster, setRoster] = useState(null)
  const [members, setMembers] = useState([])
  const [raidLeader, setRaidLeader] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastFFXIVversion, setLastFFXIVversion] = useState(null)
  const garlandtools = require('garlandtools-api')

  const getFFXIVLastPatchVersion = useCallback(async () => {
    const garlandData = await garlandtools.data()
    setLastFFXIVversion(garlandData.patch.current)
  }, [garlandtools])

  useEffect(() => {
    // getting FFXIV last version and set it in lastFFXIVversion
    getFFXIVLastPatchVersion()
  }, [getFFXIVLastPatchVersion])

  useEffect(() => {
    const unsubscribe = firebase.db
      .collection('rosters')
      .doc(rosterID)
      .onSnapshot(snap => {
        setRoster(new Roster(snap))
        const getRosterData = async (rosterData) => {
          // manage RL
          const membersBuilder = []
          if (rosterData.refRaidLeader) {
            const chrRL = new Character(await rosterData.refRaidLeader.get())
            setRaidLeader(chrRL)
            membersBuilder.push(chrRL)
          }
          if (rosterData && rosterData.rosterMembers.length > 0) {
            rosterData.rosterMembers.forEach(refMember => {
              const getMemberData = async () => {
                const chr = new Character(await refMember.get())
                membersBuilder.push(chr)
                const nbMembers = rosterData.refRaidLeader ? rosterData.rosterMembers.length + 1 : rosterData.rosterMembers.length
                if (membersBuilder.length === nbMembers) {
                  membersBuilder.sort((chrA, chrB) => chrA.name < chrB.name ? 1 : -1).sort((chrA, chrB) => {
                    const catA = getCategory(chrA.mainJob)
                    const catB = getCategory(chrB.mainJob)
                    return catA > catB ? 1 : -1
                  })
                  setMembers(membersBuilder)
                }
              }
              // manage each members
              getMemberData()
            })
          }
          setMembers(membersBuilder)
        }
        try {
          getRosterData(snap.data())
        } catch (error) {
          showInfoMessage('error', 'problème de chargement du roster')
        } finally {
          setLoading(false)
        }
      }
      )
    return () => {
      unsubscribe()
    }
  }, [firebase.db, rosterID])

  return (
    loading
      ? <Loading />
      : <>
        <Col lg={3}>
          <div className='custom__container' style={{ position: 'sticky' }}>
            <FFlogsView roster={roster} />
          </div>
        </Col>
        <Col lg={8}>
          <div className='custom__container mt-1'>
            <h3>Table des loots</h3>
            <Table bordered hover variant='dark' className='table_roster'>
              <thead>
                <tr>
                  <th>{roster && roster.name}</th>
                  {Object.values(resetGearSet)
                    .sort((gearElementA, gearElementB) => gearElementA.order > gearElementB.order ? 1 : -1)
                    .map(gearElement => {
                      const thGearName = gearElement.name.replace('Loot', 'L.').replace('Memo', 'M.').replace('Ras de cou', 'Cou')
                      return <th key={gearElement.order}>{thGearName}</th>
                    })}
                </tr>
              </thead>
              <tbody>
                {
                  members.length > 0 &&
                  members.map(member => {
                    let job = null
                    switch (jobPriority) {
                      case 1:
                        job = member.mainJob
                        break
                      case 2:
                        job = member.secondJob
                        break
                      case 3:
                        job = member.thirdJob
                        break
                      default:
                        job = member.mainJob
                        break
                    }
                    return <CharacterTRRoster key={member._id} character={member} job={job} rl={raidLeader} currentPatch={lastFFXIVversion} />
                  })
                }
              </tbody>
            </Table>
            {members.length > 1 && <RosterCheckUpgradeGear members={members} priorityJob={jobPriority} />}
            {members.length > 0 &&
              <>
                <Button variant='danger' className='mr-1' onClick={() => history.push(`/roster/view/${rosterID}/1`)}>Main Job</Button>
                <Button variant='dark' className='mr-1' onClick={() => history.push(`/roster/view/${rosterID}/2`)}>Job 2</Button>
                <Button variant='warning' className='mr-1' onClick={() => history.push(`/roster/view/${rosterID}/3`)}>Job 3</Button>
              </>}
          </div>
        </Col>
        </>
  )
}

export default RosterView

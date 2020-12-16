import React, { useState, useEffect, useContext, useMemo } from 'react'
import { UserApi, XIVApi } from './utils/appContext'
import { FirebaseContext } from './components/firebase'
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './routes'
import Container from 'react-bootstrap/Container'
import { Menu } from './components'
import XIVAPI from 'xivapi-js'
import checkStorage from './utils/checkStorage'
import { showInfoMessage, bgImages } from './utils/globalFunctions'
import _ from 'lodash'

import './App.scss'

function App () {
  const firebase = useContext(FirebaseContext)
  const [user, setUser] = useState({
    uid: '',
    isLoggedIn: false
  })
  const bgImage = useMemo(() => bgImages[_.random(bgImages.length - 1)], [])
  const xivapi = new XIVAPI({
    // eslint-disable-next-line no-undef
    private_key: process.env.REACT_APP_XIV_API_KEY,
    language: 'fr',
    snake_case: true
  })

  useEffect(() => {
    try {
      checkStorage(firebase, setUser)
    } catch (error) {
      showInfoMessage('error', error.message)
    }
  }, [firebase])

  return (
    <Container
      fluid
      className='App'
      style={{
        background: `url(${bgImage}) center fixed`
      }}
    >
      <Router>
        <UserApi.Provider value={{ user, setUser }}>
          <XIVApi.Provider value={xivapi}>
            <Menu user={user} />
            <Container fluid>
              <div
                className='row p-3 d-flex'
                style={{
                  minHeight: '90vh',
                  position: 'relative'
                }}
              >
                <Routes />
              </div>
            </Container>
          </XIVApi.Provider>
        </UserApi.Provider>
      </Router>
    </Container>
  )
}

export default App

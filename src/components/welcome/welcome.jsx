import React, { useContext, useEffect, useState } from 'react'
import { UserApi } from '../../utils/appContext'
import { Link } from 'react-router-dom'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { FirebaseContext } from '../firebase'
import { GetNewTwitchToken, toast } from '../../utils/globalFunctions'
import { User } from '../../models'
import Axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import fr from 'dayjs/locale/fr'
import { TWITCH } from '../../utils/consts'
import useTwitchApi from '../../customHooks/useTwitchApi'
import classNames from 'classnames'

import './welcome.scss'

const Welcome = () => {
  dayjs.extend(relativeTime).locale(fr)
  const { user } = useContext(UserApi)
  const firebase = useContext(FirebaseContext)
  const [streamers, setStreamers] = useState([])
  const twitchHeaders = useTwitchApi()

  const getLives = async (streamersList) => {
    let urlBuilder = `${TWITCH.apiURI}streams?`
    streamersList.forEach(streamer => { urlBuilder += `user_login=${streamer}&` })
    urlBuilder = urlBuilder.substr(0, urlBuilder.length - 1)
    if (twitchHeaders && urlBuilder.length > (`${TWITCH.apiURI}streams?user_login=`.length + 1)) {
      try {
        const response = await Axios.get(urlBuilder, { headers: twitchHeaders })
        response.data.data.forEach(async (streamer, index) => {
          streamer.game = await getGame(streamer.game_id)
          if (index === response.data.data.length - 1) setStreamers(Array.from(response.data.data))
        })
      } catch (error) {
        toast('error', 'problème de communication avec twitch.')
        GetNewTwitchToken().then((response) => {
          if (response.data.access_token) {
            firebase.setTwitchToken({ twitchApiKey: response.data.access_token })
          }
        })
      }
    }
  }

  const getGame = async (gameID) => {
    let game = {}
    try {
      const res = await Axios.get(`${TWITCH.apiURI}games?id=${gameID}`, { headers: twitchHeaders })
      game = res.data.data.shift()
    } catch (error) {
      toast('error', 'problème de communication avec twitch.')
    }
    return game
  }

  useEffect(() => {
    const intervalLives = setInterval(() => {
      if (streamers.length > 0) getLives(streamers)
    }, 60 * 1000)
    const unsubcribe = firebase.db
      .collection('users')
      .where('twitchAccount', '!=', '""')
      .orderBy('twitchAccount', 'asc')
      .onSnapshot(
        async (snapshot) => {
          const streamersList = snapshot.docs.map(streamerRefDoc => (new User(streamerRefDoc).twitchAccount))
          getLives(streamersList)
        }
      )

    return () => {
      clearInterval(intervalLives)
      unsubcribe()
    }
    // eslint-disable-next-line
  }, [firebase, twitchHeaders])

  return (
    <>{
      streamers.length > 0 &&
        <div className='custom__container lives__container'>
        <h4>En live sur Twitch</h4>
        <ListGroup>
          {streamers.map(stream => {
            return (
              <ListGroupItem key={stream.id} className='d-flex custom__list'>
                {stream.game &&
                  <div className='gameImgContainer mr-1'>
                    <img src={stream.game.box_art_url.replace('{width}', '75').replace('{height}', '100')} alt='' />
                  </div>}
                <div className={classNames('streamerInfo', 'd-flex', 'flex-column')}>
                  <span><a href={`https://www.twitch.tv/${stream.user_name}`} target='_blank' rel='noopener noreferrer'>{stream.user_name}</a>{stream.game && ` : ${stream.game.name}`}</span>
                  <span className='stream__title'>{stream.title.length < 90 ? stream.title : `${stream.title.substr(0, 87)}...`}</span>
                  <span>commencé {dayjs().to(stream.started_at)}</span>
                </div>
              </ListGroupItem>
            )
          })}
        </ListGroup>
      </div>
    }
      <div className='custom__container form__container auto_margin d-flex flex-column' style={{ alignItems: 'center', justifyContent: 'center' }}>
        <h1>\o Lali-ho {user.isLoggedIn && `${user.pseudo}`} ! o/</h1>
        <p style={{ textAlign: 'center' }}>Bienvenue sur l&apos;application pour gerer les récompenses et les équipements des personnages de FFXIV.</p>
        {
          !user.isLoggedIn && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap' }}>
                <Link to='/login' className='btn btn-primary mr-2'><i className='fas fa-sign-in-alt' />login</Link>
                <Link to='/signup' className='btn btn-success mr-2'><i className='fas fa-user-plus' />s&apos;inscrire</Link>
              </div>

            </>
          )
        }
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap' }}>
          <Link className='btn btn-info mr-2' to='/about'><i className='fas fa-newspaper' />A propos, mentions légales</Link>
          <Link className='btn btn-secondary' to='/log'><i className='fas fa-newspaper' />Info version</Link>
        </div>
        {process.env.NODE_ENV === 'development' && <p>Application en mode  : {process.env.NODE_ENV}</p>}
      </div>

    </>
  )
}

export default Welcome

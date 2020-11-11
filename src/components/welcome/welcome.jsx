import React, { useContext, useEffect, useState } from 'react'
import { UserApi } from '../../utils/appContext'
import { Link } from 'react-router-dom'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { FirebaseContext } from '../firebase'
import { showInfoMessage, toast } from '../../utils/globalFunctions'
import { User } from '../../models'
import Axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import fr from 'dayjs/locale/fr'
import { TWITCH_API_BASE_URI, TWITCH_AXIOS_CONFIG } from '../../utils/consts'


const Welcome = () => {
    dayjs.extend(relativeTime).locale(fr)
    const { user } = useContext(UserApi)
    const firebase = useContext(FirebaseContext)
    const [streamers, setStreamers] = useState([])

    const getLives = async (streamersList) => {
        let urlBuilder = `${TWITCH_API_BASE_URI}streams?`
        streamersList.forEach(streamer => urlBuilder += `user_login=${streamer}&`)
        urlBuilder = urlBuilder.substr(0, urlBuilder.length - 1)
        try {
            const response = await Axios.get(urlBuilder, TWITCH_AXIOS_CONFIG)
            response.data.data.forEach(async streamer => {
                const res = await Axios.get(`${TWITCH_API_BASE_URI}games?id=${streamer.game_id}`, TWITCH_AXIOS_CONFIG)
                streamer.game = res.data.data[0]
            })
            setStreamers(Array.from(response.data.data));
        } catch (error) {
            toast("error", "problème de communication avec twitch.")
        }
    }

    useEffect(() => {
        const intervalLives = setInterval(() => {
            if (streamers.length > 0) getLives(streamers)
        }, 5 * 60 * 1000);
        const unsubcribe = firebase.db
            .collection("users")
            .where("twitchAccount", "!=", '""')
            .orderBy("twitchAccount", "asc")
            .onSnapshot(
                async (snapshot) => {
                    const streamersList = snapshot.docs.map(streamerRefDoc => (new User(streamerRefDoc).twitchAccount));
                    getLives(streamersList)
                },
                (error) => {
                    showInfoMessage("error", `problème de chargement de la liste des streamers. ${error.message}`)
                }
            );

        return () => {
            clearInterval(intervalLives)
            unsubcribe()
        };
    },
        //eslint-disable-next-line
        [firebase.db])

    return (
        <>{
            streamers.length > 0 &&
            <div className="custom__container" style={{ position: "absolute", top: "0", left: "0", borderRadius: "0px" }}>
                <h4>En live sur Twitch</h4>
                <ListGroup>
                    {streamers.map(stream => {
                        return (<ListGroupItem key={stream.id} className="d-flex flex-column">
                            <span><a href={`https://www.twitch.tv/${stream.user_name}`} target="_blank" rel="noopener noreferrer">{stream.user_name}</a> : {stream.game && stream.game.name}</span>
                            <span>commencé {dayjs().to(stream.started_at)}</span>
                        </ListGroupItem>)
                    })}
                </ListGroup>
            </div>
        }
            <div className="custom__container form__container auto_margin d-flex flex-column" style={{ alignItems: "center", justifyContent: "center" }} >
                <h1>\o Lali-ho {user.isLoggedIn && `${user.pseudo}`} ! o/</h1>
                <p>Bienvenue sur l&apos;application pour gerer les récompenses de raid.</p>
                {
                    !user.isLoggedIn && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                            <Link to="/login" className="btn btn-primary fas fa-sign-in-alt mr-2"> login</Link>
                            <Link to="/signup" className="btn btn-success fas fa-user-plus"> s&apos;inscrire</Link>
                        </div>
                    )
                }
                {process.env.NODE_ENV === "development" && <p>Application en mode  : {process.env.NODE_ENV}</p>}
            </div>

        </>
    )
}

export default Welcome

import React, { useContext, useEffect, useState } from 'react'
import { UserApi } from '../../utils/appContext'
import { Link } from 'react-router-dom'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { FirebaseContext } from '../firebase'
import { showInfoMessage } from '../../utils/globalFunctions'
import { User } from '../../models'
import Axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import fr from 'dayjs/locale/fr'


const Welcome = () => {
    const { user } = useContext(UserApi)
    const firebase = useContext(FirebaseContext)
    const [streamers, setStreamers] = useState([])
    dayjs.extend(relativeTime).locale(fr)

    useEffect(() => {
        const unsubcribe = firebase.db
            .collection("users")
            .where("twitchAccount", "!=", '""')
            .orderBy("twitchAccount", "asc")
            .onSnapshot(
                async (snapshot) => {
                    const streamersList = snapshot.docs.map(streamerRefDoc => (new User(streamerRefDoc).twitchAccount));
                    // params builder
                    let urlBuilder = "https://api.twitch.tv/helix/streams?"
                    streamersList.forEach(streamer => urlBuilder += `user_login=${streamer}&`)
                    urlBuilder = urlBuilder.substr(0, urlBuilder.length - 1)
                    try {
                        const response = await Axios.get(urlBuilder, {
                            headers: {
                                "Authorization": `Bearer ${process.env.REACT_APP_TWITCH_API_KEY}`,
                                "Client-ID": process.env.REACT_APP_TWITCH_API_CLIENT_ID
                            },
                        })
                        setStreamers(Array.from(response.data.data));
                    } catch (error) {
                        showInfoMessage("error", error.message)
                    }
                },
                (error) => {
                    showInfoMessage("error", error.message)
                }
            );

        return () => unsubcribe();
    }, [firebase.db])

    return (
        <>{
            streamers.length > 0 &&
            <div className="custom__container" style={{ position: "absolute", top: "0", left: "0" }}>
                <h4>En live sur Twitch</h4>
                <ListGroup>
                    {streamers.map(stream => {
                        return (<ListGroupItem key={stream.id} className="d-flex flex-column">
                            <span><a href={`https://www.twitch.tv/${stream.user_name}`} target="_blank" rel="noopener noreferrer">{stream.user_name}</a></span>
                            <span>{stream.title}</span>
                            <span>commencé {dayjs().to(stream.started_at)}</span>
                        </ListGroupItem>)
                    })}
                </ListGroup>
            </div>
        }
            <div className="custom__container" style={{ width: "30rem", margin: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} >
                <h1>\o Lali-ho {user.isLoggedIn && `${user.pseudo}`} ! o/</h1>
                <p>Bienvenue sur l'application pour gerer les récompenses de raid dans un premier temps.</p>
                <p>D'autres options viendront compléter l'application dans les futurs versions !</p>
                {
                    !user.isLoggedIn && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                            <Link to="/login" className="btn btn-primary fas fa-sign-in-alt mr-2"> login</Link>
                            <Link to="/signup" className="btn btn-success fas fa-user-plus"> s'inscrire</Link>
                        </div>
                    )
                }
                {process.env.NODE_ENV === "development" && <p>Application en mode  : {process.env.NODE_ENV}</p>}
            </div>

        </>
    )
}

export default Welcome

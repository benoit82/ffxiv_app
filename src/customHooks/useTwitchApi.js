import { useContext, useEffect, useState } from 'react'
import { FirebaseContext } from '../components/firebase'

const useTwitchApi = () => {
  const firebase = useContext(FirebaseContext)
  const [twitchHeaders, setTwitchHeaders] = useState(null)

  useEffect(() => {
    firebase.getAppConfig().then(data => {
      if (data.twitchApiKey) {
        setTwitchHeaders({
          'Client-ID': process.env.REACT_APP_TWITCH_API_CLIENT_ID,
          Authorization: `Bearer ${data.twitchApiKey}`
        })
      }
    })
  }, [firebase])

  return twitchHeaders
}

export default useTwitchApi

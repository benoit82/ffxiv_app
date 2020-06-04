import React from 'react'
import { useParams } from 'react-router-dom'


const UserOptionPage = () => {
    const { user_id } = useParams()
    return (<div>
        UserOptionPage : {user_id}
    </div>)
}

export default UserOptionPage

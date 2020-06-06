import React, { useContext } from 'react'
import { Link, useHistory } from "react-router-dom";
import FirebaseContext from '../firebase/context';
import { UserApi } from '../../utils/appContext';

const Disconnect = () => {

    const firebase = useContext(FirebaseContext);
    const User = useContext(UserApi);
    const history = useHistory();

    const handleClick = async (e) => {
        e.preventDefault();
        await firebase.signOutUser();
        sessionStorage.removeItem("user");
        localStorage.removeItem("user");
        User.setUser({ ...User.user, isLoggedIn: false, isAdmin: false, refRosterRaidLeader: null });
        history.push("/");
    }

    return (
        <Link className="nav-link" onClick={handleClick} to="/"><i className="fas fa-sign-out-alt"></i>Logout</Link>
    )
}

export default Disconnect

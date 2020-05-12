import React, { useContext } from 'react'
import { Link, useHistory } from "react-router-dom";
import FirebaseContext from '../firebase/context';
import { AuthApi } from '../../AppContext';

const Disconnect = () => {

    const firebase = useContext(FirebaseContext);
    const Auth = useContext(AuthApi);
    const history = useHistory();

    const handleClick = async (e) => {
        e.preventDefault();
        await firebase.signOutUser();
        Auth.setAuth(false);
        history.push("/");
    }

    return (
        <Link className="nav-link" onClick={handleClick} to="/"><i className="fas fa-sign-out-alt"></i>Logout</Link>
    )
}

export default Disconnect

import React, { useContext } from 'react'
import { Link, useHistory } from "react-router-dom";
import FirebaseContext from '../firebase/context';

const Disconnect = () => {

    const firebase = useContext(FirebaseContext);
    const history = useHistory();

    const handleClick = async (e) => {
        e.preventDefault();
        await firebase.signOutUser();
        history.push("/");
    }

    return (
        <Link className="nav-link" onClick={handleClick} to="/"><i class="fas fa-sign-out-alt"></i>Logout</Link>
    )
}

export default Disconnect

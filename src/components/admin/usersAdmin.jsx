import React, { useEffect, useContext, useState } from 'react'
import { FirebaseContext } from '../firebase';
import { User } from '../../models';
import Msg from '../../utils/msg';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import UserForm from './userForm';
import { CloseBtn } from '../formElements'

/**
 * @routes /admin/users
 */
const UsersAdmin = () => {

    const firebase = useContext(FirebaseContext)
    const [users, setUsers] = useState([])
    const [msgInfo, setMsgInfo] = useState("")
    const [userForm, setUserForm] = useState("")

    useEffect(() => {
        let unsubcribe = firebase.db
            .collection("users")
            .orderBy("pseudo", "asc")
            .onSnapshot(
                (snapshot) => {
                    const uList = snapshot.docs.map(userRefDoc => new User(userRefDoc));
                    setUsers(uList);
                },
                (error) => {
                    throw setMsgInfo(<Msg error={error.message} />);
                }
            );
        return () => unsubcribe()
    }, [firebase])

    const editUser = (user) => {
        setUserForm(null)
        setTimeout(() => {
            setUserForm(<>
                <Row>
                    <CloseBtn handleClick={() => setUserForm("")} />
                </Row>
                <Row>
                    <UserForm user={user} />
                </Row>
            </>)
        }, 200)
    }

    return (
        <>
            {msgInfo}
            <h2>Liste des utilisateurs</h2>
            <Table responsive striped bordered hover variant="dark" style={{ maxWidth: "930px" }}>
                <thead>
                    <tr>
                        <th>Pseudo</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th>Raid Leader</th>
                        <th>Crafteur</th>
                        <th>Récolteur</th>
                        <th>Date création</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.map(user => {
                        return <tr key={user.uid}>
                            <td><Button variant="info" onClick={() => editUser(user)}>{user.pseudo}</Button></td>
                            <td>{user.email}</td>
                            <td>{user.isAdmin && <i className="fas fa-check"></i>}</td>
                            <td>{user.refRosterRaidLeader && <i className="fas fa-check"></i>}</td>
                            <td>{user.isCrafter && <i className="fas fa-check"></i>}</td>
                            <td>{user.isGatherer && <i className="fas fa-check"></i>}</td>
                            <td>{user.createdAt}</td>
                        </tr>
                    })}
                </tbody>
            </Table>
            { userForm}
        </>
    )
}

export default UsersAdmin

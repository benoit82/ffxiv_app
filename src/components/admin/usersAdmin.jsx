import React, { useEffect, useContext, useState } from 'react'
import { FirebaseContext } from '../firebase';
import { User } from '../../models';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import UserForm from './userForm';
import { CloseBtn } from '../formElements'
import { showInfoMessage } from '../../utils/globalFunctions';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import { ALL } from '../../utils/consts';
import { useFormik } from 'formik';

/**
 * @routes /admin/users
 */
const UsersAdmin = () => {

    const firebase = useContext(FirebaseContext)
    const [users, setUsers] = useState([])
    const [user, setUser] = useState({})
    const [showForm, setShowForm] = useState(false)
    const formik = useFormik({
        initialValues: {
            user: {
                label: ALL,
                value: ALL
            }
        }
    })

    const handleSelectChange = (selected) => {
        const value = (selected) ? { label: selected.label, value: selected.value } : formik.initialValues.user
        formik.setFieldValue("user", value)
    }

    const handleUserSelect = (user) => {
        setShowForm(false)
        setUser(user)
        setTimeout(() => {
            setShowForm(true)
        }, 200)
    }

    const filteredUsers = (user) => {
        let copyUsers = users;
        if (user.value !== ALL) copyUsers = copyUsers.filter(u => u.value === user.value)
        return copyUsers;
    }

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
                    showInfoMessage("error", "erreur dans le chargement des utiliteurs")
                }
            );
        return () => unsubcribe()
    }, [firebase])

    return (
        <>
            <h2>Liste des utilisateurs</h2>
            <Form>
                <Form.Group controlId="user">
                    <Select
                        name="user"
                        options={[formik.initialValues.user, ...users]}
                        isClearable={true}
                        value={formik.values.user}
                        clearValue={() => formik.setFieldValue("roster", formik.initialValues.user)}
                        onChange={handleSelectChange}
                    />
                </Form.Group>
                {/* <pre>{JSON.stringify(formik.values, null, 2)}</pre> */}
            </Form>
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
                    {filteredUsers(formik.values.user).map(user => {
                        return <tr key={user.uid}>
                            <td><Button variant="info" onClick={() => handleUserSelect(user)}>{user.pseudo}</Button></td>
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
            { showForm &&
                <div className="form__container">
                    <CloseBtn handleClick={() => setShowForm(false)} />
                    <UserForm user={user} />
                </div>
            }
        </>
    )
}

export default UsersAdmin

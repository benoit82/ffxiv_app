import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/Button"

const Login = () => {
    return (
        <Form>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control type="password" placeholder="Mot de passe" />
            </Form.Group>
            <Button variant="primary" type="submit">
                Envoyer
            </Button>
        </Form>
    )
}

export default Login

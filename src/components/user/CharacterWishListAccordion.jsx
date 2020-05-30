import React from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import JobListDisplay from '../../utils/JobListDisplay'
import BISForm from '../character/BISForm'

const CharacterWishListAccordion = ({ job, key }) => {
    return (
        <Card>
            <Accordion.Toggle as={Card.Header} variant="link" eventKey={key}>
                <JobListDisplay job={job} />
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={key}>
                <Card.Body><BISForm job={job} /></Card.Body>
            </Accordion.Collapse>
        </Card>
    )
}

export default CharacterWishListAccordion

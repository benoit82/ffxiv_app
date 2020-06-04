import React from 'react'
import { Formik, Field } from 'formik'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { UpdateBtn, ResetBtn } from '../formElements'
import { gearType, resetGearSet } from '../../utils/jobs'

const BISForm = ({ job, character, updateBis, resetBis }) => {

    const initialGearSet = character.bis && character.bis[job] ? character.bis[job] : resetGearSet

    const submitForm = (values) => {
        Object.entries(values).forEach(armorElement => {
            const { type, obtained } = armorElement[1];
            if (armorElement[1].upgrade && type === gearType[0]) {
                armorElement[1].upgrade.needed = !obtained;
            }
        })
        updateBis(values, job)
    }
    return (
        <Formik
            enableReinitialize
            onSubmit={submitForm}
            initialValues={initialGearSet}
        >
            {({ handleSubmit }) => (
                <Container className="bg-light mt-3">
                    <Row>
                        <h3>BIS : {job} - Cochez les équipements obtenu</h3>
                    </Row>
                    <Form onSubmit={handleSubmit}>

                        <div style={{ maxHeight: "400px", overflowY: "scroll", overflowX: "hidden" }} className="d-flex flex-column flex-lg-wrap">
                            {
                                Object.entries(initialGearSet)
                                    .sort((gearPieceA, gearPieceB) => {
                                        return gearPieceA[1].order > gearPieceB[1].order ? 1 : -1
                                    })
                                    .map((armorElement, index) => {
                                        return <Row key={index}><GearPiece armorElement={armorElement} job={job} gearType={gearType} /></Row>
                                    })
                            }
                        </div>
                        <Row><UpdateBtn /> <ResetBtn handleReset={() => resetBis(job, resetGearSet)} /></Row>
                    </Form>
                </Container>
            )
            }
        </Formik >
    )
}

export default BISForm

const GearPiece = ({ armorElement, job, gearType }) => {

    const gearPiece = armorElement[0]
    const { name } = armorElement[1]

    return (
        <Col>
            <Form.Group key={gearPiece}>
                <Form.Label>
                    <Field
                        as={Form.Check}
                        type="checkbox"
                        id={`${job}_${gearPiece}_obtained`}
                        name={`${gearPiece}.obtained`}
                        label={name}
                        inline
                        custom
                    />
                </Form.Label>
                {
                    !gearPiece.match(/(weapon.)|(ring.)/) &&
                    <>
                        <Field
                            as={Form.Check}
                            type="radio"
                            id={`${job}_${gearPiece}_loot`}
                            name={`${gearPiece}.type`}
                            label={gearType[1]}
                            value={gearType[1]}
                            inline
                            custom
                        />

                        <Field
                            as={Form.Check}
                            type="radio"
                            id={`${job}_${gearPiece}_memo`}
                            name={`${gearPiece}.type`}
                            label={gearType[0]}
                            value={gearType[0]}
                            inline
                            custom
                        />
                    </>
                }
            </Form.Group>
        </Col>
    )
}

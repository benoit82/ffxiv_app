import React, { useState } from 'react'
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
            const { type, obtained, lowMemoPurchased, upgrade } = armorElement[1];
            if (type === gearType[0]) {// "Memo"
                if (lowMemoPurchased === null || lowMemoPurchased === undefined) armorElement[1].lowMemoPurchased = false
                // if stuff memo not upgraded has been purchased => need the upgrade, if not, we do not need the upgrade yet as well
                upgrade.needed = lowMemoPurchased
                // if memo upgraded obtained, we do not need anymore the upgrade, and the lowMemo has been purchased
                if (obtained) {
                    upgrade.needed = false
                    armorElement[1].lowMemoPurchased = true
                }
            }
            if (upgrade && type === gearType[1]) {
                upgrade.needed = false
                armorElement[1].lowMemoPurchased = false
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
                <Container className="mt-3">
                    <Row>
                        <h3>BIS : {job} - Cochez les équipements obtenu</h3>
                    </Row>
                    <Form onSubmit={handleSubmit}>
                        <div className="pl-4">
                            <Row><UpdateBtn /> <ResetBtn handleReset={() => resetBis(job)} /></Row>
                            <Row>
                                <div style={{ maxHeight: "400px" }} className="d-flex flex-column flex-lg-wrap">
                                    {
                                        Object.entries(initialGearSet)
                                            .sort((gearPieceA, gearPieceB) => {
                                                return gearPieceA[1].order > gearPieceB[1].order ? 1 : -1
                                            })
                                            .map((armorElement, index) => {
                                                return <Row key={index} className="mr-5"><GearPiece armorElement={armorElement} job={job} gearType={gearType} /></Row>
                                            })
                                    }
                                </div>
                            </Row>
                        </div>
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
    const { name, type, obtained } = armorElement[1]
    const [lootChecked, setLootChecked] = useState(type === gearType[1])
    const [gearObtained, setGearObtained] = useState(obtained)

    const onLootChecked = (e) => {
        setLootChecked(e.target.value === gearType[1])
    }
    const onCheckGearObtained = (e) => {
        setGearObtained(!gearObtained)
    }

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
                        onClick={onCheckGearObtained}
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
                            onClick={onLootChecked}
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
                            onClick={onLootChecked}
                            inline
                            custom
                        />
                    </>
                }
                {!lootChecked &&
                    <Field
                        as={Form.Check}
                        type="checkbox"
                        id={`${job}_${gearPiece}_memo_lowMemoPurchased`}
                        name={`${gearPiece}.lowMemoPurchased`}
                        label={"Memo acheté"}
                        inline
                        custom
                        disabled={gearObtained}
                    />
                }

            </Form.Group>
        </Col>
    )
}

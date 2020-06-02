import React, { useContext } from 'react'
import { Formik, Field } from 'formik'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { UpdateBtn, ResetBtn } from '../formElements'

const BISForm = ({ job, character, updateBis, resetBis }) => {
    /**
     * element choice : Memo (0) or Loot (1)
     */
    const gearType = ["Memo", "Loot"]

    /**
     * GearSet :  // (upgrade : only for "Memo" type) - order is for Form builder
     * {
     *  gearPiece: { order, name, type: "Memo" | "Loot", obtained, upgrade: { type: "Weapon" | "Armor" | "Accessory", needed } } 
     * }
     */
    const resetGearSet = {
        weapon1: { order: 1, name: "Arme Loot", type: gearType[1], obtained: false, },
        weapon2: { order: 2, name: "Arme Memo", type: gearType[0], obtained: false, upgrade: { type: "Weapon", needed: true } },
        head: { order: 3, name: "Tête", type: null, obtained: false, upgrade: { type: "Armor", needed: true } },
        body: { order: 4, name: "Torse", type: null, obtained: false, upgrade: { type: "Armor", needed: true } },
        hands: { order: 5, name: "Mains", type: null, obtained: false, upgrade: { type: "Armor", needed: true } },
        belt: { order: 6, name: "Ceinture", type: null, obtained: false, upgrade: { type: "Accessory", needed: true } },
        leg: { order: 7, name: "Jambière", type: null, obtained: false, upgrade: { type: "Armor", needed: true } },
        boots: { order: 8, name: "Bottes", type: null, obtained: false, upgrade: { type: "Armor", needed: true } },
        earring: { order: 9, name: "Oreilles", type: null, obtained: false, upgrade: { type: "Accessory", needed: true } },
        neck: { order: 10, name: "Ras de cou", type: null, obtained: false, upgrade: { type: "Accessory", needed: true } },
        wrist: { order: 11, name: "Poignet", type: null, obtained: false, upgrade: { type: "Accessory", needed: true } },
        ring1: { order: 12, name: "Bague Memo", type: gearType[0], obtained: false, upgrade: { type: "Accessory", needed: true } },
        ring2: { order: 13, name: "Bague Loot", type: gearType[1], obtained: false, },
    }
    const initialGearSet = character.bis ? character.bis[job] : resetGearSet

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
                <Container className="bg-light">
                    <Form onSubmit={handleSubmit}>
                        <Row><UpdateBtn /> <ResetBtn handleReset={() => resetBis(job, resetGearSet)} /></Row>
                        <div style={{ maxHeight: "400px", overflowY: "scroll", overflowX: "hidden" }} className="d-flex flex-column flex-lg-wrap">
                            {
                                Object.entries(initialGearSet)
                                    .sort((gearPieceA, gearPieceB) => {
                                        return gearPieceA[1].order > gearPieceB[1].order ? 1 : -1
                                    })
                                    .map((armorElement) => {
                                        return <Row><GearPiece armorElement={armorElement} job={job} gearType={gearType} /></Row>
                                    })
                            }
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

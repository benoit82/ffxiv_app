import React from 'react'
import { Formik, Field } from 'formik'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const BISForm = ({ handleSubmit, job }) => {

    /**
     * element choice : Memo or Loot
     */
    const gearType = ["Memo", "Loot"]

    /**
     * GearSet :  // (upgrade : only for "Memo" type)
     * {
     *  weapon1: { type: gearType[1], obtained: false },
     *  weapon2: { type: gearType[0], obtained: false, upgrade: { type: "Weapon", obtained: false } },
     *  head:   { type: "Memo" || "Loot", obtained?, upgrade:  { type: "Armor", obtained?}},
     *  body:   { type: "Memo" || "Loot", obtained?, upgrade:  { type: "Armor", obtained?}},
     *  hands:  { type: "Memo" || "Loot", obtained?, upgrade:  { type: "Armor", obtained?}},
     *  belt:   { type: "Memo" || "Loot", obtained?, upgrade:  { type: "Accessory", obtained?}},
     *  leg:    { type: "Memo" || "Loot", obtained? , upgrade: { type: "Armor", obtained?}},
     *  boots:  { type: "Memo" || "Loot", obtained? , upgrade: { type: "Armor", obtained?}},
     *  earring:{ type: "Memo" || "Loot", obtained? , upgrade: { type: "Accessory", obtained?}},
     *  neck:   { type: "Memo" || "Loot", obtained? , upgrade: { type: "Accessory", obtained?}},
     *  wrist:  { type: "Memo" || "Loot", obtained? , upgrade: { type: "Accessory", obtained?}},
     *  ring1:  { type: "Memo" || "Loot", obtained? , upgrade: { type: "Accessory", obtained?}},
     *  ring2:  { type: "Memo" || "Loot", obtained? , upgrade: { type: "Accessory", obtained?}},   
     * }
     */
    const initialGearSet = {
        weapon1: { name: "Arme Loot", type: gearType[1], obtained: false },
        weapon2: { name: "Arme Memo", type: gearType[0], obtained: false, upgrade: { type: "Weapon", obtained: false } },
        head: { name: "Tête", type: gearType[0], obtained: false, upgrade: { type: "Armor", obtained: false } },
        body: { name: "Torse", type: gearType[0], obtained: false, upgrade: { type: "Armor", obtained: false } },
        hands: { name: "Mains", type: gearType[0], obtained: false, upgrade: { type: "Armor", obtained: false } },
        belt: { name: "Ceinture", type: gearType[0], obtained: false, upgrade: { type: "Accessory", obtained: false } },
        leg: { name: "Jambière", type: gearType[0], obtained: false, upgrade: { type: "Armor", obtained: false } },
        boots: { name: "Bottes", type: gearType[0], obtained: false, upgrade: { type: "Armor", obtained: false } },
        earring: { name: "Oreilles", type: gearType[0], obtained: false, upgrade: { type: "Accessory", obtained: false } },
        neck: { name: "Ras de cou", type: gearType[0], obtained: false, upgrade: { type: "Accessory", obtained: false } },
        wrist: { name: "Poignet", type: gearType[0], obtained: false, upgrade: { type: "Accessory", obtained: false } },
        ring1: { name: "Bague #1", type: gearType[0], obtained: false, upgrade: { type: "Accessory", obtained: false } },
        ring2: { name: "Bague #2", type: gearType[1], obtained: false },
    }

    return (
        <Formik
            onSubmit={(values) => console.log('submit : ', values)}
            initialValues={initialGearSet}
        >
            {({ handleSubmit, values }) => (
                <Form onSubmit={handleSubmit}>
                    <Container>
                        <Row>
                            <Col>
                                {Object.entries(initialGearSet).map((armorElement) => {
                                    let gearPiece = armorElement[0]
                                    let { name } = armorElement[1]
                                    return (
                                        <Row key={gearPiece}>
                                            <Form.Group>
                                                <Col>
                                                    <Form.Label>
                                                        <Field
                                                            as={Form.Check}
                                                            type="checkbox"
                                                            id={`${job}_${gearPiece}_obtained`}
                                                            name={`${gearPiece}.obtained`}
                                                            label={name}
                                                            inline
                                                            custom
                                                        /></Form.Label>
                                                </Col>
                                                <Col>
                                                    <Field
                                                        as={Form.Check}
                                                        type="radio"
                                                        id={`${job}_${gearPiece}_loot`}
                                                        name={`${gearPiece}.type`}
                                                        label={gearType[1]}
                                                        value={gearType[1]}
                                                        inline
                                                        custom />
                                                    <Field
                                                        as={Form.Check}
                                                        type="radio"
                                                        id={`${job}_${gearPiece}_memo`}
                                                        name={`${gearPiece}.type`}
                                                        label={gearType[0]}
                                                        value={gearType[0]}
                                                        inline
                                                        custom
                                                        disabled={gearPiece === "weapon1" || gearPiece === "ring2"} />
                                                    {/* if gearpiece type is "Memo" */
                                                        values[gearPiece].type === gearType[0] &&
                                                        <Field
                                                            as={Form.Check}
                                                            type="checkbox"
                                                            id={`${job}_${gearPiece}_upgrade_obtained`}
                                                            name={`${gearPiece}.upgrade.obtained`}
                                                            label="Améliorant obtenu"
                                                            inline
                                                            custom
                                                        />}
                                                </Col>
                                            </Form.Group>
                                        </Row>)
                                })}
                            </Col>
                            <Col>
                                <button type="submit">tester</button>
                            </Col>
                        </Row>
                    </Container>
                </Form>
            )
            }
        </Formik >
    )
}

export default BISForm

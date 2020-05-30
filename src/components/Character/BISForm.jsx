import React from 'react'
import { Formik, Field, setNestedObjectValues } from 'formik'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { UpdateBtn, ResetBtn } from '../formElements'

const BISForm = ({ handleSubmit, job }) => {

    /**
     * element choice : Memo (0) or Loot (1)
     */
    const gearType = ["Memo", "Loot"]

    /**
     * GearSet :  // (upgrade : only for "Memo" type)
     * {
     *  weapon1: { type: gearType[1], obtained: false },
     *  weapon2: { type: gearType[0], obtained: false, upgrade: { type: "Weapon", needed: false } },
     *  head:   { type: "Memo" || "Loot", obtained?, upgrade:  { type: "Armor", needed?}},
     *  body:   { type: "Memo" || "Loot", obtained?, upgrade:  { type: "Armor", needed?}},
     *  hands:  { type: "Memo" || "Loot", obtained?, upgrade:  { type: "Armor", needed?}},
     *  belt:   { type: "Memo" || "Loot", obtained?, upgrade:  { type: "Accessory", needed?}},
     *  leg:    { type: "Memo" || "Loot", obtained? , upgrade: { type: "Armor", needed?}},
     *  boots:  { type: "Memo" || "Loot", obtained? , upgrade: { type: "Armor", needed?}},
     *  earring:{ type: "Memo" || "Loot", obtained? , upgrade: { type: "Accessory", needed?}},
     *  neck:   { type: "Memo" || "Loot", obtained? , upgrade: { type: "Accessory", needed?}},
     *  wrist:  { type: "Memo" || "Loot", obtained? , upgrade: { type: "Accessory", needed?}},
     *  ring1:  { type: "Memo" || "Loot", obtained? , upgrade: { type: "Accessory", needed?}},
     *  ring2:  { type: "Memo" || "Loot", obtained? , upgrade: { type: "Accessory", needed?}},   
     * }
     */
    const initialGearSet = {
        weapon1: { name: "Arme Loot", type: gearType[1], obtained: false, },
        weapon2: { name: "Arme Memo", type: gearType[0], obtained: false, upgrade: { type: "Weapon", needed: true } },
        head: { name: "Tête", type: gearType[0], obtained: false, upgrade: { type: "Armor", needed: true } },
        body: { name: "Torse", type: gearType[0], obtained: false, upgrade: { type: "Armor", needed: true } },
        hands: { name: "Mains", type: gearType[0], obtained: false, upgrade: { type: "Armor", needed: true } },
        belt: { name: "Ceinture", type: gearType[0], obtained: false, upgrade: { type: "Accessory", needed: true } },
        leg: { name: "Jambière", type: gearType[0], obtained: false, upgrade: { type: "Armor", needed: true } },
        boots: { name: "Bottes", type: gearType[0], obtained: false, upgrade: { type: "Armor", needed: true } },
        earring: { name: "Oreilles", type: gearType[0], obtained: false, upgrade: { type: "Accessory", needed: true } },
        neck: { name: "Ras de cou", type: gearType[0], obtained: false, upgrade: { type: "Accessory", needed: true } },
        wrist: { name: "Poignet", type: gearType[0], obtained: false, upgrade: { type: "Accessory", needed: true } },
        ring1: { name: "Bague Memo", type: gearType[0], obtained: false, upgrade: { type: "Accessory", needed: true } },
        ring2: { name: "Bague Loot", type: gearType[1], obtained: false, },
    }

    const updateBis = (values) => {
        Object.entries(values).map(armorElement => {
            const { type, obtained } = armorElement[1];
            if (armorElement[1].upgrade && type === gearType[0]) {
                armorElement[1].upgrade.needed = !obtained;
            }
        })
        console.log(values)
    }
    return (
        <Formik
            enableReinitialize
            onSubmit={updateBis}
            initialValues={initialGearSet}
        >
            {({ handleSubmit, setValues, values }) => (
                <Container className="bg-light">
                    <Form onSubmit={handleSubmit}>
                        <Row><UpdateBtn /></Row>
                        <div style={{ maxHeight: "400px", overflowY: "scroll", overflowX: "hidden" }} className="d-flex flex-column flex-lg-wrap">
                            {
                                Object.entries(initialGearSet).map((armorElement, index) => {
                                    return <Row><GearPiece tabArmorElement={armorElement} job={job} gearType={gearType} /></Row>
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

const GearPiece = ({ tabArmorElement, job, gearType }) => {

    const gearPiece = tabArmorElement[0]
    const { name } = tabArmorElement[1]

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

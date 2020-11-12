import React, { useState } from 'react'
import { Formik, Field } from 'formik'
import Form from 'react-bootstrap/Form'
import { UpdateBtn, ResetBtn } from '../formElements'
import { gearType, resetGearSet } from '../../utils/jobs'
import { PropTypes } from 'prop-types'
import { Character } from '../../models'

import "./bisForm.scss"

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
                <>
                    <div className="custom__container" style={{ width: "1020px", padding: "10px" }}>
                        <div>
                            <h3>BIS : {job} - Cochez les équipements obtenu</h3>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <UpdateBtn /> <ResetBtn handleReset={() => resetBis(job)} />
                            <div style={{ maxHeight: "505px" }} className="d-flex flex-column flex-lg-wrap">
                                {
                                    Object.entries(initialGearSet)
                                        .sort((gearPieceA, gearPieceB) => {
                                            return gearPieceA[1].order > gearPieceB[1].order ? 1 : -1
                                        })
                                        .map((armorElement, index) => {
                                            return <div key={index} className="mr-2 ml-2 gear__field"><GearPiece armorElement={armorElement} job={job} gearType={gearType} /></div>
                                        })
                                }
                            </div>
                        </Form>
                    </div>
                </>
            )
            }
        </Formik >
    )
}
BISForm.propTypes = {
    job: PropTypes.string.isRequired,
    character: PropTypes.instanceOf(Character).isRequired,
    updateBis: PropTypes.func.isRequired,
    resetBis: PropTypes.func.isRequired,
}
export default React.memo(BISForm)

const GearPiece = function ({ armorElement, job, gearType }) {

    const gearPiece = armorElement[0]
    const { name, type, obtained, lowMemoPurchased } = armorElement[1]
    const [lootChecked, setLootChecked] = useState(type === gearType[1])
    const [gearObtained, setGearObtained] = useState(obtained)
    const [isLowMemoPurchased, setIsLowMemoPurchased] = useState(lowMemoPurchased)

    const onLootChecked = (e) => {
        setLootChecked(e.target.value === gearType[1])
    }
    const onCheckGearObtained = (e) => {
        setGearObtained(!gearObtained)
        if (gearObtained && type === gearType[0] && !isLowMemoPurchased) {
            setIsLowMemoPurchased(true)
        }
    }

    return (
        <Form.Group key={gearPiece} className="custom__form_group" >
            <Form.Label>
                <div className="gear__label_name">
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
                </div>
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
                />
            }

        </Form.Group>
    )
}
GearPiece.propTypes = {
    armorElement: PropTypes.array.isRequired,
    job: PropTypes.string.isRequired,
    gearType: PropTypes.arrayOf(PropTypes.string).isRequired,
}
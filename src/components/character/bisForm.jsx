import React, { useCallback, useEffect, useState } from 'react'
import { Formik, useFormik } from 'formik'
import Form from 'react-bootstrap/Form'
import { UpdateBtn, ResetBtn } from '../formElements'
import { gearType, resetGearSet } from '../../utils/jobs'
import { PropTypes } from 'prop-types'
import { Character } from '../../models'

import "./bisForm.scss"
import Swal from 'sweetalert2'

const BISForm = ({ job, character, updateBis, resetBis }) => {
    const initialGearSet = character.bis && character.bis[job] ? character.bis[job] : resetGearSet
    const formik = useFormik({
        initialValues: initialGearSet,
        onSubmit: (values) => updateBis(values, job)
    })

    return (
        <div className="custom__container" style={{ width: "1020px", padding: "10px" }}>
            <div>
                <h3>BIS : {job} - Cochez les équipements obtenu</h3>
            </div>
            <Form onSubmit={formik.handleSubmit}>
                <UpdateBtn /> <ResetBtn handleReset={() => resetBis(job)} />
                <div style={{ maxHeight: "505px" }} className="d-flex flex-column flex-lg-wrap">
                    {
                        Object.entries(initialGearSet)
                            .sort((gearPieceA, gearPieceB) => {
                                return gearPieceA[1].order > gearPieceB[1].order ? 1 : -1
                            })
                            .map((armorElement, index) => {
                                return (
                                    <div key={index} className="mr-2 ml-2 gear__field">
                                        <GearPiece armorElement={armorElement} job={job} gearType={gearType} formik={formik} />
                                    </div>)
                            })
                    }
                </div>
                {/* <pre>{JSON.stringify(formik.values, null, 2)}</pre> */}
            </Form>
        </div>
    )
}
BISForm.propTypes = {
    job: PropTypes.string.isRequired,
    character: PropTypes.instanceOf(Character).isRequired,
    updateBis: PropTypes.func.isRequired,
    resetBis: PropTypes.func.isRequired,
}
export default React.memo(BISForm)

const GearPiece = function ({ armorElement, job, gearType, formik }) {

    const gearPiece = armorElement[0]
    const { name, obtained } = armorElement[1]
    const [gearObtained, setGearObtained] = useState(obtained)



    const onRadioBtnClick = (event) => {
        formik.setFieldValue(`${gearPiece}.type`, event.target.value)
        formik.setFieldValue(`${gearPiece}.upgrade.needed`, (event.target.value === gearType.memo && formik.values[gearPiece].lowMemoPurchased))
    }



    const checkGearObtained = (event) => {
        if (!formik.values[gearPiece].obtained) {
            formik.handleChange(event)
            formik.setFieldValue(`${gearPiece}.upgrade.needed`, event.target.checked)
        }
    }

    const handleLowMemoPruchasedStatus = useCallback(
        () => {
            if (formik.values[gearPiece].obtained
                && formik.values[gearPiece].type === gearType.memo
                && !formik.values[gearPiece].lowMemoPurchased) {
                formik.setFieldValue(`${gearPiece}.lowMemoPurchased`, true)
                formik.setFieldValue(`${gearPiece}.upgrade.needed`, false)
            }
        },
        [formik, gearPiece, gearType]
    )


    const onCheckGearObtained = (event) => {
        formik.handleChange(event)
        setGearObtained(!obtained)
        handleLowMemoPruchasedStatus()
        if (formik.values[gearPiece].upgrade && formik.values[gearPiece].upgrade.needed) {
            formik.setFieldValue(`${gearPiece}.upgrade.needed`, false)
        }
        if (event.target.checked === false && formik.values[gearPiece].type === gearType.memo && formik.values[gearPiece].lowMemoPurchased) {
            // case when user declare not obtained a memo stuff while the low memo is purchased, if he still need the the upgrade
            Swal.fire({
                icon: "question",
                title: `Stuff Mémo : ${formik.values[gearPiece].name}`,
                html: `Tu déclares ne plus avoir obtenu ce stuff...<br/>As-tu encore besoin de l'améliorant ?`,
                confirmButtonText: "Oui, j'en ai encore besoin",
                cancelButtonText: "Non, je l'ai déjà",
                showCancelButton: true,
            })
                .then(response => formik.setFieldValue(`${gearPiece}.upgrade.needed`, response.isConfirmed))
        }
    }

    useEffect(() => {
        handleLowMemoPruchasedStatus()
    }, [gearObtained, handleLowMemoPruchasedStatus])

    return (
        <Form.Group key={gearPiece} className="custom__form_group" >
            <Form.Label>
                <div className="gear__label_name">
                    <Form.Check
                        type="checkbox"
                        label={name}
                        value={formik.values[gearPiece].obtained}
                        id={`${job}_${gearPiece}_obtained`}
                        name={`${gearPiece}.obtained`}
                        onClick={onCheckGearObtained}
                        checked={formik.values[gearPiece].obtained}
                        inline
                        custom
                    />
                </div>
            </Form.Label>
            {
                !gearPiece.match(/(weapon.)|(ring.)/) &&
                <>
                    <Form.Check
                        type="radio"
                        label={gearType.loot}
                        value={gearType.loot}
                        id={`${job}_${gearPiece}_loot`}
                        name={`${gearPiece}_type`}
                        onClick={onRadioBtnClick}
                        checked={formik.values[gearPiece].type === gearType.loot}
                        inline
                        custom
                    />

                    <Form.Check
                        type="radio"
                        label={gearType.memo}
                        value={gearType.memo}
                        id={`${job}_${gearPiece}_memo`}
                        name={`${gearPiece}_type`}
                        onClick={onRadioBtnClick}
                        checked={formik.values[gearPiece].type === gearType.memo}
                        inline
                        custom
                    />
                </>
            }
            {formik.values[gearPiece].type !== gearType.loot &&
                <Form.Check
                    type="checkbox"
                    label={"Mémo acheté"}
                    value={formik.values[gearPiece].lowMemoPurchased}
                    id={`${job}_${gearPiece}_memo_lowMemoPurchased`}
                    name={`${gearPiece}.lowMemoPurchased`}
                    onClick={checkGearObtained}
                    checked={formik.values[gearPiece].lowMemoPurchased || formik.values[gearPiece].obtained}
                    disabled={formik.values[gearPiece].obtained}
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
    formik: PropTypes.instanceOf(Formik).isRequired
}
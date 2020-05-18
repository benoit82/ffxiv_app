import React from 'react'
import { useParams } from 'react-router-dom';

const EditCharacter = () => {

    let { chr_id } = useParams();
    return (
        <div>
            Edit : {chr_id}
        </div>
    )
}

export default EditCharacter

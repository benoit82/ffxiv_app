import React from 'react'
import Button from 'react-bootstrap/Button';

const SearchBtn = ({ label }) => {
    const labelBtn = label || "rechercher"
    return (
        <Button className="m-1" variant="primary" type="submit">
            <i className="fas fa-binoculars"></i>{labelBtn}
        </Button>
    )
}

export default SearchBtn

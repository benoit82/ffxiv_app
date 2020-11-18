import React from 'react'
import Button from 'react-bootstrap/Button'
import { Character } from '../../models'
import { PropTypes } from 'prop-types'

import './characterDetail.css'

const CharacterDetail = ({ chr, handleDelete }) => {
  const { name, avatar, server } = chr
  return (
    <div
      className='character_main_container'
    >
      <aside>
        <img src={avatar} alt={name} />
      </aside>
      <aside className='character_details_container'>
        <h4>{name}</h4>
        <p>{server}</p>
      </aside>
      <aside>
        <Button variant='danger' onClick={() => handleDelete(chr)}>X</Button>
      </aside>
    </div>
  )
}
CharacterDetail.propTypes = {
  chr: PropTypes.instanceOf(Character).isRequired,
  handleDelete: PropTypes.func.isRequired
}
export default CharacterDetail

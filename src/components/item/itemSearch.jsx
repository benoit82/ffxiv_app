import React, { useState, useEffect } from 'react'
import axios from 'axios'

import ItemDetail from './itemDetail'
import { Item } from '../../models'

const ItemSearch = () => {
  const [item, setItem] = useState({})
  const [id, setId] = useState(29509)
  const [lang, setLang] = useState('fr')

  useEffect(() => {
    (async () => {
      const res = await axios.get(`https://xivapi.com/item/${id}`)
      setItem(new Item(res.data, lang))
    })()
  }, [id, lang])

  const langSelector = (
    <select name='lang' id='lang' onChange={(e) => setLang(e.target.value)}>
      <option value='fr' defaultValue>
        français
      </option>
      <option value='en'>anglais</option>
      <option value='ja'>Japonais</option>
      <option value='de'>Allemand</option>
    </select>
  )

  return (
    <>
      {langSelector}
      <input
        type='number'
        name='id'
        id='id'
        value={id}
        onChange={(event) => {
          setId(event.target.value)
        }}
      />
      <ItemDetail item={item} />
    </>
  )
}

export default ItemSearch

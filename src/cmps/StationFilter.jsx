import { useState, useEffect } from 'react'
import {  NavLink } from 'react-router-dom'

export function StationFilter({ filterBy, onSetFilterBy }) {
  const [filterToEdit, setFilterToEdit] = useState(structuredClone(filterBy))

  useEffect(() => {
    onSetFilterBy(filterToEdit)
  }, [filterToEdit])

  function handleChange(ev) {
    const type = ev.target.type
    const field = ev.target.name
    let value

    switch (type) {
      case 'text':
      case 'radio':
        value = field === 'sortDir' ? +ev.target.value : ev.target.value
        if (!filterToEdit.sortDir) filterToEdit.sortDir = 1
        break
      case 'number':
      case 'range':
        value = +ev.target.value
        break
    }
    setFilterToEdit({ ...filterToEdit, [field]: value })
  }

  function clearFilter() {
    setFilterToEdit({ ...filterToEdit, txt: '', minSpeed: '', maxPrice: '' })
  }

  function clearSort() {
    setFilterToEdit({ ...filterToEdit, sortField: '', sortDir: '' })
  }

  return (
    <section className="station-filter">
      <input
        type="text"
        name="txt"
        value={filterToEdit.txt}
        placeholder="Free text"
        onChange={handleChange}
        required
      />
      <button className="" onClick={clearFilter}>
        X
      </button>
      <NavLink to="/search" className="">genres</NavLink>
      {/* <NavLink to="/genres" className="">genres</NavLink> */}
    </section>
  )
}

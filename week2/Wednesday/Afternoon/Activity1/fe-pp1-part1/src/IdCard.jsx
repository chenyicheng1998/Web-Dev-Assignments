import React from 'react'
import "./IdCard.css"

const IdCard = (props) => {
  return (
    <div className="id-card">
      <img className="id-picture" src={props.picture} alt={props.firstName} />
      <div className="id-info">
        <p>First name: {props.firstName}</p>
        <p>Last name: {props.lastName}</p>
        <p>Gender: {props.gender}</p>
        <p>Height: {(props.height / 100).toFixed(2)}m</p>
        <p>Birth: {props.birth.toDateString()}</p>
      </div>
    </div>
  )
}

export default IdCard
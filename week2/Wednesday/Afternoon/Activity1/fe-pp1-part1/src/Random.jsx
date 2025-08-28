import React from "react";
import "./Random.css"

const Random = (props) => {
  const randomValue = Math.floor(Math.random() * (props.max - props.min + 1)) + props.min;

  return (
    <div className="random-card">
      <p>
        Random value between {props.min} and {props.max} =&gt; {randomValue}
      </p>
    </div>
  );
};

export default Random;

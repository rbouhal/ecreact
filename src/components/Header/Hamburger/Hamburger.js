import React from 'react';
import './Hamburger.css';

function Hamburger({ toggleNav }) {
  return (
    <button className="hamburger" onClick={toggleNav}>
      &#9776;
    </button>
  );
}

export default Hamburger;

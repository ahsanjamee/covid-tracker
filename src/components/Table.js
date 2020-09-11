import React from "react";
import numeral from 'numeral';

function Table({ data }) {

  let i = 1;
  return (
    <div className="table">
          {data.map((
            { country, cases } //destructuring the object
          ) => (
                <tr>
                  <td>{i++}. {country}</td>
                  <td><strong>{numeral(cases).format('0,0')}</strong></td>
                </tr>           
          ))}
    </div>
  );
}

export default Table;

import React from "react";

function Table({ data }) {

  let i = 1;
  return (
    <div className="table">
          {data.map((
            { country, cases } //destructuring the object
          ) => (
                <tr>
                  <td>{i++}. {country}</td>
                  <td><strong>{cases}</strong></td>
                </tr>           
          ))}
    </div>
  );
}

export default Table;

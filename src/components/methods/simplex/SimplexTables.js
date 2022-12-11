import React from "react";
import "../simplex.css";
var Fraction = require("fraction.js");

export default function SimplexTables(props) {
  let r = [];
  let table = [];
  let restr = [];
  let param = props.simplexTable;
  let simplexTable = param.simplexTable || param.artificialTable;
  let { colMin, rowMin } = param.pivot;
  let step = param.step;
  let countVariables = simplexTable[0].length;
  let countRestrictions = simplexTable.length;
  let allParams = param.allParams;
  //   console.log("simtable", param.simplexTable);

  function returnFraction(num) {
    if (num.n !== 0 || num.d !== null)
      return Fraction(num.n).div(num.d).mul(num.s).toFraction();
    else return 0;
  }

  function parseSimplexTable() {
    let count = 0;
    restr.push(
      <th style={{ width: "40px" }}>
        x<sup>({param.step})</sup>
      </th>
    );
    allParams[1].map((el) => restr.push(<th>{el.param}</th>));
    restr.push(<th>b</th>);
    table.push(<tr style={{ textAlign: "center" }}>{restr}</tr>);
    for (let i = 0; i < countRestrictions; i++) {
      for (let j = 0; j < countVariables; j++) {
        if (j === 0) {
          if (i !== countRestrictions - 1)
            r.push(
              <td>
                <b>{allParams[0][count].param}</b>
              </td>
            );
          else
            r.push(
              <td>
                <b>p</b>
              </td>
            );
          count++;
        }
        if (i === rowMin && j === colMin && step !== countRestrictions - 1) {
          r.push(
            <td style={{ backgroundColor: "green" }}>
              {returnFraction(simplexTable[i][j])}
              {/* {new Fraction(simplexTable[i][j]).toFraction()} */}
            </td>
          );
        } else {
          r.push(<td>{returnFraction(simplexTable[i][j])}</td>);
          // r.push(<td>{new Fraction(simplexTable[i][j]).toFraction()}</td>);
        }
      }
      table.push(<tr>{[...r]}</tr>);
      // zyyyyy
      r = [];
    }
    count = 0;
    return <table>{table}</table>;
  }

  return <table>{parseSimplexTable()}</table>;
}

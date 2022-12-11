import React, { useRef } from "react";
import "../../simplex.css";
import { otherSimplex } from "../ManualSimplex";
var Fraction = require("fraction.js");

export default function ManualSimplexTables(props) {
  let table = [];
  let restr = [];
  // let r = [];
  let history = props.manualSimplexTable;
  let simplex = [];
  //   console.log("simtable", param.simplexTable);
  let mainColor = "green";
  let helpColor = "yellow";
  //   const prevTh = useRef(null);
  //   const prevColor = useRef(null);
  const prevTh = useRef();
  const prevColor = useRef();
  function changeColor(event, param) {
    console.log("event", event);
    param.select = event.target.cloneNode(true);
    //   color: event.target.style.backgroundColor,

    if (prevTh.current !== undefined)
      prevTh.current.target.style.backgroundColor = prevColor.current;
    prevColor.current = event.target.style.backgroundColor;
    prevTh.current = event;
    event.target.style.backgroundColor = "blue";
  }

  function returnFraction(num) {
    if (num.n !== 0 || num.d !== null)
      return Fraction(num.n).div(num.d).mul(num.s).toFraction();
    else return 0;
  }

  function parseSimplexTable() {
    history.map((params) => {
      let simplexTable = params.simplexTable;
      let { colMin, rowMin } = params.pivot;
      let simStep = params.step;
      let simMaybe = params.maybe;
      let simCountVariables = simplexTable[0].length;
      let simCountRestrictions = simplexTable.length;
      let simAllParams = params.allParams;
      let count = 0;
      let r = [];
      table = [];
      restr = [];

      restr.push(
        <th style={{ width: "40px" }}>
          x<sup>({simStep})</sup>
        </th>
      );
      simAllParams[1].map((el) => restr.push(<th>{el.param}</th>));
      restr.push(<th>b</th>);
      table.push(<tr style={{ textAlign: "center" }}>{restr}</tr>);
      for (let i = 0; i < simCountRestrictions; i++) {
        for (let j = 0; j < simCountVariables; j++) {
          if (j === 0) {
            if (i !== simCountRestrictions - 1)
              r.push(
                <td>
                  <b>{simAllParams[0][count].param}</b>
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
          if (
            i === rowMin &&
            j === colMin &&
            // simStep !== simCountRestrictions - 1 &&
            rowMin !== -1
          ) {
            r.push(
              <td
                onClick={(e) => {
                  changeColor(e, params);
                  nextSimplex(simplexTable, i, j, simplexTable[i][j], params);
                }}
                style={{ backgroundColor: mainColor }}
              >
                {returnFraction(simplexTable[i][j])}
                {/* {new Fraction(simplexTable[i][j]).toFraction()} */}
              </td>
            );
          } else {
            let flag = 0;
            if (simMaybe !== undefined)
              simMaybe.map((e) =>
                e.row === i && e.column === j
                  ? (r.push(
                      <td
                        onClick={(e) => {
                          changeColor(e, params);
                          nextSimplex(
                            simplexTable,
                            i,
                            j,
                            simplexTable[i][j],
                            params,
                            false
                          );
                        }}
                        style={{ backgroundColor: helpColor }}
                      >
                        {returnFraction(simplexTable[i][j])}
                        {/* {new Fraction(simplexTable[i][j]).toFraction()} */}
                      </td>
                    ),
                    flag++)
                  : null
              );
            if (!flag) {
              r.push(<td>{returnFraction(simplexTable[i][j])}</td>);
            }
            // r.push(<td>{new Fraction(simplexTable[i][j]).toFraction()}</td>);
          }
        }
        table.push(<tr>{[...r]}</tr>);
        r.splice(0);
        if (params.select !== undefined)
          params.select.style.backgroundColor = "blue";
      }

      count = 0;
      simplex.push(
        <>
          <br />
          <table>{table}</table>
        </>
      );
      if (rowMin === -1 && simMaybe === undefined) {
        let x = [];
        for (let i = 0; i < simCountVariables; i++) {
          x[i] = 0;
          simAllParams[0].map((el) =>
            el.num === i
              ? (x[i] = returnFraction(
                  simplexTable[el.row][simplexTable[0].length - 1]
                ))
              : null
          );
        }
        simplex.push(
          <div>
            Ответ: f(x) = {params.f}, x* = (
            {x.map((e) => (
              <>{e},</>
            ))}
            )
          </div>
        );
      }
      return 0;
    });
  }

  function nextSimplex(table, pivotRow, pivotCol, pivotValue, param) {
    history.splice(param.step + 1);

    let all = otherSimplex(
      JSON.parse(JSON.stringify(table)),
      { pivotRow, pivotCol, pivotValue },
      JSON.parse(JSON.stringify(param)),
      history,
      param.step + 1
    );

    props.setManualSimplexTable([...all]);
  }

  parseSimplexTable();
  return (
    <>
      {simplex.map((table) => (
        <div>
          <br />
          <>{table}</>
        </div>
      ))}
    </>
  );
}

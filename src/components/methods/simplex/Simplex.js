import React, { useState } from "react";
import SimplexInput from "./SimplexInput";
import SimplexTables from "./SimplexTables";
import SimplexTablesDecimal from "./SimplexTablesDecimal";
import ManualSimplexTables from "./ManualTables/ManualSimplexTables";
import { Col, Row } from "antd";
import ManualSimplexTablesDecimal from "./ManualTables/ManualSimplexTablesDecimal";
var Fraction = require("fraction.js");

export default function Simplex() {
  const [simplexTable, setSimplexTable] = useState([]);
  const [manualSimplexTable, setManualSimplexTable] = useState([]);

  function returnFraction(num) {
    if (num.n !== 0 || num.d !== null)
      return Fraction(num.n).div(num.d).mul(num.s).toFraction();
    else return 0;
  }
  function setAnswer(el) {
    let rowMin = el.pivot.rowMin;
    let simplexTable = el.simplexTable;
    let simAllParams = el.allParams;
    if (rowMin === -1 && el.maybe === undefined) {
      let x = [];

      // записываем все элементы
      for (
        let i = 0;
        i < simplexTable.length + simplexTable[0].length - 2;
        i++
      ) {
        x[i] = 0;
        simAllParams[0].map(
          (el) =>
            (x[el.num] = returnFraction(
              simplexTable[el.row][simplexTable[0].length - 1]
            ))
        );
      }
      return (
        <div>
          Ответ: f(x) = {el.f}, x* = (
          {x.map((e) => (
            <>{e},</>
          ))}
          )
        </div>
      );
    }
  }
  return (
    <div>
      <SimplexInput
        setSimplexTable={setSimplexTable}
        setManualSimplexTable={setManualSimplexTable}
      />
      <Row>
        <Col span={12}>
          Дробные
          {simplexTable.length !== 0
            ? simplexTable.map((el) => (
                <>
                  <br />
                  <SimplexTables simplexTable={el} />
                  {el.pivot.rowMin === -1 ? setAnswer(el) : null}
                </>
              ))
            : null}
        </Col>

        <Col span={12}>
          Десятичные
          {simplexTable.length !== 0
            ? simplexTable.map((el) => (
                <>
                  <br />
                  <SimplexTablesDecimal simplexTable={el} />
                </>
              ))
            : null}
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          {manualSimplexTable.length !== 0 ? (
            <>
              <br />
              <ManualSimplexTables
                setManualSimplexTable={setManualSimplexTable}
                manualSimplexTable={manualSimplexTable}
              />
            </>
          ) : null}
        </Col>
        <Col span={12}>
          {manualSimplexTable.length !== 0 ? (
            <>
              <br />
              <ManualSimplexTablesDecimal
                setManualSimplexTable={setManualSimplexTable}
                manualSimplexTable={manualSimplexTable}
              />
            </>
          ) : null}
        </Col>
      </Row>
    </div>
  );
}

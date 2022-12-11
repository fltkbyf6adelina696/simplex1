import React, { useState } from "react";
import SimplexTables from "./SimplexTables";
import ManualTables from "./ManualTables/ManualArtificial";
import ManualTablesDecimal from "./ManualTables/ManualArtificialDecimal";
import ArtificialBasisInput from "./ArtificialBasisInput";
import { Col, Row } from "antd";
var Fraction = require("fraction.js");
export default function Simplex() {
  const [simplexTable, setSimplexTable] = useState([]);
  const [artificialBasisTable, setArtificialBasisTable] = useState([]);
  const [anotherTable, setAnotherTable] = useState([]);

  function returnFraction(num) {
    if (num.n !== 0 || num.d !== null)
      return Fraction(num.n).div(num.d).mul(num.s).toString();
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
      <ArtificialBasisInput
        setSimplexTable={setSimplexTable}
        setArtificialBasisTable={setArtificialBasisTable}
        setAnotherTable={setAnotherTable}
      />
      {artificialBasisTable.length !== 0
        ? artificialBasisTable.map((el) => (
            <>
              <br />
              Метод искусственного базиса таблицы
              <SimplexTables simplexTable={el} />
            </>
          ))
        : null}

      {simplexTable.length !== 0
        ? simplexTable.map((el) => (
            <>
              Симплекс таблица
              <br />
              <SimplexTables simplexTable={el} />
              {el.pivot.rowMin === -1 && el.maybe === undefined
                ? setAnswer(el)
                : null}
            </>
          ))
        : null}

      <Row>
        <Col span={12}>
          
          {anotherTable.length !== 0 ? (
            <ManualTables
              simplexTable={anotherTable[1]}
              artificialBasisTable={anotherTable[0]}
              setSimplexTable={setSimplexTable}
              setArtificialBasisTable={setArtificialBasisTable}
              setAnotherTable={setAnotherTable}
            />
          ) : null}
        </Col>

        <Col span={12}>
          
          {anotherTable.length !== 0 ? (
            <ManualTablesDecimal
              simplexTable={anotherTable[1]}
              artificialBasisTable={anotherTable[0]}
              setSimplexTable={setSimplexTable}
              setArtificialBasisTable={setArtificialBasisTable}
              setAnotherTable={setAnotherTable}
            />
          ) : null}
        </Col>
      </Row>
    </div>
  );
}

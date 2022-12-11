import { setF, setAfterGauss } from "./simplexAlgorithm";
import GaussSolution from "./Gauss";
import { oneSimplex } from "./artifcialBasis/manualArtificial";
import { changeFuncMinMax } from "./ArtificialBasisAlgorithm";
var Fraction = require("fraction.js");
let func = [];
let countVariables;
export default function FirstSimplex(
  _countVariables,
  _func,
  countRestrictions,
  restrictions,
  minMax,
  basises
) {
  func = changeFuncMinMax(_func, minMax);
  countVariables = _countVariables;

  let arrBasis = [];
  let arrOther = [];
  let count = 0;
  let pivotRow = -1;
  let pivotCol = -1;
  let pivotValue = Fraction(0.000001);
  let helpBasis = 0,
    helpOther = 0;
  let allParams = [[], []];
  basises.map((e) => (e ? count++ : 0));
  let arrBeforeSimplex = [];
  // Создаем массивы для того, чтобы сделать правильную матрицу БАЗИСНЫЕ|ОСТАЛЬНЫЕ|B
  for (let i = 0; i < countRestrictions; i++) {
    arrBasis[i] = []; // new Array(count-1);
    arrOther[i] = []; //new Array(countVariables-count-1)
  }
  for (let i = 0; i < countVariables; i++) arrBeforeSimplex[i] = [];

  // Отделяем базисные и другие
  for (let i = 0; i < restrictions[0].length - 1; i++) {
    for (let j = 0; j < restrictions.length; j++) {
      if (basises[i]) arrBasis[j].push(restrictions[j][i]);
      else arrOther[j].push(restrictions[j][i]);
    }
  }

  // console.log("allParams", allParams);
  // Записываем все после отделения в 1 массив, чтобы дальше работать с ним.
  for (let i = 0; i < restrictions.length; i++)
    for (let j = 0; j < arrOther[0].length; j++)
      arrBasis[i].push(arrOther[i][j]);

  // Добавляем B (решение, которое после = )
  for (let i = 0; i < restrictions.length; i++)
    arrBasis[i].push(restrictions[i][countVariables]);

  // Проводим метод гаусса, чтобы выразить базисные переменные
  let afterGauss = GaussSolution(JSON.parse(JSON.stringify(arrBasis)));
  // Выражаем переменные
  let beforeSimplex = [];
  for (let i = 0; i < countRestrictions; i++)
    beforeSimplex[i] = afterGauss[i].slice(count);

  for (let i = 0; i < beforeSimplex.length; i++)
    beforeSimplex[i] = beforeSimplex[i].map((el) => (el = Fraction(el)));

  // Формируем массив начальной функции (для вычисления дальше)
  arrBeforeSimplex = setAfterGauss(
    arrBeforeSimplex,
    beforeSimplex,
    countVariables,
    basises,
    func,
    count
  );
  // Создаем массив итоговой функции f(x) и заполняем 0
  let mylittlepony = [];
  mylittlepony = setF(arrBeforeSimplex);

  beforeSimplex.push(mylittlepony);

  for (let i = 0; i < basises.length; i++) {
    let help = i + 1;
    if (basises[i]) {
      allParams[0][helpBasis] = {
        param: "x" + help,
        num: i,
        column: 0,
        row: helpBasis,
      };
      helpBasis++;
    } else {
      allParams[1][helpOther] = {
        param: "x" + help,
        num: i,
        column: helpOther,
        row: 0,
      };
      helpOther++;
    }
  }
  let table = otherSimplex(
    beforeSimplex,
    { pivotRow, pivotCol, pivotValue },
    { allParams },
    [],
    0
  );
  let history = [];
  history.push(table);
  return history;
}

export function otherSimplex(inputTable, pivot, params, history, step) {
  let { pivotRow, pivotCol, pivotValue } = pivot;

  let allParams = params.allParams;
  let allHistory = history;
  let simplexTable = {};

  simplexTable = oneSimplex(
    JSON.parse(JSON.stringify(inputTable)),
    allParams,
    step,
    pivotRow,
    pivotCol,
    pivotValue
  );
  if (step === 0) {
    return simplexTable;
  } else {
    allHistory.push(simplexTable);
    return allHistory;
  }
}

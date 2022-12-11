import { setF } from "../simplexAlgorithm";
import {
  changeFuncMinMax,
  changeNegativeTable,
} from "../ArtificialBasisAlgorithm";
var Fraction = require("fraction.js");
let func = [];
let countVariables;
export default function FirstTable(
  _countVariables,
  _func,
  countRestrictions,
  restrictions,
  minMax,
  added,
  artStep = 0,
  simpStep = 0,
  artHistory = [],
  simpHistory = [],
  pivotRow = -1,
  pivotCol = -1,
  pivotValue = Fraction(0.000001)
) {
  func = changeFuncMinMax(_func, minMax);

  countVariables = _countVariables;
  let artNsimplex = [];
  let allParams = [[], []];
  console.log("added", added);
  // делаем таблицу искусственного базиса
  let inputTable = [];
  let lastRowTable = [];
  restrictions.map((e) => inputTable.push([...e]));
  // вычисляем последнюю строку для таблицы
  for (let i = 0; i < countVariables + 1; i++) {
    let columnSum = 0;
    for (let j = 0; j < countRestrictions; j++) {
      columnSum -= inputTable[j][i];
    }
    lastRowTable.push(columnSum);
  }
  inputTable.push(lastRowTable);
  inputTable = changeNegativeTable(inputTable);
  // перевод в дробные
  for (let i = 0; i < inputTable.length; i++)
    inputTable[i] = inputTable[i].map((el) => Fraction(el));

  let helpAdded = 0,
    helpOther = 0;
  for (let i = 0; i < added.length; i++) {
    let help = i + 1;
    if (!!added[i] || i >= countVariables) {
      allParams[0][helpAdded] = {
        param: "x" + help,
        num: i,
        column: 0,
        row: helpAdded,
      };
      helpAdded++;
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
  console.log("lastrowTable", { inputTable, allParams });
  let table = {};
  let artivicialHistory = artHistory;
  if (artStep === 0) {
    table = setArtificialBasis(
      inputTable,
      allParams,
      artStep,
      pivotRow,
      pivotCol,
      pivotValue
    );
    artivicialHistory.push(table);
    artNsimplex[0] = artivicialHistory;
  }

  return artNsimplex;
}

export function otherSteps(
  inputTable,
  pivot,
  params,
  artHistory = [],
  simpHistory = [],
  artStep,
  simpStep
) {
  let { pivotRow, pivotCol, pivotValue } = pivot;

  let allParams = params.allParams;
  let artNsimplex = [];
  let simplexTable = {};

  let table = {};
  let artivicialHistory = artHistory;
  let simplexHistory = simpHistory;
  if (artStep === 0) {
    table = setArtificialBasis(
      inputTable,
      allParams,
      artStep,
      pivotRow,
      pivotCol,
      Fraction(pivotValue)
    );
    artivicialHistory.push(table);
    artNsimplex[0] = artivicialHistory;
  } else if (artStep === inputTable.length - 1) {
    if (simpStep === 0) {
      table = setArtificialBasis(
        inputTable,
        allParams,
        artStep,
        pivotRow,
        pivotCol,
        Fraction(pivotValue)
      );
      artivicialHistory.push(table);
      artNsimplex[0] = artivicialHistory;
      let needSum = setAfterArtificial(
        JSON.parse(
          JSON.stringify(
            artivicialHistory[artivicialHistory.length - 1].artificialTable
          )
        ),
        allParams
      );
      let mylittlepony = setF(needSum);
      console.log("mylittlepony", mylittlepony);
      let goSimplexTable = JSON.parse(
        JSON.stringify(
          artivicialHistory[artivicialHistory.length - 1].artificialTable
        )
      );
      goSimplexTable.pop();
      goSimplexTable.push(mylittlepony);
      simplexTable = oneSimplex(
        goSimplexTable,
        allParams,
        simpStep,
        -1,
        -1,
        Fraction(0.000001)
      );
      simplexHistory.push(simplexTable);
      artNsimplex[1] = simplexHistory;
    } else {
      simplexTable = oneSimplex(
        inputTable,
        allParams,
        simpStep,
        pivotRow,
        pivotCol,
        Fraction(pivotValue)
      );
      simplexHistory.push(simplexTable);
      artNsimplex[0] = artivicialHistory;
      artNsimplex[1] = simplexHistory;
    }
  } else {
    table = setArtificialBasis(
      inputTable,
      allParams,
      artStep,
      pivotRow,
      pivotCol,
      Fraction(pivotValue)
    );
    artivicialHistory.push(table);
    artNsimplex[0] = artivicialHistory;
  }

  // artNsimplex.push(tables);
  // artNsimplex.push(simplexTable);
  return artNsimplex;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function setArtificialBasis(
  artificialTable,
  allParams,
  step,
  pivotRow,
  pivotCol,
  pivotValue
) {
  let column = artificialTable[0].length;
  let lastCol = artificialTable[0].length - 1;
  let row = artificialTable.length;
  let lastRow = artificialTable.length - 1;
  let notMin = 9999;
  let pivot = pivotValue;
  let helperParam, helperNum;
  let coeff = [];
  let allTables = [];
  let tableObj = {};

  let rowMin = pivotRow,
    colMin = pivotCol;
  let min = Fraction(1).div(pivotValue);

  // TODO: Если весь столбец <0, то функция неограничена снизу
  //   for (let step = 0; ; step++) {

  column = artificialTable[0].length;
  lastCol = artificialTable[0].length - 1;
  row = artificialTable.length;
  lastRow = artificialTable.length - 1;
  // TODO: ДЕЛАТЬ КОПИИ МАССИВОВ ИЛИ НЕТ!??! ВОТ В ЧЕМ ВОПРОС
  // Ищем минимальное неотриц из всех
  // Условие выхода из искусственного базиса

  let maybe = [];

  // Если выбрали ручной метод в первый раз, то формируем таблицу и выводим её
  if (step === 0) {
    for (let k = 0; k < lastCol; k++) {
      if (artificialTable[lastRow][k].s < 0) {
        for (let i = 0; i < lastRow; i++) {
          // TODO: Посмотреть что там с 0 в значениях и функциях
          if (artificialTable[i][k].s < 0 || artificialTable[i][k].n === 0)
            continue;
          notMin = Fraction(1).div(artificialTable[i][k]);
          maybe.push({
            row: i,
            column: k,
            value: artificialTable[i][k],
            min: notMin,
          });
          if (min > notMin) {
            rowMin = i;
            colMin = k;
            min = notMin;
            pivot = artificialTable[i][k];
          }
        }
      }
    }
    tableObj = {
      artificialTable: JSON.parse(JSON.stringify(artificialTable)),
      step,
      f: -artificialTable[lastRow][lastCol],
      allParams: JSON.parse(JSON.stringify(allParams)),
      pivot: { rowMin, colMin },
      maybe,
    };
    return tableObj;
  }

  // Записываем коэфициенты для искусственного базиса
  for (let i = 0; i < row; i++) {
    coeff[i] = Fraction(artificialTable[i][colMin]);
  }
  // console.log("min", { artificialTable, rowMin, colMin, min, pivot });
  artificialTable[rowMin][colMin] = Fraction(min);
  // Меняем столбец
  for (let i = 0; i < row; i++) {
    if (i === rowMin) continue;
    artificialTable[i][colMin] = Fraction(artificialTable[i][colMin])
      .div(pivot)
      .mul(-1);
  }
  // Меняем строчку
  for (let i = 0; i < column; i++) {
    if (i === colMin) continue;
    artificialTable[rowMin][i] = Fraction(artificialTable[rowMin][i]).div(
      pivot
    );
  }

  // Меняем переменные (для отрисовки потом)
  // basises[]
  helperParam = allParams[0][rowMin].param;
  helperNum = allParams[0][rowMin].num;

  allParams[0][rowMin].param = allParams[1][colMin].param;
  allParams[0][rowMin].num = allParams[1][colMin].num;

  allParams[1][colMin].param = helperParam;
  allParams[1][colMin].num = helperNum;
  helperParam = -1;
  helperNum = -1;

  // console.log("Поменял столбец и строчку", {
  //   artificialTable,
  //   rowMin,
  //   colMin,
  //   min,
  //   pivot,
  // });
  // console.log(allParams);

  // Вычисляем строчки (но идем по столбцам, т.к. js плох в массивы или я туплю)
  for (let i = 0; i < row; i++) {
    if (i === rowMin) continue;
    for (let j = 0; j < column; j++) {
      if (j === colMin) continue;
      artificialTable[i][j] = Fraction(artificialTable[i][j]).sub(
        Fraction(coeff[i]).mul(artificialTable[rowMin][j])
      );
    }
  }
  // console.log("before splice:", { artificialTable });

  // Удаляем опорный столбец
  for (let i = 0; i < row; i++) {
    artificialTable[i].splice(colMin, 1);
  }
  allParams[1].splice(colMin, 1);

  column = artificialTable[0].length;
  lastCol = artificialTable[0].length - 1;
  row = artificialTable.length;
  lastRow = artificialTable.length - 1;

  console.log("after splice:", { artificialTable });
  min = 9999;
  maybe = [];
  // Поиск опорных точек
  tableObj = {};
  rowMin = -1;
  colMin = -1;
  // TODO: Сделать нормальные эксепшены и организацию кода...
  for (let i = 0; i < artificialTable.length - 1; i++) {
    if (artificialTable[i][lastCol].s < 0) {
      alert("Введен недопустимый элемент, пожалуйста, выберите другой");
      throw new Error(
        "Введен недопустимый элемент, пожалуйста, выберите другой"
      );
    }
  }
  for (let k = 0; k < lastCol; k++) {
    if (artificialTable[lastRow][k].s < 0) {
      for (let i = 0; i < lastRow; i++) {
        // TODO: Посмотреть что там с 0 в значениях и функциях
        if (artificialTable[i][k].s < 0 || artificialTable[i][k].n === 0)
          continue;
        notMin = Fraction(1).div(artificialTable[i][k]);
        maybe.push({
          row: i,
          column: k,
          value: artificialTable[i][k],
          min: notMin,
        });
        if (min > notMin) {
          rowMin = i;
          colMin = k;
          min = notMin;
          pivot = artificialTable[i][k];
        }
      }
    }
  }
  tableObj = {
    artificialTable: JSON.parse(JSON.stringify(artificialTable)),
    step,
    f: -artificialTable[lastRow][lastCol],
    allParams: JSON.parse(JSON.stringify(allParams)),
    pivot: { rowMin, colMin },
    maybe,
  };
  if (step === row - 1) {
    console.log("Конец искусственного базиса:", { allTables });
    return tableObj;
  }
  return tableObj;
}

function setAfterArtificial(table, allParams) {
  let newCount = 0;
  let beforeCount = 0;
  let last = table[0].length - 1;
  let arrTable = [];
  for (let i = 0; i < countVariables; i++) {
    arrTable[i] = [];
  }
  let basis = [];
  let notBasis = [];
  allParams[0].map((e) => basis.push(e.num));
  allParams[1].map((e) => notBasis.push(e.num));
  let num = -1;
  // формируем коэфициенты f(x)
  for (let i = 0; i < countVariables; i++) {
    if (basis[i] !== undefined) {
      num = basis[i];
      for (let j = 0; j <= last; j++)
        arrTable[beforeCount][j] = Fraction(table[beforeCount][j])
          .mul(func[num])
          .mul(-1); // -func[i], потому что мы выражаем 1 переменную через другие, и при переносе знак меняется
      arrTable[beforeCount][last] = Fraction(table[beforeCount][last]).mul(
        func[num]
      ); // т.к. в выше мы все умножили на -1, но константа остается за =, поэтому её не умножаем на -1
      beforeCount++;
    } // Записываем свободные переменные в массив, чтобы потом их суммировать и получить mylittlepony[]
    else if (notBasis[newCount] !== undefined) {
      num = notBasis[newCount];
      for (let j = 0; j <= last; j++) {
        arrTable[beforeCount][j] = Fraction(0);
      }
      arrTable[beforeCount][newCount] = Fraction(func[num]);
      newCount++;
      beforeCount++;
    } else {
      for (let j = 0; j <= last; j++) {
        arrTable[i][j] = Fraction(0);
      }
    }
    num = -1;
  }
  return arrTable;
}

export function oneSimplex(
  simplexTable,
  allParams,
  step,
  pivotRow,
  pivotCol,
  pivotValue
) {
  let column = simplexTable[0].length;
  let lastCol = simplexTable[0].length - 1;
  let row = simplexTable.length;
  let lastRow = simplexTable.length - 1;

  let notMin = 9999;
  let rowMin = pivotRow,
    colMin = pivotCol;
  let min = Fraction(1).div(pivotValue);
  let pivot = pivotValue;
  let helperParam, helperNum;
  let coeff = [];
  let table = {};

  // костыль для выхода из цикла
  // if (min === 9999) {
  //   return table;
  // }

  // TODO: Если весь столбец <0, то функция неограничена снизу
  // for (let step = 0; ; step++) {
  // TODO: ДЕЛАТЬ КОПИИ МАССИВОВ ИЛИ НЕТ!??! ВОТ В ЧЕМ ВОПРОС
  // Ищем минимальное неотриц из всех
  let maybe = [];

  // Если выбрали ручной метод в первый раз, то формируем таблицу и выводим её
  if (step === 0) {
    for (let k = 0; k < lastCol; k++) {
      if (simplexTable[lastRow][k].s < 0) {
        for (let i = 0; i < lastRow; i++) {
          // TODO: Посмотреть что там с 0 в значениях и функциях
          if (simplexTable[i][k].s < 0 || simplexTable[i][k].n === 0) continue;
          notMin = Fraction(1).div(simplexTable[i][k]);
          maybe.push({
            row: i,
            column: k,
            value: simplexTable[i][k],
            min: notMin,
          });
          if (min > notMin) {
            rowMin = i;
            colMin = k;
            min = notMin;
            pivot = simplexTable[i][k];
          }
        }
      }
    }
    table = {
      simplexTable: JSON.parse(JSON.stringify(simplexTable)),
      step,
      f: -simplexTable[lastRow][lastCol],
      allParams: JSON.parse(JSON.stringify(allParams)),
      pivot: { rowMin, colMin },
      maybe,
    };
    return table;
  }

  for (let i = 0; i < row; i++) {
    coeff[i] = Fraction(simplexTable[i][colMin]);
  }
  // console.log("min", { simplexTable, rowMin, colMin, min, pivot });
  simplexTable[rowMin][colMin] = Fraction(min);
  // Меняем столбец
  for (let i = 0; i < row; i++) {
    if (i === rowMin) continue;
    simplexTable[i][colMin] = Fraction(simplexTable[i][colMin])
      .div(pivot)
      .mul(-1);
  }
  // Меняем строчку
  for (let i = 0; i < column; i++) {
    if (i === colMin) continue;
    simplexTable[rowMin][i] = Fraction(simplexTable[rowMin][i]).div(pivot);
  }

  // Меняем переменные (для отрисовки потом)
  // basises[]
  helperParam = allParams[0][rowMin].param;
  helperNum = allParams[0][rowMin].num;

  allParams[0][rowMin].param = allParams[1][colMin].param;
  allParams[0][rowMin].num = allParams[1][colMin].num;

  allParams[1][colMin].param = helperParam;
  allParams[1][colMin].num = helperNum;
  helperParam = -1;
  helperNum = -1;

  // console.log("Поменял столбец и строчку", {
  //   simplexTable,
  //   rowMin,
  //   colMin,
  //   min,
  //   pivot,
  // });
  // console.log(allParams);

  // Вычисляем строчки (но идем по столбцам, т.к. js плох в массивы или я туплю)
  for (let i = 0; i < row; i++) {
    if (i === rowMin) continue;
    for (let j = 0; j < column; j++) {
      if (j === colMin) continue;
      simplexTable[i][j] = Fraction(simplexTable[i][j]).sub(
        Fraction(coeff[i]).mul(simplexTable[rowMin][j])
      );
    }
  }
  maybe = [];

  // Если выбрали ручной метод в первый раз, то формируем таблицу и выводим её
  rowMin = -1;
  colMin = -1;
  for (let i = 0; i < simplexTable.length - 1; i++) {
    if (simplexTable[i][lastCol].s < 0) {
      alert("Введен недопустимый элемент, пожалуйста, выберите другой");
      throw new Error(
        "Введен недопустимый элемент, пожалуйста, выберите другой"
      );
    }
  }
  for (let k = 0; k < lastCol; k++) {
    if (simplexTable[lastRow][k].s < 0) {
      for (let i = 0; i < lastRow; i++) {
        // TODO: Посмотреть что там с 0 в значениях и функциях
        if (simplexTable[i][k].s < 0 || simplexTable[i][k].n === 0) continue;
        notMin = Fraction(1).div(simplexTable[i][k]);
        maybe.push({
          row: i,
          column: k,
          value: simplexTable[i][k],
          min: notMin,
        });
        if (min > notMin) {
          rowMin = i;
          colMin = k;
          min = notMin;
          pivot = simplexTable[i][k];
        }
      }
    }
  }
  table = {
    simplexTable: JSON.parse(JSON.stringify(simplexTable)),
    step,
    f: -simplexTable[lastRow][lastCol],
    allParams: JSON.parse(JSON.stringify(allParams)),
    pivot: { rowMin, colMin },
    maybe,
  };
  return table;
}
// }

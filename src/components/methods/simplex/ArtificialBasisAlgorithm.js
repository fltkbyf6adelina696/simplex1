import { setF, setSimplex } from "./simplexAlgorithm";
var Fraction = require("fraction.js");
export default function StartArtificialSolution(
  countVariables,
  func,
  countRestrictions,
  restrictions,
  minMax,
  added
) {
  let allParams = [[], []];
  console.log("added", added);
  // делаем таблицу искусственного базиса
  let artificialTable = [];
  let lastRowTable = [];
  restrictions.map((e) => artificialTable.push([...e]));
  // вычисляем последнюю строку для таблицы
  for (let i = 0; i < countVariables + 1; i++) {
    let columnSum = 0;
    for (let j = 0; j < countRestrictions; j++) {
      columnSum -= artificialTable[j][i];
    }
    lastRowTable.push(columnSum);
  }
  artificialTable.push(lastRowTable);
  // перевод в дробные
  for (let i = 0; i < artificialTable.length; i++)
    artificialTable[i] = artificialTable[i].map((el) => Fraction(el));

  //   let column = artificialTable[0].length;
  //   let lastCol = artificialTable[0].length - 1;
  //   let row = artificialTable.length;
  //   let lastRow = artificialTable.length - 1;

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
  console.log({ artificialTable, allParams });
  let tables = setArtificialBasis(artificialTable, allParams);
  func = changeFuncMinMax(func, minMax);
  let needSum = setAfterArtificial(
    tables[tables.length - 1].artificialTable,
    allParams,
    func,
    countVariables
  );
  let mylittlepony = setF(needSum);
  console.log("mylittlepony", mylittlepony);
  let goSimplexTable = JSON.parse(
    JSON.stringify(tables[tables.length - 1].artificialTable)
  );
  goSimplexTable.pop();
  goSimplexTable.push(mylittlepony);
  let simplexTable = setSimplex(goSimplexTable, allParams, countVariables);
  let artNsimplex = [];
  let simplexhelp = [];

  simplexhelp.push();
  artNsimplex.push(tables);
  artNsimplex.push(simplexTable);
  return artNsimplex;
}

export function changeFuncMinMax(func, minMax) {
  let arr = [];
  if (minMax === "max")
    for (let i = 0; i < func.length; i++) {
      arr[i] = -func[i];
    }
  else arr = [...func];
  return arr;
}

export function changeNegativeTable(table) {
  let last = table[0].length - 1;
  let arr = [];
  for (let i = 0; i < table.length - 1; i++) {
    for (let j = 0; j < table[0].length; j++) {
      if (table[i][last] < 0) {
        if (arr[i] === undefined) arr[i] = [];
        arr[i][j] = -table[i][j];
      } else {
        if (arr[i] === undefined) arr[i] = [];
        arr[i][j] = table[i][j];
      }
    }
  }
  arr[table.length - 1] = [];
  for (let i = 0; i < last + 1; i++)
    arr[table.length - 1][i] = table[table.length - 1][i];
  return arr;
}

function setArtificialBasis(artificialTable, allParams) {
  let column = artificialTable[0].length;
  let lastCol = artificialTable[0].length - 1;
  let row = artificialTable.length;
  let lastRow = artificialTable.length - 1;
  let min = Fraction(9999);
  let notMin = 9999;
  let rowMin = -1,
    colMin = -1;
  let pivot = Fraction(0);
  let helperParam, helperNum;
  let coeff = [];
  let allTables = [];

  // TODO: Если весь столбец <0, то функция неограничена снизу
  for (let step = 0; ; step++) {
    column = artificialTable[0].length;
    lastCol = artificialTable[0].length - 1;
    row = artificialTable.length;
    lastRow = artificialTable.length - 1;
    // TODO: ДЕЛАТЬ КОПИИ МАССИВОВ ИЛИ НЕТ!??! ВОТ В ЧЕМ ВОПРОС
    // Ищем минимальное неотриц из всех

    rowMin = -1;
    colMin = -1;
    for (let k = 0; k < lastCol; k++) {
      if (artificialTable[lastRow][k].s < 0) {
        for (let i = 0; i < lastRow; i++) {
          // TODO: Посмотреть что там с 0 в значениях и функциях
          if (artificialTable[i][k].s < 0 || artificialTable[i][k].n === 0)
            continue;
          notMin = Fraction(1).div(artificialTable[i][k]);
          if (min > notMin) {
            rowMin = i;
            colMin = k;
            min = notMin;
            pivot = artificialTable[i][k];
          }
        }
      }
    }
    // if (rowMin === -1)
    // let nullsum = 0;
    // for (let i = 0; i <= lastCol; i++) {
    //   nullsum += artificialTable[lastRow][i];
    // }
    allTables.push({
      artificialTable: JSON.parse(JSON.stringify(artificialTable)),
      step,
      f: -artificialTable[lastRow][lastCol],
      allParams: JSON.parse(JSON.stringify(allParams)),
      pivot: { rowMin, colMin },
    });
    if (step === row - 1 || rowMin === -1) {
      console.log("Конец искусственного базиса:", { allTables });
      return allTables;
    }
    for (let i = 0; i < row; i++) {
      coeff[i] = artificialTable[i][colMin];
    }
    console.log("min", { artificialTable, rowMin, colMin, min, pivot });
    artificialTable[rowMin][colMin] = Fraction(min);
    // Меняем столбец
    for (let i = 0; i < row; i++) {
      if (i === rowMin || pivot.n === 0) continue;
      artificialTable[i][colMin] = Fraction(artificialTable[i][colMin])
        .div(pivot)
        .mul(-1);
    }
    // Меняем строчку
    for (let i = 0; i < column; i++) {
      if (i === colMin || pivot.n === 0) continue;
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

    console.log("Поменял столбец и строчку", {
      artificialTable,
      rowMin,
      colMin,
      min,
      pivot,
    });
    console.log(allParams);

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
    for (let i = 0; i < row; i++) {
      artificialTable[i].splice(colMin, 1);
    }
    allParams[1].splice(colMin, 1);
    console.log("after splice:", { artificialTable });
    min = 9999;
  }
}

function setAfterArtificial(table, allParams, func, countVariables) {
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

var Fraction = require("fraction.js");
function diagonalize(M, A) {
  var m = M.length;
  var n = M[0].length;
  for (var k = 0; k < Math.min(m, n); ++k) {
    // Find the k-th pivot
    let i_max = findPivot(M, k);

    if (!A[i_max][k].n) {
      alert("Матрица вырождена и рождена свыше");
      return true;
    }
    swap_rows(M, k, i_max, A);
    // Do for all rows below pivot
    for (var i = k + 1; i < m; ++i) {
      // Do for all remaining elements in current row:
      var c = Fraction(A[i][k]).div(A[k][k]);
      for (var j = k + 1; j < n; ++j) {
        A[i][j] = Fraction(A[i][j]).sub(Fraction(A[k][j]).mul(c));
      }
      // Fill lower triangular matrix with zeros
      A[i][k] = Fraction(0);
    }
  }
}
function returnFraction(num) {
  if (num.n !== 0 || num.d !== null)
    return Fraction(num.n).div(num.d).mul(num.s).toString();
  else return 0;
}
function findPivot(M, k) {
  var i_max2 = k;
  for (var i = k + 1; i < M.length; ++i) {
    if (
      Math.abs(returnFraction(M[i][k])) > Math.abs(returnFraction(M[i_max2][k]))
    ) {
      i_max2 = i;
    }
  }
  return i_max2;
}

function swap_rows(M, i_max, k, A) {
  if (i_max !== k) {
    var temp = A[i_max];
    A[i_max] = A[k];
    A[k] = temp;
  }
}

function substitute(M) {
  var m = M.length;
  let n = M[0].length;
  for (let i = m - 1; i >= 0; i--) {
    let coeff = Fraction(M[i][i]);
    for (let k = 0; k < n; k++)
      if (!!M[i][k]) {
        M[i][k] = Fraction(M[i][k]).div(coeff);
      }
  }
  for (var i = m - 1; i >= 0; --i) {
    for (var j = i - 1; j >= 0; --j) {
      var x = Fraction(M[j][i]).div(M[i][i]);
      for (let k = 0; k < n; k++) {
        M[j][k] = Fraction(M[j][k]).sub(Fraction(M[i][k]).mul(x));
      }
    }
  }
  return M;
}

function extractX(A) {
  var x = [];
  var m = A.length;
  var n = A[0].length;
  for (var i = 0; i < m; ++i) {
    x.push(Fraction(A[i][n - 1]));
  }
  return x;
}
function toFixedNumber(A) {
  for (let i = 0; i < A.length; i++)
    for (let j = 0; j < A[0].length; j++) {
      A[i][j] = Fraction(A[i][j]);
    }
  return A;
}

export default function GaussSolution(A) {
  // print(A, "A");
  if (A[0].length < A.length) {
    alert("Введите нормальный массив");
    throw new Error("Введите нормальный массив");
  }
  for (let i = 0; i < A.length; i++)
    A[i] = A[i].map((el) => (el = Fraction(el)));
  let error = diagonalize(A, A);
  if (error) return false;
  //print(A, "diag");
  let res = substitute(A);
  // print(A, "subst");
  extractX(A);
  res = toFixedNumber(res);
  // print(res, "RES")
  // print(x, "x");
  return res;
}

// sample from: http://mathworld.wolfram.com/GaussianElimination.html

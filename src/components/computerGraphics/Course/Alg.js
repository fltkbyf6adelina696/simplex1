let points1 = [];
let points2 = [];
let context;
let c1;
export function setCanvases(new_context) {
  context = new_context;
}

export default function printFirst(points, coef) {
  points1 = points;
  print(points1);
}

export function printSecond(points) {
  points2 = points;
  print(points2);
}

function finish(polygon, dot) {
  let c1_1 = center(polygon);
  let help = [];
  polygon.map((p) =>
    help.push({
      x: p.x + dist2dot(dot, c1_1).x,
      y: p.y + dist2dot(dot, c1_1).y,
    })
  );
  return print(help);
}

function divide2(polygon, coef) {
  let c2 = center(polygon);
  let poly = [];
  let little2 = [];
  polygon.map((p) =>
    poly.push({
      x: p.x * (coef / 100),
      y: p.y * (coef / 100),
    })
  );
  // print(poly);

  let c2_1 = center(poly);
  poly.map((p) => {
    let help = {
      x: dist2dot(c2, c1).x * (coef / 100),
      y: dist2dot(c2, c1).y * (coef / 100),
    };
    little2.push({
      x: p.x + sum(dist2dot(c1, c2_1), help).x,
      y: p.y + sum(dist2dot(c1, c2_1), help).y,
    });
    // little2.push({
    //   x: p.x + help.x,
    //   y: p.y + help.y,
    // });
    return p;
  });
  return little2;
}

function sum(p1, p2) {
  return { x: p1.x + p2.x, y: p1.y + p2.y };
}
// маленький полигон
function divide(polygon, coef) {
  c1 = center(polygon);
  let poly = [];
  let newCoords = [];
  polygon.map((p) =>
    poly.push({
      x: p.x * (coef / 100),
      y: p.y * (coef / 100),
    })
  );
  // print(poly);
  let c1_1 = center(poly);
  polygon.map((p) =>
    newCoords.push({
      x: p.x * (coef / 100) + dist2dot(c1, c1_1).x,
      y: p.y * (coef / 100) + dist2dot(c1, c1_1).y,
    })
  );
  return newCoords;
}

function print(poly) {
  for (let i = 0; i < poly.length; i++) {
    if (i === poly.length - 1) {
      line(poly[i], poly[0]);
    } else {
      line(poly[i], poly[i + 1]);
    }
  }
}

function print2(poly2, poly1, repeat) {
  for (let i = 0; i < poly2.length; i++) {
    if (i === poly2.length - 1) {
      line2(poly2[i], poly2[0], poly1, repeat);
    } else {
      line2(poly2[i], poly2[i + 1], poly1, repeat);
    }
  }
}

function center(polygon) {
  let c = { x: 0, y: 0 };
  polygon.map((p) => {
    c.x += p.x;
    c.y += p.y;
    return p;
  });
  c.x = c.x / polygon.length;
  c.y = c.y / polygon.length;
  return c;
}

function dist2dot(p1, p2) {
  return { x: p1.x - p2.x, y: p1.y - p2.y };
}

function dist(p) {
  return Math.sqrt(p.x * p.x + p.y * p.y);
}

function minDot(polygon) {
  let c = { x: polygon[0].x, y: polygon[0].y };
  let idx = 0;
  polygon.map((p, index) => {
    if (dist(p) < dist(c)) {
      c = p;
      idx = index;
    }
    return p;
  });

  let newpol = polygon.slice(idx);
  newpol.push(...polygon.slice(0, idx));
  return newpol;
}

function setPixel(x, y) {
  let p = context.createImageData(1, 1);
  p.data[0] = 0;
  p.data[1] = 0;
  p.data[2] = 0;
  p.data[3] = 255;
  context.putImageData(p, x, y);
}
export function interpol(coef, repeat, only2, only) {
  if (only2) {
    c1 = center(points1);
    let arr2 = minDot(points2);
    print(divide2(arr2, coef));
  } else if (only) {
    let arr1 = minDot(points2);
    print(divide(arr1, coef));
  } else {
    let arr1 = minDot(points1);
    arr1 = divide(arr1, 100 - coef);
    let arr2 = minDot(points2);
    arr2 = divide2(arr2, coef);
    print2(arr2, arr1, repeat);
  }
}

// Линия брезенхема
function line(p1, p2) {
  let x = Math.floor(p1.x);
  let y = Math.floor(p1.y);
  let x1 = Math.floor(p2.x);
  let y1 = Math.floor(p2.y);

  var dx = Math.abs(x1 - x);
  var dy = Math.abs(y1 - y);
  var sx = x < x1 ? 1 : -1;
  var sy = y < y1 ? 1 : -1;
  var delta = dx - dy;

  while (true) {
    setPixel(x, y);
    if (x === x1 && y === y1) break;
    let e2 = 2 * delta;
    if (e2 > -dy) {
      delta -= dy;
      x += sx;
    }
    if (e2 < dx) {
      delta += dx;
      y += sy;
    }
  }
}

function line2(p1, p2, poly, repeat) {
  let x = Math.floor(p1.x);
  let y = Math.floor(p1.y);
  let x1 = Math.floor(p2.x);
  let y1 = Math.floor(p2.y);

  var dx = Math.abs(x1 - x);
  var dy = Math.abs(y1 - y);
  var sx = x < x1 ? 1 : -1;
  var sy = y < y1 ? 1 : -1;
  var delta = dx - dy;
  let i = 0;

  while (true) {
    setPixel(x, y);
    if (i % repeat === 0) finish(poly, { x, y });
    if (x === x1 && y === y1) break;
    let e2 = 2 * delta;
    if (e2 > -dy) {
      delta -= dy;
      x += sx;
    }
    if (e2 < dx) {
      delta += dx;
      y += sy;
    }
    i++;
  }
}

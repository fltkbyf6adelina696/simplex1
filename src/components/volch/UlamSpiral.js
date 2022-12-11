import React, { useEffect, useState } from "react";
import "./ulamSpiral.css";

export default function UlamSpiral() {
  var CANVAS_SIZE = 400;
  var primeList = [];
  const [scale, setScale] = useState(2);
  const [primeMax, setPrimeMax] = useState(100000);
  useEffect(() => {
    console.log({ scale, primeMax });
    redraw();
    recalc();
  });

  //   function generatePrimes() {
  //     // quick set of primes via sieve of Eratosthenes
  //     // works but horrible with memory consumption
  //     var primes = [];
  //     var numbers = [];
  //     for (var i = 2; i < primeMax; i++) {
  //       numbers.push(i);
  //     }
  //     while (numbers.length > 0) {
  //       var prime = numbers.shift();
  //       primes.push(prime);
  //       numbers = numbers.filter(function (elm) {
  //         return elm % prime !== 0;
  //       });
  //     }
  //     return primes;
  //   }

  function generatePrimesOptimized() {
    // optimized version of Eratosthenes, purdy
    var numbers = Array(Math.ceil(primeMax / 32));
    for (var i = 0; i < numbers.length; i++) {
      numbers[i] = -1;
    }
    // drop the first two numbers, 0 and 1, obviously not prime
    numbers[0] &= -1 << 2;
    for (i = 2; i < primeMax; i++) {
      // check if i is prime, no need to loop if it isnt
      var pos = parseInt(i / 32);
      var entry = i % 32;
      var bit = (numbers[pos] & (0x1 << entry)) >> entry;
      if (bit !== 0) {
        // go to each multiple of i and remove it from the list
        for (var j = i + i; j < primeMax; j += i) {
          pos = parseInt(j / 32);
          entry = j % 32;
          // check if j is prime, if not mark it not prime
          if (j % i === 0) {
            // build mask
            var mask = -1 << entry;
            var num = numbers[pos];
            num = (num & (mask << 1)) | (num & ~mask);
            numbers[pos] = num;
          }
        }
      }
    }
    var primes = [];
    for (i = 2; i < primeMax; i++) {
      pos = parseInt(i / 32);
      entry = i % 32;
      // check if prime
      num = numbers[pos];
      bit = (num & (0x1 << entry)) >> entry;
      if (bit === 0x1 || bit === -1) {
        primes.push(i);
      }
    }
    return primes;
  }

  function recalc() {
    // primeMax = parseInt(document.getElementById("primeMax").value);
    CANVAS_SIZE = parseInt(Math.sqrt(primeMax)) + 1;
    primeList = generatePrimesOptimized();
    redraw();
  }

  function redraw() {
    // scale = parseInt(document.getElementById("scale").value);
    var canvas = document.getElementById("theCanvas");
    var ctx = canvas.getContext("2d");
    canvas.setAttribute("width", CANVAS_SIZE * scale);
    canvas.setAttribute("height", CANVAS_SIZE * scale);
    canvas.style.width = CANVAS_SIZE * scale + "px";
    canvas.style.height = CANVAS_SIZE * scale + "px";
    var center = (CANVAS_SIZE / 2) * scale;
    drawSpiral(ctx, center, center);
  }

  function drawSpiral(ctx, x, y) {
    var values = primeList;
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, scale, scale);
    ctx.fillStyle = "black";
    var num = 1;
    var steps = 0;
    var level = 1;
    var dir = 3; // 0 up, 1 left, 2 down, 3 right
    var i = 0;
    while (i < values.length) {
      if (num === values[i]) {
        ctx.fillRect(x, y, scale, scale);
        i++;
      }
      // if sqrt(num) is integer and odd, I.E. mod 2 === 1, then i need to go 1 right and the level is the sqrt + 2, direction up
      // figure out next direction
      if (Math.sqrt(num) % 2 === 1) {
        // go right
        x += scale;
        // setup next level stuff
        level = Math.sqrt(num) + 2;
        steps = 0;
        dir = 0;
      } else {
        var changeAt = level - 1;
        switch (dir) {
          case 0:
            y -= scale;
            changeAt = level - 2;
            break;
          case 1:
            x -= scale;
            break;
          case 2:
            y += scale;
            break;
          case 3:
            x += scale;
            break;
          default:
            break;
        }
        steps++;
        if (steps === changeAt) {
          dir = (dir + 1) % 4;
          steps = 0;
        }
      }
      num++;
    }
  }

  return (
    <div>
      <h1>Скатерть Улама</h1>
      <div id="controls">
        <label>
          Числа до (от 1000 до 200000):{" "}
          <input
            onChange={(e) => {
              setPrimeMax(e.target.value);
              recalc();
            }}
            id="primeMax"
            type="range"
            min="1000"
            max="200000"
            value={primeMax}
            steps="1000"
          />
        </label>
        <label>
          Масштаб:{" "}
          <input
            onChange={(e) => {
              setScale(parseInt(e.target.value));
              redraw();
            }}
            id="scale"
            type="range"
            min="1"
            max="20"
            value={scale}
          />
        </label>
      </div>
      <canvas id="theCanvas" width="400" height="400"></canvas>
    </div>
  );
}

import React, { useRef, useEffect } from "react";
import BresenhamLine, { setCanvases, BresenhamCircle, DDA } from "./Algorithms";
function Canvas(props) {
  const canvasRef = useRef(null);
  let canvas, context;
  let x, x1, y, y1;

  function mouseDown(e) {
    console.log("mouseDouwn", e);
    console.log("POPROP", props);
    var rect = canvas.getBoundingClientRect();
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }

  function mouseUp(e) {
    console.log("mouseUp", e);
    var rect = canvas.getBoundingClientRect();
    x1 = e.clientX - rect.left;
    y1 = e.clientY - rect.top;
    //TODO: Надо переместить рендер, чтобы рендерилось в прямом эфире
    PrintLinearAndCicrcles(x, y, x1, y1, props.alg);
  }

  function PrintLinearAndCicrcles(x, y, x1, y1, alg) {
    switch (alg) {
      case "dda":
        DDA(x, y, x1, y1);
        break;
      case "brez":
        BresenhamLine(x, y, x1, y1);
        break;
      case "brez_circle":
        let r = Math.sqrt((x1 - x) ** 2 + (y1 - y) ** 2);
        BresenhamCircle(x, y, r);
        break;
      default:
        alert("wooops");
    }
  }

  useEffect(() => {
    canvas = canvasRef.current;
    context = canvas.getContext("2d");
    setCanvases(context);
    canvas.width = 700;
    canvas.height = 500;
    canvas.style = "border:1px solid #000000";
    console.log(canvas);
    //Our draw come here
  }, []);

  return (
    <canvas
      onMouseDown={mouseDown}
      onMouseUp={mouseUp}
      ref={canvasRef}
      {...props}
    />
  );
}

export default Canvas;

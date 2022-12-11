import React, { useRef, useEffect, useState } from "react";
import {
  Row,
  Col,
  Radio,
  Space,
  InputNumber,
  Typography,
  Checkbox,
} from "antd";
import printFirst, { interpol, printSecond, setCanvases } from "./Alg";

function Page() {
  const [canvas, setCanvas] = useState(null);
  const [context, setContext] = useState(null);
  const value = useRef("first");
  const first = useRef(4);
  const second = useRef(4);
  const repeat = useRef(50);
  const canvasRef = useRef(null);
  const only = useRef(false);
  const only2 = useRef(false);
  let points = [];

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    value.current = e.target.value;
  };
  const onChangeCheck = (e) => {
    only.current = e.target.checked;
  };
  const onChangeCheck2 = (e) => {
    only2.current = e.target.checked;
  };

  const changeFirst = (e) => {
    first.current = e;
  };
  const changeRepeat = (e) => {
    repeat.current = e;
  };

  const changeSecond = (e) => {
    second.current = e;
  };

  const changeDivide = (e) => {
    console.log("Change value divide", e);
    interpol(e, repeat.current, only.current, only2.current);
  };

  function mouseDown(e) {
    console.log("mouseDouwn", e);
    // check()
    var rect = canvas.getBoundingClientRect();
    points[points.length] = {};
    points[points.length - 1].x = Math.floor(e.clientX - rect.left);
    points[points.length - 1].y = Math.floor(e.clientY - rect.top);
    console.log("points length", points.length);
    console.log({ points, first, second });
  }

  function mouseUp(e) {
    if (points.length === first.current && value.current === "first") {
      printFirst(points);
      points = [];
      first.current = 0;
      console.log({ points, first, second });
    } else if (points.length === second.current && value.current === "second") {
      printSecond(points);
      points = [];
      second.current = 0;
      console.log({ points, first, second });
    }
  }

  useEffect(() => {
    canvasRef.current.width = 700;
    canvasRef.current.height = 500;
    canvasRef.current.style = "border:1px solid #000000";
    setCanvas(canvasRef.current);
    setContext(canvasRef.current.getContext("2d"));
    setCanvases(context);
  }, [canvas, context]);

  return (
    <Row>
      <Col span={18} push={6}>
        <canvas onMouseDown={mouseDown} onMouseUp={mouseUp} ref={canvasRef} />
      </Col>
      <Col span={6} pull={18}>
        <Space direction="vertical">
          <Typography.Title>Курсовая</Typography.Title>
          <Radio.Group
            onChange={onChange}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="first">Многоугольник 1</Radio.Button>
            <Radio.Button value="second">Многоугольник 2</Radio.Button>
          </Radio.Group>
          Количество углов 1
          <InputNumber
            min={2}
            max={15}
            defaultValue={4}
            onChange={changeFirst}
          />
          Количество углов 2
          <InputNumber
            min={2}
            max={15}
            defaultValue={4}
            onChange={changeSecond}
          />
          t (от 1 до 100)
          <InputNumber
            min={1}
            max={100}
            defaultValue={50}
            onChange={changeDivide}
          />
          Как часто рисовать интерполяцию (чем меньше значение, чем дольше
          прорисовывается)
          <InputNumber min={1} defaultValue={50} onChange={changeRepeat} />
          <Checkbox onChange={onChangeCheck2}>
            Рисовать только 1 Многоугольник
          </Checkbox>
          <Checkbox onChange={onChangeCheck}>
            Рисовать только 2 Многоугольник
          </Checkbox>
        </Space>
      </Col>
    </Row>
  );
}

export default Page;

import React, { useRef, useState } from "react";
import "../simplex.css";
import { Button, Form, InputNumber, Select } from "antd";
import startSolution from "./simplexAlgorithm";
import Title from "antd/lib/typography/Title";
import { ExperimentOutlined, HighlightOutlined } from "@ant-design/icons";
import Checkbox from "antd/lib/checkbox/Checkbox";
import FirstSimplex from "./ManualSimplex";

const { Option } = Select;

function SimplexInput(props) {
  const [countVariables, setCountVariables] = useState(4);
  const [countRestrictions, setCountRestrictions] = useState(2);
  const [minMax, setMinMax] = useState("min");
  const [func, setFunc] = useState([]);
  const [restrictions, setRestrictions] = useState([]);
  const [wInputs, setWIntputs] = useState(70);
  const [basises, setBasises] = useState([]);
  const helpBasises = useRef([]);
  let tags = [];
  let restr = [];
  let r = [];
  let table = [];
  function onStartSolution(param) {
    preCase();
    props.setSimplexTable([]);
    switch (param) {
      case "auto":
        let copy = JSON.parse(
          JSON.stringify(
            startSolution(
              countVariables,
              func,
              countRestrictions,
              restrictions,
              minMax,
              helpBasises.current
            )
          )
        );

        props.setSimplexTable([...copy]);
        props.setManualSimplexTable([]);
        break;
      case "manual":
        let history = JSON.parse(
          JSON.stringify(
            // тут надо ручное
            FirstSimplex(
              countVariables,
              func,
              countRestrictions,
              restrictions,
              minMax,
              helpBasises.current
            )
          )
        );
        props.setManualSimplexTable([...history]);
        break;
      default:
        props.setSimplexTable([]);
        props.setManualSimplexTable([]);
        break;
    }
  }

  function preCase() {
    for (let i = 0; i < countRestrictions; i++) {
      for (let j = 0; j < countVariables + 1; j++) {
        if (!restrictions[i]) restrictions[i] = [];

        if (!restrictions[i][j]) restrictions[i][j] = 0;
      }
    }

    for (let i = 0; i < countVariables; i++) {
      if (!func[i]) func[i] = 0;
    }
    // нет ререндера, но все работает ЧОТКО
    // TODO: надо пофиксить баг с тем, что после выбора последнего элемента и повторного нажатия он не попадает в массив базисных
    if (helpBasises.current !== undefined) {
      if (helpBasises.current.length !== 0)
        setBasises(helpBasises.current.slice(0, countVariables - 1));
    } else {
      alert("Выберите базисные переменные");
      throw new Error("Выберите базисные переменные");
    }

    for (let i = 0; i < countVariables; i++) {
      helpBasises.current[i] = !helpBasises.current[i] ? false : true;
    }
    console.log("basiseeees:", helpBasises.current);
    return;
  }

  function addRestrictions(i, j, value) {
    let arr = restrictions;
    if (!arr[i]) arr[i] = [];
    arr[i][j] = value;
    setRestrictions([...arr]);
  }

  function funcRestrictions() {
    for (let i = 1; i <= countVariables; i++) {
      restr.push(
        <th>
          x<sub>{i}</sub>
        </th>
      );
    }
    restr.push(<th>=</th>);
    restr.push(<th>b</th>);
    table.push(<tr style={{ textAlign: "center" }}>{restr}</tr>);
    for (let i = 1; i <= countRestrictions; i++) {
      // TODO: Надо пофикисить баг с изменением количества переменных и исчезают на морде числа, а массив остается
      for (let j = 1; j <= countVariables + 1; j++) {
        r.push(
          j !== countVariables + 1 ? (
            <td>
              <InputNumber
                style={{ maxWidth: wInputs }}
                defaultValue={0}
                onChange={(e) => {
                  addRestrictions(i - 1, j - 1, e);
                }}
              />
            </td>
          ) : (
            <>
              <td>=</td>
              <td>
                <InputNumber
                  style={{ maxWidth: wInputs }}
                  defaultValue={0}
                  onChange={(e) => {
                    console.log(e);
                    addRestrictions(i - 1, j - 1, e);
                  }}
                />
              </td>
            </>
          )
        );
      }
      table.push(<tr>{[...r]}</tr>);
      r.splice(0);
    }
    return <table>{table}</table>;
  }

  function addFunc(key, value) {
    let arr = func;
    arr[key] = value;
    setFunc([...arr]);
  }

  function intFunc() {
    for (let i = 1; i <= countVariables; i++) {
      tags.push(
        <>
          <InputNumber
            style={{ maxWidth: 40 }}
            defaultValue={0}
            key={i}
            onChange={(e) => addFunc(i - 1, e)}
          />{" "}
          x<sub>{i}</sub>
          {i !== countVariables ? "+" : "->"}
        </>
      );
    }
    tags.push(
      <Select
        style={{ width: 70 }}
        defaultValue="min"
        onChange={(e) => setMinMax(e)}
      >
        <Option value="min">min</Option>
        <Option value="max">max</Option>
      </Select>
    );
    return tags;
  }

  function addArrayBasis(i, value) {
    // let old = helpBasises.current;
    // console.log("old: ", old);
    // old[i] = value;
    // helpBasises.current = old;
    helpBasises.current[i] = value;
    setBasises([...basises]);
    console.log("basises:", helpBasises.current);
  }

  function onBasis() {
    // TODO: Сделать проверку на добавление > допустимого (ставить везде disable)
    let basises = [];
    for (let i = 0; i < countVariables; i++) {
      basises.push(
        <Checkbox onChange={(e) => addArrayBasis(i, e.target.checked)}>
          <Title level={4}>
            x <sub> {i + 1} </sub>
          </Title>
        </Checkbox>
      );
    }
    return basises;
  }

  return (
    <div>
      <Form layout="vertical">
        <Form.Item>
          <Form.Item
            label="Переменные"
            name="countVariables"
            style={{ display: "inline-block" }}
          >
            <InputNumber
              min="2"
              max="16"
              defaultValue={4}
              onChange={(e) => setCountVariables(e)}
              // style={{maxWidth:"50px"}}
            />
          </Form.Item>
          <Form.Item
            label="Ограничения"
            name="countRestrictions"
            style={{ display: "inline-block", marginLeft: " 8px" }}
          >
            <InputNumber
              min="2"
              max="16"
              defaultValue={2}
              onChange={(e) => setCountRestrictions(e)}
              // style={{maxWidth:"50px"}}
            />
          </Form.Item>
          <Form.Item
            label="Размер окон ввода: "
            style={{ display: "inline-block", marginLeft: " 8px" }}
          >
            <InputNumber
              min="40"
              max="90"
              defaultValue={wInputs}
              onChange={(e) => setWIntputs(e)}
              style={{ maxWidth: "60px" }}
            />
          </Form.Item>
        </Form.Item>

        <Form.Item label="Введите целевую функцию:">
          <Title level={4}> f(x) = {intFunc()} </Title>
        </Form.Item>

        <Form.Item label="Выберите базисные переменные:">{onBasis()}</Form.Item>

        <Form.Item
          label="Введите ограничения:"
          style={{ display: "inline-block" }}
        >
          <Title level={4}>{funcRestrictions()}</Title>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            onClick={(e) => onStartSolution("auto")}
            icon={<ExperimentOutlined />}
          >
            Автоматическое решение
          </Button>

          <Button
            type="primary"
            onClick={(e) => onStartSolution("manual")}
            icon={<HighlightOutlined />}
            style={{ marginLeft: "8px" }}
          >
            Ручное решение
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default SimplexInput;

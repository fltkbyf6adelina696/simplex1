import React, { useRef, useState } from "react";
import "../simplex.css";
import { Button, Form, InputNumber, Select } from "antd";
import startSolution from "./simplexAlgorithm";
import Title from "antd/lib/typography/Title";
import { ExperimentOutlined, HighlightOutlined } from "@ant-design/icons";
import Checkbox from "antd/lib/checkbox/Checkbox";
import FirstSimplex from "./ManualSimplex";
function Transport() {
  
return (
  <Form.Item
  label="Ограничения"
  name="countRestrictions"
  
>
  
</Form.Item>
);

}
export default Transport;
import { Button, Result } from "antd";
import React from "react";
import { Link } from "react-router-dom";

export default function Dev() {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Извините, этот раздел находится в разработке."
      
    />
  );
}

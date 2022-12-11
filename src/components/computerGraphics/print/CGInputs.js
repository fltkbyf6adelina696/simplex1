import React from "react";
import { Radio, Space } from "antd";

export default function CGInputs(props) {
  const { setValue } = props;

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  return (
    <>
      <Space direction="vertical">
        <h3>Линии</h3>
        <Radio.Group
          onChange={onChange}
          optionType="button"
          buttonStyle="solid"
          defaultValue="brez"
        >
          <Radio.Button value="dda">DDA</Radio.Button>
          <Radio.Button value="brez">Брезенхем</Radio.Button>
          <Radio.Button value="nonz">Не целый (хз)</Radio.Button>
        </Radio.Group>

        <h3>Круг</h3>
        <Radio.Group
          onChange={onChange}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio.Button value="brez_circle">Брезенхем</Radio.Button>
        </Radio.Group>

        <h3>Безье</h3>
        <Radio.Group
          onChange={onChange}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio.Button value="direct_method">Прямой метод</Radio.Button>
          <Radio.Button value="slpit_method">Метод разбиения</Radio.Button>
        </Radio.Group>

        <h3>Отсечение отрезков</h3>
        <Radio.Group
          onChange={onChange}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio.Button value="saz_koen">Саasdasdзерленд-Коэн</Radio.Button>
          <Radio.Button value="middle_dot">Средняя точка</Radio.Button>
          <Radio.Button value="citrus">Кsadasирус-Бек</Radio.Button>
        </Radio.Group>
      </Space>

      {/* <div>
                <input type="radio" id="dda" name="dda" value=""/>
                <label for="dda"> DDA</label>
            </div>
            <div>
                <input type="radio" id="dewey" name="drone" value="dewey"/>
                <label for="dewey">Dewey</label>
            </div>

            <div>
                <input type="radio" id="louie" name="drone" value="louie"/>
                <label for="louie">Louie</label>
            </div> */}
    </>
  );
}

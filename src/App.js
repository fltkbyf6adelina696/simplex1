import "antd/dist/antd.css";
import "./help.css";
import { Layout, Menu, Breadcrumb } from "antd";

import {
  QuestionOutlined,
  RightOutlined,
  LeftOutlined,
  AppstoreAddOutlined,
  TableOutlined,
  AreaChartOutlined,
  DotChartOutlined,
  FireOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import MenuItem from "antd/lib/menu/MenuItem";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Link,
  useRouteMatch,
  Redirect,
} from "react-router-dom";
import Simplex from "./components/methods/simplex/Simplex";
import ArtificialBasis from "./components/methods/simplex/ArtificialBasis";
import Transport from "./components/methods/simplex/Transport";
import Dev from "./components/Dev";
import Page from "./components/computerGraphics/Course/Page";
import UlamSpiral from "./components/volch/UlamSpiral";

const { Header, Content, Footer, Sider } = Layout;

function App() {
  return (
    <Router>
      <Layout>
     

        <Switch>
          <Route path="/optimizationmethods">
            <MethodOptimize />
          </Route>
          <Route path="/courseiterpol">
            <ComputerGraphics />
          </Route>
          <Route path="/mpea">
            <UlamSpiral />
          </Route>
          <Route>
            <Redirect to="/optimizationmethods"></Redirect>
          </Route>
        </Switch>
        
      </Layout>
    </Router>
  );
}

function ComputerGraphics() {
  let match = useRouteMatch();
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed(!collapsed);

  return (
    <Content style={{ padding: "0 50px" }}>
      <Layout className="site-layout-background" style={{ padding: "24px 0" }}>
        <Sider
          collapsed={collapsed}
          className="site-layout-background"
          width={265}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={["0"]}
            style={{ height: "100%" }}
          >
            {collapsed ? (
              <Menu.Item
                className="trigger"
                onClick={toggle}
                icon={<RightOutlined />}
              />
            ) : (
              <MenuItem
                className="trigger"
                onClick={toggle}
                icon={<LeftOutlined />}
              />
            )}
           
          </Menu>
        </Sider>
        <Content style={{ padding: "0 24px", minHeight: "75vh" }}>
          <Switch>
            <Route exact path={`${match.url}/dashboard`}>
              {/* <CGPage /> */}
              <Page />
            </Route>
            <Route exact path={`${match.url}/help`}>
              <Dev />
            </Route>
          </Switch>
        </Content>
      </Layout>
    </Content>
  );
}

function MethodOptimize() {
  let match = useRouteMatch();
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed(!collapsed);

  return (
    <Content style={{ padding: "0 50px" }}>
     
      <Layout className="site-layout-background" style={{ padding: "24px 0" }}>
        <Sider
          collapsed={collapsed}
          className="site-layout-background"
          width={265}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={["0"]}
            style={{ height: "100%" }}
          >
            {collapsed ? (
              <Menu.Item
                className="trigger"
                onClick={toggle}
                icon={<RightOutlined />}
              />
            ) : (
              <MenuItem
                className="trigger"
                onClick={toggle}
                
              />
            )}
            <Menu.Item key="1">
              <Link to={`${match.url}/artificial`}>
                {" "}
                Метод искусственного базиса
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to={`${match.url}/simplex`}> Симплекс метод </Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to={`${match.url}/transport`}> Транспортная задача </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ padding: "0 24px", minHeight: "75vh" }}>
          <Switch>
            <Route exact path={`${match.url}/artificial`}>
              <ArtificialBasis />
            </Route>
            <Route exact path={`${match.url}/simplex`}>
              <Simplex />
            </Route>
            <Route exact path={`${match.url}/transport`}>
              <Transport />
            </Route>
          </Switch>
        </Content>
      </Layout>
    </Content>
  );
}

export default App;

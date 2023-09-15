/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Container, Navbar, Row, Col } from "react-bootstrap";
import DeviceForm from "./components/DeviceForm";
import DeviceFormList from "./components/DeviceFormList";
import "./App.css";
import Navbars from "./components/Navbars";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import AssignDevice from "./components/AssignDevice";
import EmployeeList from "./components/EmployeeList";

function App() {
  const [deviceId, setDeviceId] = useState("");

  const getDeviceIdHandler = (id) => {
    console.log("The ID of document to be edited: ", id);
    setDeviceId(id);
  };
  return (
    <>
      <Router>
        <Navbars />

        <Switch>
          <Route exact path="/">
            <DeviceForm id={deviceId} setDeviceId={setDeviceId} />
            <Container>
              <Row>
                <Col>
                  <DeviceFormList getDeviceId={getDeviceIdHandler} />
                </Col>
              </Row>
            </Container>
          </Route>
          <Route exact path="/employeepage">
            <EmployeeList />
          </Route>
          <Route exact path="/assignpage">
            <AssignDevice />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;

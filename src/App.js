/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Container, Navbar, Row, Col } from "react-bootstrap";
import DeviceForm from "./components/DeviceForm";
import DeviceFormList from "./components/DeviceFormList";
import "./App.css";
import Navbars from "./components/Navbars";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import AssignDevice from "./components/AssignDevice";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeFormList from "./components/EmployeeFormList";
import AssignDeviceList from "./components/AssignDeviceList";

function App() {
  const [deviceId, setDeviceId] = useState("");

  const [assigndevices, setassignDevices] = useState([]);
  // const [assignemployess, setassignEmployess] = useState([]);

  const getDeviceIdHandler = (id) => {
    console.log("The ID of document to be edited: ", id);
    setDeviceId(id);
  };

  const [employeeId, setEmployeeId] = useState("");

  const getEmployeeIdHandler = (id) => {
    console.log("The ID of document to be edited: ", id);
    setEmployeeId(id);
  };

  const [assigndeviceId, setAssignDeviceId] = useState("");

  const getAssignDeviceIdHandler = (id) => {
    console.log("The ID of document to be edited: ", id);
    setAssignDeviceId(id);
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
            <EmployeeForm id={employeeId} setEmployeeId={setEmployeeId} />
            <Container>
              <Row>
                <Col>
                  <EmployeeFormList getEmployeeId={getEmployeeIdHandler} />
                </Col>
              </Row>
            </Container>
          </Route>
          <Route exact path="/assignpage">
            <AssignDevice
              id={assigndeviceId}
              setAssignDeviceId={setAssignDeviceId}
              assigndevices={assigndevices}
              // assignemployess={assignemployess}
            />
            <Container>
              <Row>
                <Col>
                  <AssignDeviceList
                    assigndevices={assigndevices}
                    // assignemployess={assignemployess}
                    // setassignEmployess={setassignEmployess}
                    setassignDevices={setassignDevices}
                    getAssignDeviceId={getAssignDeviceIdHandler}
                  />
                </Col>
              </Row>
            </Container>
            {/* <AssignDevice /> */}
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;

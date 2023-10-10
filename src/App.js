/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Container, Navbar, Row, Col } from "react-bootstrap";
import DeviceForm from "./components/DeviceForm";
import DeviceFormList from "./components/DeviceFormList";
import "./App.css";
import Navbars from "./components/Navbars";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import AssignDevice from "./components/AssignDevice";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeFormList from "./components/EmployeeFormList";
import AssignDeviceList from "./components/AssignDeviceList";
import Login from "./components/Login";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";

const PrivateRoute = ({ children, ...rest }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading state
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false); // Set loading to false once Firebase auth is checked
    });

    return unsubscribe;
  }, []);
  // const Loader = () => {
  //   return (
  //     <div className="loader-containers">
  //       <div className="loader"></div>
  //     </div>
  //   );
  // };

  if (loading) {
    return;
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
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
        <Route exact path="/">
          <Login />
        </Route>

        <Switch>
          <PrivateRoute path="/devicepage">
            <DeviceForm id={deviceId} setDeviceId={setDeviceId} />
            <Container>
              <Row>
                <Col>
                  <DeviceFormList getDeviceId={getDeviceIdHandler} />
                </Col>
              </Row>
            </Container>
          </PrivateRoute>
          <PrivateRoute path="/employeepage">
            <EmployeeForm id={employeeId} setEmployeeId={setEmployeeId} />
            <Container>
              <Row>
                <Col>
                  <EmployeeFormList getEmployeeId={getEmployeeIdHandler} />
                </Col>
              </Row>
            </Container>
          </PrivateRoute>
          <PrivateRoute path="/assignpage">
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
          </PrivateRoute>
        </Switch>
      </Router>
    </>
  );
}

export default App;

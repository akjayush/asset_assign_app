import React, { useEffect, useState } from "react";
import { Form, Alert, Button, ButtonGroup } from "react-bootstrap";
import DeviceDataService from "../services/device.services";
import EmployeeDataService from "../services/employee.service";
import AssignDeviceDataService from "../services/assign.services";

const AssignDevice = ({
  getDeviceId,
  getEmployeeId,
  id,
  setAssignDeviceId,
  assigndevices,
}) => {
  const [selectdevice, setselectDevice] = useState();
  const [selectuser, setselectUser] = useState();
  const [status, setStatus] = useState("Assigned");
  const [flag, setFlag] = useState(true);
  const [message, setMessage] = useState({ error: false, msg: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (selectdevice === "" || selectuser === "") {
      setMessage({ error: true, msg: "All fields are mandatory!" });
      return;
    }
    const newassignDevice = {
      selectdevice,
      selectuser,
      status,
    };
    console.log(newassignDevice);

    try {
      if (id !== undefined && id !== "") {
        await AssignDeviceDataService.updateAssignDevice(id, newassignDevice);
        setAssignDeviceId("");
        setMessage({ error: false, msg: "Updated successfully" });
      } else {
        await AssignDeviceDataService.addAssignDevices(newassignDevice);
        setMessage({ error: false, msg: "Assigned successfully" });

        const updatedDevices = [...devices];
        const deviceIndex = updatedDevices.findIndex(
          (device) => device.serial === selectdevice
        );
        if (deviceIndex !== -1) {
          updatedDevices[deviceIndex].status = selectuser;
          setDevices(updatedDevices);
        }
      }
    } catch (err) {
      setMessage({
        error: true,
        msg: "An error occurred while saving the data.",
      });
    }

    setselectDevice("");
    setselectUser("");
  };

  useEffect(() => {
    let timer;

    if (message?.error) {
      timer = setTimeout(() => {
        setMessage(null);
      }, 1500);
    }

    return () => clearTimeout(timer);
  }, [message]);

  const editHandler = async () => {
    setMessage("");
    try {
      const docSnap = await AssignDeviceDataService.getAssignDevice(id);
      console.log("the record is :", docSnap.data());
      setselectDevice(docSnap.data().selectdevice);
      setselectUser(docSnap.data().selectuser);
    } catch (err) {
      setMessage({ error: true, msg: err.message });
    }
  };

  useEffect(() => {
    console.log("The id here is : ", id);
    if (id !== undefined && id !== "") {
      editHandler();
    }
  }, [id]);

  const [devices, setDevices] = useState([]);

  useEffect(() => {
    getDevices();
    getEmployees();
  }, []);

  useEffect(() => {
    getDevices();
    getEmployees();
  }, [assigndevices]);

  const getDevices = async () => {
    const data = await DeviceDataService.getAllDevices();
    console.log(data.docs);

    const selectdevices = assigndevices.map((item) => item.selectdevice);

    let temp = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    let output = temp.filter((item) => {
      return !selectdevices.includes(item.serial);
    });
    console.log("SELECTdevics", selectdevices);
    // console.log("TEMP", temp);
    // console.log("OUTPUT", output);
    setDevices(output);
  };
  console.log("SETDEVICES", setDevices);

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getDevices();
    getEmployees();
  }, []);

  useEffect(() => {
    getDevices();
    getEmployees();
  }, [assigndevices]);

  const getEmployees = async () => {
    const data = await EmployeeDataService.getAllEmployees();
    console.log(data.docs);

    const selectemployees = assigndevices.map((item) => item.selectuser);

    let temps = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    let outputs = temps.filter((item) => {
      // return !selectemployees.includes(item.email);
      return selectemployees;
    });

    setEmployees(outputs);
  };

  return (
    <>
      <div className="container">
        <h1>Assign Device</h1>
        {message?.msg && (
          <Alert
            variant={message?.error ? "danger" : "success"}
            dismissible
            onClose={() => setMessage("")}
          >
            {message?.msg}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmployee">
            <Form.Label>Select Device</Form.Label>

            <Form.Select
              aria-label="Default select example"
              value={selectdevice}
              onChange={(e) => setselectDevice(e.target.value)}
            >
              <option key="blankChoice" hidden value>
                {" "}
                Open this select menu{" "}
              </option>

              {devices.map((doc, index) => (
                <option>{doc.serial}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmployee">
            <Form.Label>Select User</Form.Label>

            <Form.Select
              aria-label="Default select example"
              value={selectuser}
              onChange={(e) => setselectUser(e.target.value)}
            >
              <option key="blankChoice" hidden value>
                {" "}
                Open this select menu{" "}
              </option>

              {employees.map((doc, index) => (
                <option>{doc.email}</option>
              ))}
            </Form.Select>
            <br />
            <ButtonGroup aria-label="Basic example" className="mb-3">
              <Button
                disabled={flag}
                variant="success"
                onClick={(e) => {
                  setStatus("Assigned");
                  setFlag(true);
                }}
              >
                Assigned
              </Button>
              {/* <Button
                variant="danger"
                disabled={!flag}
                onClick={(e) => {
                  setStatus("Not Assigned");
                  setFlag(false);
                }}
              >
                Not Assigned
              </Button> */}
            </ButtonGroup>
          </Form.Group>
          <div className="d-grid gap-2">
            <Button variant="primary" type="Submit">
              Assign Device
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default AssignDevice;

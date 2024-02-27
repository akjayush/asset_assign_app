// Import statements...
import React, { useEffect, useState } from "react";
import { Form, Alert, Button, ButtonGroup } from "react-bootstrap";
import DeviceDataService from "../services/device.services";
import EmployeeDataService from "../services/employee.service";
import AssignDeviceDataService from "../services/assign.services";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Select from "react-select";

const AssignDevice = ({
  getDeviceId,
  getEmployeeId,
  id,
  setAssignDeviceId,
  assigndevices,
}) => {
  const [loggedInUserEmail, setLoggedInUserEmail] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedInUserEmail(user.email);
      } else {
        setLoggedInUserEmail(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const [selectdevice, setSelectDevice] = useState("");
  const [selectuser, setSelectUser] = useState("");
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

    const newAssignDevice = {
      selectdevice,
      selectuser,
      status,
    };

    try {
      if (id !== undefined && id !== "") {
        await AssignDeviceDataService.updateAssignDevice(id, newAssignDevice);
        setAssignDeviceId("");
        setMessage({ error: false, msg: "Updated successfully" });
      } else {
        await AssignDeviceDataService.addAssignDevices(newAssignDevice);
        setMessage({ error: false, msg: "Assigned successfully" });
      }
      window.location.reload();
    } catch (err) {
      setMessage({
        error: true,
        msg: "Error processing request.",
      });
    }

    setSelectDevice("");
    setSelectUser("");
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
      setSelectDevice(docSnap.data().selectdevice);
      setSelectUser(docSnap.data().selectuser);
    } catch (err) {
      setMessage({ error: true, msg: err.message });
    }
  };

  useEffect(() => {
    if (id !== undefined && id !== "") {
      editHandler();
    }
  }, [id]);

  const [devices, setDevices] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getDevices();
    getEmployees();
  }, [assigndevices]);

  const getDevices = async () => {
    const data = await DeviceDataService.getAllDevices();
    const selectdevices = assigndevices.map((item) => item.selectdevice);

    // Assuming device and serial are separate properties in the data
    let temp = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    // Filter out devices that are already assigned
    let output = temp.filter((item) => {
      const combinedValue = `${item.device} - ${item.serial}`;

      return (
        !selectdevices.includes(combinedValue) &&
        item.condition !== "Not Working"
      );
    });
    output.sort((a, b) => a.device.localeCompare(b.device));

    setDevices(output);
  };

  const getEmployees = async () => {
    const data = await EmployeeDataService.getAllEmployees();
    const selectemployees = assigndevices.map((item) => item.selectuser);
    let temps = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    let outputs = temps.filter((item) => selectemployees);
    setEmployees(outputs);
  };

  return (
    <>
      {loggedInUserEmail !== "admin@soprasteria.com" ? null : (
        <div className="container bold-text">
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
            <Form.Label>Select Device</Form.Label>
            <Select
              value={{ label: selectdevice, value: selectdevice }}
              onChange={(selectedOption) =>
                setSelectDevice(selectedOption.value)
              }
              options={devices.map((doc) => ({
                label: `${doc.device} - ${doc.serial}`,
                value: `${doc.device} - ${doc.serial}`,
              }))}
              placeholder="Select Device"
              isSearchable
            />
            <Form.Group className="mb-3" controlId="formBasicEmployee">
              <Form.Label>Select User</Form.Label>
              <Select
                value={{ label: selectuser, value: selectuser }}
                onChange={(selectedOption) =>
                  setSelectUser(selectedOption.value)
                }
                options={employees.map((doc) => ({
                  label: doc.email,
                  value: doc.email,
                }))}
                placeholder="Select User"
                isSearchable
              />
              <br />
              <ButtonGroup aria-label="Basic example" className="mb-3">
                <Button
                  disabled={!flag}
                  variant="success"
                  onClick={() => {
                    setStatus("Assigned");
                    setFlag(true);
                  }}
                >
                  Assigned
                </Button>
              </ButtonGroup>
            </Form.Group>
            <div className="d-grid gap-2 blue-buttons">
              <Button
                variant="primary"
                type="Submit"
                style={{ fontWeight: "650" }}
              >
                Assign Device
              </Button>
            </div>
          </Form>
        </div>
      )}
    </>
  );
};

export default AssignDevice;

import React, { useEffect, useState } from "react";
import "./DeviceForm.css";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import DeviceDataService from "../services/device.services";
import EmployeeDataService from "../services/employee.service";

const AssignDevice = ({ getDeviceId, getEmployeeId }) => {
  const [devices, setDevices] = useState([]);
  useEffect(() => {
    getDevices();
  }, []);

  const getDevices = async () => {
    const data = await DeviceDataService.getAllDevices();
    console.log(data.docs);
    setDevices(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    getEmployees();
  }, []);

  const getEmployees = async () => {
    const data = await EmployeeDataService.getAllEmployees();
    console.log(data.docs);
    setEmployees(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  return (
    <>
      <div className="container">
        <h1>Assign Device</h1>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmployee">
            <Form.Label>Select Device</Form.Label>
            <Form.Select aria-label="Default select example">
              <option key="blankChoice" hidden value>
                {" "}
                Open this select menu{" "}
              </option>

              {devices.map((doc, index) => (
                <option value="1">{doc.serial}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmployee">
            <Form.Label>Select User</Form.Label>
            <Form.Select aria-label="Default select example">
              <option key="blankChoice" hidden value>
                {" "}
                Open this select menu{" "}
              </option>

              {employees.map((doc, index) => (
                <option value="2">{doc.email}</option>
              ))}
            </Form.Select>
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

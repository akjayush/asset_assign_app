/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/rules-of-hooks */
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import DeviceDataService from "../services/device.services";
import { Form, Alert, Button, ButtonGroup } from "react-bootstrap";

const DeviceForm = ({ id, setDeviceId }) => {
  const [device, setDevice] = useState("");
  const [serial, setSerial] = useState("");
  const [status, setStatus] = useState("Not Assigned");
  const [flag, setFlag] = useState(true);
  const [message, setMessage] = useState({ error: false, msg: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (device === "" || serial === "") {
      setMessage({ error: true, msg: "All fields are mandatory!" });
      return;
    }
    const newDevice = {
      device,
      serial,
      status,
    };
    console.log(newDevice);

    try {
      if (id !== undefined && id !== "") {
        await DeviceDataService.updateDevice(id, newDevice);
        setDeviceId("");
        setMessage({ error: false, msg: "Updated successfully" });
      } else {
        await DeviceDataService.addDevices(newDevice);
        setMessage({ error: false, msg: "New Device added successfully" });
      }
    } catch (err) {
      setMessage({ error: true, msg: err.message });
    }
    setDevice("");
    setSerial("");
    window.location.reload();
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
      const docSnap = await DeviceDataService.getDevice(id);
      console.log("the record is :", docSnap.data());
      setDevice(docSnap.data().device);
      setSerial(docSnap.data().serial);
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

  return (
    <>
      <div className="container bold-text">
        {/* <h1>Device Form</h1> */}
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
          <Form.Group className="mb-3" controlId="formBasicDevice">
            <Form.Label>Device Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Device Name"
              value={device}
              onChange={(e) => setDevice(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicSerial">
            <Form.Label>Device Serial Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Device Serial Number"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
            />
          </Form.Group>

          <ButtonGroup aria-label="Basic example" className="mb-3">
            {/* <Button
              disabled={flag}
              variant="success"
              onClick={(e) => {
                setStatus("Assigned");
                setFlag(true);
              }}
            >
              Assigned
            </Button> */}
            <Button
              variant="danger"
              disabled={!flag}
              onClick={(e) => {
                setStatus("Not Assigned");
                setFlag(false);
              }}
            >
              Not Assigned
            </Button>
          </ButtonGroup>

          <div className="d-grid gap-2">
            <Button variant="primary" type="Submit">
              Add/ Update
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default DeviceForm;

// Import statements...
import React, { useState, useEffect } from "react";
import DeviceDataService from "../services/device.services";
import { Form, Alert, Button, ButtonGroup } from "react-bootstrap";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";

const DeviceForm = ({ id, setDeviceId }) => {
  const [loggedInUserEmail, setLoggedInUserEmail] = useState(null);
  const [device, setDevice] = useState("");
  const [serial, setSerial] = useState("");
  const [status, setStatus] = useState("Not Assigned");
  const [condition, setCondition] = useState("Working");
  const [flag, setFlag] = useState(true);
  const [flag2, setFlag2] = useState(true);
  const [message, setMessage] = useState({ error: false, msg: "" });

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
      condition,
    };

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
      setDevice(docSnap.data().device);
      setSerial(docSnap.data().serial);

      // Set the condition based on the existing data
      setCondition(docSnap.data().condition);

      // Set the button states based on the condition
      if (docSnap.data().condition === "Working") {
        setFlag2(true); // Enable "Working" button
      } else {
        setFlag2(false); // Enable "Not Working" button
      }
    } catch (err) {
      setMessage({ error: true, msg: err.message });
    }
  };

  useEffect(() => {
    if (id !== undefined && id !== "") {
      editHandler();
    }
  }, [id]);

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
              <Button
                variant="danger"
                disabled={!flag}
                style={{ display: "none" }}
                onClick={(e) => {
                  setStatus("Not Assigned");
                  setFlag(false);
                }}
              >
                Not Assigned
              </Button>
            </ButtonGroup>
            <ButtonGroup aria-label="Basic example" className="mb-3">
              <Button
                disabled={flag2}
                variant="success"
                onClick={(e) => {
                  setCondition("Working");
                  setFlag2(true);
                }}
              >
                Working
              </Button>
              <Button
                variant="danger"
                disabled={!flag2}
                onClick={(e) => {
                  setCondition("Not Working");
                  setFlag2(false);
                }}
              >
                Not Working
              </Button>
            </ButtonGroup>

            <div className="d-grid gap-2 blue-buttons">
              <Button
                variant="primary"
                type="Submit"
                style={{ fontWeight: "650" }}
              >
                Add/ Update
              </Button>
            </div>
          </Form>
        </div>
      )}
    </>
  );
};

export default DeviceForm;

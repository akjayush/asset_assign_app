/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/rules-of-hooks */
import "bootstrap/dist/css/bootstrap.min.css";
// Import statements...
import React, { useState, useEffect } from "react";
import EmployeeDataService from "../services/employee.service";
import { Form, Alert, Button } from "react-bootstrap";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const EmployeeForm = ({ id, setEmployeeId }) => {
  const [loggedInUserEmail, setLoggedInUserEmail] = useState(null);
  const [empid, setEmpid] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
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
    if (empid === "" || name === "" || email === "" || number === "") {
      setMessage({ error: true, msg: "All fields are mandatory!" });
      return;
    }
    if (number.length !== 10) {
      setMessage({ error: true, msg: "Mobile number must be 10 digits long!" });
      return;
    }
    const newEmployee = {
      empid,
      name,
      email,
      number,
    };

    try {
      if (id !== undefined && id !== "") {
        await EmployeeDataService.updateEmployee(id, newEmployee);
        setEmployeeId("");
        setMessage({ error: false, msg: "Updated successfully" });
      } else {
        await EmployeeDataService.addEmployees(newEmployee);
        setMessage({ error: false, msg: "New Employee added successfully" });
      }
    } catch (err) {
      setMessage({ error: true, msg: err.message });
    }
    setEmpid("");
    setName("");
    setEmail("");
    setNumber("");
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
      const docSnap = await EmployeeDataService.getEmployee(id);
      setEmpid(docSnap.data().empid);
      setName(docSnap.data().name);
      setEmail(docSnap.data().email);
      setNumber(docSnap.data().number);
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
            <Form.Group className="mb-3" controlId="formBasicEmployee">
              <Form.Label>Employee Id</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Employee Id"
                value={empid}
                onChange={(e) => setEmpid(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Mobile Number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </Form.Group>

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

export default EmployeeForm;

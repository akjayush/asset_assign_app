import React from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
function AssignDevice() {
  return (
    <>
      <div className="container">
        <h1>Assign Device</h1>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmployee">
            <Form.Label>Select Device</Form.Label>
            <Form.Select aria-label="Default select example">
              <option>Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmployee">
            <Form.Label>Select User</Form.Label>
            <Form.Select aria-label="Default select example">
              <option>Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
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
}

export default AssignDevice;

import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export default function Navbars() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Navbar.Brand>Asset Assign App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/devicepage">Device Form</Nav.Link>
          <Nav.Link href="/employeepage">Employee Details</Nav.Link>
          <Nav.Link href="/assignpage">Assign Device</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

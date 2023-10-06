import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { signOut } from "firebase/auth";
import { Link, useHistory } from "react-router-dom";
import { auth } from "../firebase-config";

export default function Navbars() {
  const history = useHistory();

  // Function to handle logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        history.push("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });

    history.push("/");
    window.location.reload();
  };

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
        <Nav>
          <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

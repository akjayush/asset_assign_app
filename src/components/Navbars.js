import React, { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { signOut } from "firebase/auth";
import { Link, useHistory } from "react-router-dom";
import { auth } from "../firebase-config";
import Spinner from "react-bootstrap/Spinner"; // Import Spinner component
import Button from "react-bootstrap/Button";
export default function Navbars() {
  const history = useHistory();
  const [loggingOut, setLoggingOut] = useState(false); // State for the logout loader

  // Function to handle logout
  const handleLogout = () => {
    setLoggingOut(true); // Show the loader

    signOut(auth)
      .then(() => {
        // Redirect user to home page after logout
        history.push("/");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  // Use useEffect to hide the loader after 1 minute (60,000 milliseconds)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoggingOut(false); // Hide the loader after 1 minute
    }, 60000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="navbar-container">
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
            {loggingOut && (
              <div className="loading-overlay">
                <div className="loader-container">
                  <div className="loader">
                    <Spinner animation="border" role="status" variant="red">
                      <span className="visually-hidden">Logging Out...</span>
                    </Spinner>
                  </div>
                </div>
              </div>
            )}

            <Button onClick={handleLogout} variant="dark">
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

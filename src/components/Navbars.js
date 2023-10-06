import React, { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { signOut } from "firebase/auth";
import { Link, useHistory } from "react-router-dom";
import { auth } from "../firebase-config";
import Spinner from "react-bootstrap/Spinner"; // Import Spinner component
import Button from "react-bootstrap/Button";
import { useLocation } from "react-router-dom";

export default function Navbars() {
  const history = useHistory();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);

    signOut(auth)
      .then(() => {
        history.push("/");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoggingOut(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const renderNavLinks = () => {
    if (location.pathname === "/") {
      return null;
    }

    return (
      <>
        <Nav.Link href="/devicepage">Device Form</Nav.Link>
        <Nav.Link href="/employeepage">Employee Details</Nav.Link>
        <Nav.Link href="/assignpage">Assign Device</Nav.Link>

        <div className="ml-auto">
          <Button onClick={handleLogout} variant="dark">
            Logout
          </Button>
        </div>
      </>
    );
  };

  return (
    <>
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

      <div className="navbar-container">
        <Navbar expand="lg" className="bg-body-tertiary">
          <Navbar.Brand>Asset Assign App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">{renderNavLinks()}</Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </>
  );
}

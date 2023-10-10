import React, { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { signOut } from "firebase/auth";
import { Link, useHistory } from "react-router-dom";
import { auth } from "../firebase-config";
import Spinner from "react-bootstrap/Spinner";
import { useLocation } from "react-router-dom";

export default function Navbars() {
  const history = useHistory();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);

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
        <Nav className="mr-auto">
          <Nav.Link href="/devicepage">Device Form</Nav.Link>
          <Nav.Link href="/employeepage">Employee Details</Nav.Link>
          <Nav.Link href="/assignpage">Assign Device</Nav.Link>
        </Nav>

        <Nav className="log">
          <Button onClick={handleLogout} variant="dark">
            Logout
          </Button>
        </Nav>
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

      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmLogout}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

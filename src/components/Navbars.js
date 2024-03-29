import React, { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { signOut } from "firebase/auth";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase-config";
import { useLocation } from "react-router-dom";
import sopralogo from "./sopralogo.png";

export default function Navbars() {
  const history = useHistory();
  const location = useLocation();
  const [loadingNavigation, setLoadingNavigation] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);

    setLoadingNavigation(true);

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
      setLoadingNavigation(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const handleNavLinkClick = () => {
    setLoadingNavigation(true);

    setTimeout(() => {
      setLoadingNavigation(false);
    }, 1000);
  };

  const renderNavLinks = () => {
    if (location.pathname === "/") {
      return null;
    }

    return (
      <>
        <Nav className="mr-auto">
          <Nav.Link
            href="/devicepage"
            style={{
              color: "white",
              textDecoration: "none",
              marginRight: "15px",
              padding: "5px 0",
              borderBottom:
                location.pathname === "/devicepage"
                  ? "2px solid yellow"
                  : "none",
            }}
            onClick={handleNavLinkClick} // Add the click handler for navigation links
          >
            Device Form
          </Nav.Link>
          <Nav.Link
            href="/employeepage"
            style={{
              color: "white",
              textDecoration: "none",
              marginRight: "15px",
              padding: "5px 0",
              borderBottom:
                location.pathname === "/employeepage"
                  ? "2px solid yellow"
                  : "none",
            }}
            onClick={handleNavLinkClick} // Add the click handler for navigation links
          >
            Employee Details
          </Nav.Link>
          <Nav.Link
            href="/assignpage"
            style={{
              color: "white",
              textDecoration: "none",
              padding: "5px 0",
              borderBottom:
                location.pathname === "/assignpage"
                  ? "2px solid yellow"
                  : "none",
            }}
            onClick={handleNavLinkClick} // Add the click handler for navigation links
          >
            Assign Device
          </Nav.Link>
        </Nav>

        <Nav className="log ms-auto">
          {" "}
          <Button
            onClick={handleLogout}
            variant="danger"
            style={{ marginLeft: "20px" }}
          >
            Logout
          </Button>
        </Nav>
      </>
    );
  };

  return (
    <>
      {loadingNavigation && (
        <div className="loading-overlay">
          <div className="loader-container">
            <div className="loader">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      )}

      <div className="navbar-container ">
        <Navbar expand="lg" className="bg-dark">
          <Navbar.Brand
            style={{
              color: "white",
              marginLeft: "6px",
              marginTop: "-7px",
              fontSize: "24px",
            }}
          >
            Inventory Management{" "}
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="white-toggle"
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">{renderNavLinks()}</Nav>
          </Navbar.Collapse>

          <img
            src={sopralogo}
            alt="Your Logo"
            className="logo ml-auto"
            style={{ marginRight: "8px", marginTop: "-5px" }}
          />
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

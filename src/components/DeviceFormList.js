/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import DeviceDataService from "../services/device.services";
import { Form, Row, Col } from "react-bootstrap";
import AssignDeviceDataService from "../services/assign.services";
import { auth } from "../firebase-config";
const DeviceFormList = ({ getDeviceId }) => {
  const [devices, setDevices] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getDevices();
  }, []);

  const getDevices = async () => {
    // Fetch devices and assignments
    const deviceData = await DeviceDataService.getAllDevices();
    const assignData = await AssignDeviceDataService.getAllAssignDevices();
    const assignedDevices = assignData.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // Combine device data with assignment status
    const updatedDevices = deviceData.docs.map((doc) => {
      const combinedValue = `${doc.data().device} - ${doc.data().serial}`;
      const assignedDevice = assignedDevices.find(
        (assigned) => assigned.selectdevice === combinedValue
      );
      if (assignedDevice) {
        return {
          ...doc.data(),
          id: doc.id,
          status: assignedDevice.selectuser,
        };
      } else {
        return { ...doc.data(), id: doc.id, status: "Not Assigned" };
      }
    });
    const sortedDevices = updatedDevices.sort((a, b) =>
      a.device.localeCompare(b.device)
    );
    setDevices(sortedDevices);
  };

  const deleteHandler = async (id, status) => {
    if (status === "Not Assigned") {
      const shouldDelete = window.confirm(
        "Are you sure you want to delete this device?"
      );

      if (shouldDelete) {
        await DeviceDataService.deleteDoc(id);
        getDevices();
      }
    } else {
      alert(
        "You cannot delete an assigned device. Remove it from the Assign Device first."
      );
    }
  };

  const handleEdit = (id, status) => {
    if (status === "Not Assigned") {
      getDeviceId(id); // Allow editing only for devices that are "Not Assigned"
    } else {
      alert(
        "You cannot edit an assigned device. Remove it from the Assign Device first."
      );
    }
  };

  const handleSort = (column) => {
    if (column === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const sortedDevices = [...devices].sort((a, b) => {
    if (
      sortBy === "device" ||
      sortBy === "serial" ||
      sortBy === "status" ||
      sortBy === "condition"
    ) {
      return sortOrder === "asc"
        ? a[sortBy].localeCompare(b[sortBy])
        : b[sortBy].localeCompare(a[sortBy]);
    } else {
      return sortOrder === "asc"
        ? a[sortBy] - b[sortBy]
        : b[sortBy] - a[sortBy];
    }
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredDevices = sortedDevices.filter(
    (device) =>
      device.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAuthorizedUser = () => {
    // Check if the logged-in user's email matches the specified email
    const currentUser = auth.currentUser;
    return currentUser && currentUser.email === "admin@soprasteria.com";
  };

  const renderActionColumn = () => {
    if (isAuthorizedUser()) {
      return <th>Action</th>;
    }
    return null;
  };

  return (
    <>
      <Row className="mb-2">
        <Col xs={8}>
          <Button variant="dark edit" onClick={getDevices}>
            Refresh List
          </Button>
        </Col>
        <Col xs={4} className="d-flex justify-content-end">
          <Form className="search-bar">
            <Form.Control
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              size="sm"
            />
          </Form>
        </Col>
      </Row>
      <div className="cont">
        {/* <pre>{JSON.stringify(devices, undefined, 2)}</pre> */}
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th onClick={() => handleSort("device")}>
                Device Name {sortBy === "device" && sortOrder === "asc" && "▲"}
                {sortBy === "device" && sortOrder === "desc" && "▼"}
              </th>
              <th onClick={() => handleSort("serial")}>
                Serial Number{" "}
                {sortBy === "serial" && sortOrder === "asc" && "▲"}
                {sortBy === "serial" && sortOrder === "desc" && "▼"}
              </th>
              <th onClick={() => handleSort("status")}>
                Assigned to {sortBy === "status" && sortOrder === "asc" && "▲"}
                {sortBy === "status" && sortOrder === "desc" && "▼"}
              </th>
              <th onClick={() => handleSort("condition")}>
                Device Condition{" "}
                {sortBy === "condition" && sortOrder === "asc" && "▲"}
                {sortBy === "condition" && sortOrder === "desc" && "▼"}
              </th>

              {renderActionColumn()}
            </tr>
          </thead>
          <tbody>
            {filteredDevices.map((doc, index) => {
              return (
                <tr key={doc.id}>
                  <td>{index + 1}</td>
                  <td>{doc.device}</td>
                  <td>{doc.serial}</td>
                  <td>{doc.status}</td>
                  <td>{doc.condition}</td>
                  {isAuthorizedUser() && (
                    <td>
                      <Button
                        variant="secondary"
                        className="edit"
                        onClick={() => handleEdit(doc.id, doc.status)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        className="delete"
                        onClick={() => deleteHandler(doc.id, doc.status)}
                      >
                        Delete
                      </Button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default DeviceFormList;

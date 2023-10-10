/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import DeviceDataService from "../services/device.services";
import { Form, Row, Col } from "react-bootstrap";

const DeviceFormList = ({ getDeviceId }) => {
  const [devices, setDevices] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    getDevices();
  }, []);

  const getDevices = async () => {
    const data = await DeviceDataService.getAllDevices();
    console.log(data.docs);
    setDevices(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteHandler = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this device?"
    );

    if (shouldDelete) {
      await DeviceDataService.deleteDoc(id);
      getDevices();
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
    if (sortBy === "device" || sortBy === "serial" || sortBy === "status") {
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
      device.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                Status {sortBy === "status" && sortOrder === "asc" && "▲"}
                {sortBy === "status" && sortOrder === "desc" && "▼"}
              </th>
              <th>Action</th>
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
                  <td>
                    <Button
                      variant="secondary"
                      className="edit"
                      onClick={(e) => getDeviceId(doc.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      className="delete"
                      onClick={(e) => deleteHandler(doc.id)}
                    >
                      Delete
                    </Button>
                  </td>
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

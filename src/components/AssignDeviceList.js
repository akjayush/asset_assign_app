import React, { useEffect, useState } from "react";
import { Table, Button, Form, Row, Col } from "react-bootstrap";
import AssignDeviceDataService from "../services/assign.services";
import { auth } from "../firebase-config";

const AssignDeviceList = ({
  getAssignDeviceId,
  assigndevices,
  setassignDevices,
}) => {
  useEffect(() => {
    getAssignDevices();
  }, []);

  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const getAssignDevices = async () => {
    const data = await AssignDeviceDataService.getAllAssignDevices();
    console.log(data.docs);
    setassignDevices(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteHandler = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (shouldDelete) {
      await AssignDeviceDataService.deleteDoc(id);
      getAssignDevices();
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

  const sortedDevices = [...assigndevices].sort((a, b) => {
    if (
      sortBy === "selectdevice" ||
      sortBy === "selectuser" ||
      sortBy === "status"
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
      device.selectdevice.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.selectuser.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAuthorizedUser = () => {
    // Check if the logged-in user's email matches the specified email
    const currentUser = auth.currentUser;
    return currentUser && currentUser.email === "admin@soprasteria.com";
  };
  return (
    <>
      <Row className="mb-2">
        <Col xs={8}>
          <Button variant="dark edit" onClick={getAssignDevices}>
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
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th onClick={() => handleSort("selectdevice")}>
                Device Serial Number
                {sortBy === "selectdevice" && sortOrder === "asc" && "▲"}
                {sortBy === "selectdevice" && sortOrder === "desc" && "▼"}
              </th>

              <th onClick={() => handleSort("selectuser")}>
                User Email{" "}
                {sortBy === "selectuser" && sortOrder === "asc" && "▲"}
                {sortBy === "selectuser" && sortOrder === "desc" && "▼"}
              </th>
              <th onClick={() => handleSort("status")}>
                Status {sortBy === "status" && sortOrder === "asc" && "▲"}
                {sortBy === "status" && sortOrder === "desc" && "▼"}
              </th>
              {isAuthorizedUser() && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredDevices.map((doc, index) => {
              return (
                <tr key={doc.id}>
                  <td>{index + 1}</td>
                  <td>{doc.selectdevice}</td>
                  <td>{doc.selectuser}</td>
                  <td>{doc.status}</td>
                  {isAuthorizedUser() && (
                    <td>
                      <Button
                        variant="danger"
                        className="delete"
                        onClick={(e) => deleteHandler(doc.id)}
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

export default AssignDeviceList;

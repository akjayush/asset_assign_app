import React, { useEffect, useState } from "react";
import { Table, Button, Form, Row, Col } from "react-bootstrap";
import EmployeeDataService from "../services/employee.service";

const EmployeeFormList = ({ getEmployeeId }) => {
  const [employees, setEmployees] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getEmployees();
  }, []);

  const getEmployees = async () => {
    const data = await EmployeeDataService.getAllEmployees();
    console.log(data.docs);
    setEmployees(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteHandler = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (shouldDelete) {
      await EmployeeDataService.deleteDoc(id);
      getEmployees();
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

  const sortedEmployees = [...employees].sort((a, b) => {
    if (sortBy === "empid" || sortBy === "name" || sortBy === "email") {
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

  const filteredEmployees = sortedEmployees.filter(
    (employee) =>
      employee.empid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Row className="mb-2">
        <Col xs={8}>
          <Button variant="dark edit" onClick={getEmployees}>
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
              <th onClick={() => handleSort("empid")}>
                Employee Id {sortBy === "empid" && sortOrder === "asc" && "▲"}
                {sortBy === "empid" && sortOrder === "desc" && "▼"}
              </th>
              <th onClick={() => handleSort("name")}>
                Name {sortBy === "name" && sortOrder === "asc" && "▲"}
                {sortBy === "name" && sortOrder === "desc" && "▼"}
              </th>
              <th onClick={() => handleSort("email")}>
                Gmail {sortBy === "email" && sortOrder === "asc" && "▲"}
                {sortBy === "email" && sortOrder === "desc" && "▼"}
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee, index) => {
              return (
                <tr key={employee.id}>
                  <td>{index + 1}</td>
                  <td>{employee.empid}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>
                    <Button
                      variant="secondary"
                      className="edit"
                      onClick={() => getEmployeeId(employee.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      className="delete"
                      onClick={() => deleteHandler(employee.id)}
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

export default EmployeeFormList;

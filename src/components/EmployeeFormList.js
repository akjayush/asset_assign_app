/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import EmployeeDataService from "../services/employee.service";

const EmployeeFormList = ({ getEmployeeId }) => {
  const [employees, setEmployees] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    getEmployees();
  }, []);

  const getEmployees = async () => {
    const data = await EmployeeDataService.getAllEmployees();
    console.log(data.docs);
    setEmployees(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteHandler = async (id) => {
    await EmployeeDataService.deleteDoc(id);
    getEmployees();
  };

  const handleSort = (column) => {
    if (column === sortBy) {
      // If the same column is clicked, toggle the sorting order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If a new column is clicked, set it as the sorting column and default to ascending order
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Function to apply sorting to the employees array
  const sortedEmployees = [...employees].sort((a, b) => {
    if (sortBy === "empid" || sortBy === "name" || sortBy === "email") {
      // For string columns (e.g., employee ID, name, email), use localeCompare for sorting
      return sortOrder === "asc"
        ? a[sortBy].localeCompare(b[sortBy])
        : b[sortBy].localeCompare(a[sortBy]);
    } else {
      // For numeric columns (e.g., index), use simple comparison
      return sortOrder === "asc"
        ? a[sortBy] - b[sortBy]
        : b[sortBy] - a[sortBy];
    }
  });

  return (
    <>
      <div className="mb-2">
        <Button variant="dark edit" onClick={getEmployees}>
          Refresh List
        </Button>
      </div>
      <div className="cont">
        {/* <pre>{JSON.stringify(devices, undefined, 2)}</pre> */}
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
            {sortedEmployees.map((doc, index) => {
              return (
                <tr key={doc.id}>
                  <td>{index + 1}</td>
                  <td>{doc.empid}</td>
                  <td>{doc.name}</td>
                  <td>{doc.email}</td>
                  <td>
                    <Button
                      variant="secondary"
                      className="edit"
                      onClick={(e) => getEmployeeId(doc.id)}
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

export default EmployeeFormList;

/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import EmployeeDataService from "../services/employee.service";

const EmployeeFormList = ({ getEmployeeId }) => {
  const [employees, setEmployees] = useState([]);
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
              <th>Employee Id</th>
              <th>Name</th>
              <th>Gmail</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((doc, index) => {
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

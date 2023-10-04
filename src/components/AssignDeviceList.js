/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import AssignDeviceDataService from "../services/assign.services";

const AssignDeviceList = ({
  getAssignDeviceId,
  assigndevices,
  setassignDevices,
}) => {
  //const [assigndevices, setassignDevices] = useState([]);
  useEffect(() => {
    getAssignDevices();
  }, []);

  const getAssignDevices = async () => {
    const data = await AssignDeviceDataService.getAllAssignDevices();
    console.log(data.docs);
    setassignDevices(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteHandler = async (id) => {
    await AssignDeviceDataService.deleteDoc(id);
    getAssignDevices();
  };

  return (
    <>
      <div className="mb-2">
        <Button variant="dark edit" onClick={getAssignDevices}>
          Refresh List
        </Button>
      </div>

      <div className="cont">
        {/* <pre>{JSON.stringify(devices, undefined, 2)}</pre> */}
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Device Serial Number</th>
              <th>User Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assigndevices.map((doc, index) => {
              return (
                <tr key={doc.id}>
                  <td>{index + 1}</td>
                  <td>{doc.selectdevice}</td>
                  <td>{doc.selectuser}</td>
                  <td>{doc.status}</td>
                  <td>
                    <Button
                      variant="secondary"
                      className="edit"
                      onClick={(e) => getAssignDeviceId(doc.id)}
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

export default AssignDeviceList;

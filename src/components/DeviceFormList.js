/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import DeviceDataService from "../services/device.services";

const DeviceFormList = ({ getDeviceId }) => {
  const [devices, setDevices] = useState([]);
  useEffect(() => {
    getDevices();
  }, []);

  const getDevices = async () => {
    const data = await DeviceDataService.getAllDevices();
    console.log(data.docs);
    setDevices(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteHandler = async (id) => {
    await DeviceDataService.deleteDoc(id);
    getDevices();
  };

  return (
    <>
      <div className="mb-2">
        <Button variant="dark edit" onClick={getDevices}>
          Refresh List
        </Button>
      </div>
      <div className="cont">
        {/* <pre>{JSON.stringify(devices, undefined, 2)}</pre> */}
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Device Name</th>
              <th>Serial Number</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((doc, index) => {
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

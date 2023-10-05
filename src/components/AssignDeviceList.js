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
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const getAssignDevices = async () => {
    const data = await AssignDeviceDataService.getAllAssignDevices();
    console.log(data.docs);
    setassignDevices(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteHandler = async (id) => {
    await AssignDeviceDataService.deleteDoc(id);
    getAssignDevices();
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedDevices.map((doc, index) => {
              return (
                <tr key={doc.id}>
                  <td>{index + 1}</td>
                  <td>{doc.selectdevice}</td>
                  <td>{doc.selectuser}</td>
                  <td>{doc.status}</td>
                  <td>
                    {/* <Button
                      variant="secondary"
                      className="edit"
                      onClick={(e) => getAssignDeviceId(doc.id)}
                    >
                      Edit
                    </Button> */}
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

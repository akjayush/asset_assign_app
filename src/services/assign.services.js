import { db } from "../firebase-config";

import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const assigndeviceCollectionRef = collection(db, "assigndevices");
class AssignDeviceDataService {
  addAssignDevices = (addAssignDevice) => {
    return addDoc(assigndeviceCollectionRef, addAssignDevice);
  };

  updateAssignDevice = (id, updateAssignDevice) => {
    const assigndeviceDoc = doc(db, "assigndevices", id);
    return updateDoc(assigndeviceDoc, updateAssignDevice);
  };

  deleteDoc = (id) => {
    const assigndeviceDoc = doc(db, "assigndevices", id);
    return deleteDoc(assigndeviceDoc);
  };

  getAllAssignDevices = () => {
    return getDocs(assigndeviceCollectionRef);
  };

  getAssignDevice = (id) => {
    const assigndeviceDoc = doc(db, "assigndevices", id);
    return getDoc(assigndeviceDoc);
  };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new AssignDeviceDataService();

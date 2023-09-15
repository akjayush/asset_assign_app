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

const deviceCollectionRef = collection(db, "devices");
class DeviceDataService {
  addDevices = (addDevice) => {
    return addDoc(deviceCollectionRef, addDevice);
  };

  updateDevice = (id, updateDevice) => {
    const deviceDoc = doc(db, "devices", id);
    return updateDoc(deviceDoc, updateDevice);
  };

  deleteDoc = (id) => {
    const deviceDoc = doc(db, "devices", id);
    return deleteDoc(deviceDoc);
  };

  getAllDevices = () => {
    return getDocs(deviceCollectionRef);
  };

  getDevice = (id) => {
    const deviceDoc = doc(db, "devices", id);
    return getDoc(deviceDoc);
  };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new DeviceDataService();

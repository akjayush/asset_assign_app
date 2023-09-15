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

const emplyoyeeCollectionRef = collection(db, "employees");
class EmployeeDataService {
  addEmployees = (addEmployee) => {
    return addDoc(emplyoyeeCollectionRef, addEmployee);
  };

  updateEmployee = (id, updateEmployee) => {
    const employeeDoc = doc(db, "employees", id);
    return updateDoc(employeeDoc, updateEmployee);
  };

  deleteDoc = (id) => {
    const employeeDoc = doc(db, "employees", id);
    return deleteDoc(employeeDoc);
  };

  getAllEmployees = () => {
    return getDocs(emplyoyeeCollectionRef);
  };

  getEmployee = (id) => {
    const employeeDoc = doc(db, "employees", id);
    return getDoc(employeeDoc);
  };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new EmployeeDataService();

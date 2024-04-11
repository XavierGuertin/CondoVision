/*This React component, AddEmployeeModalWeb, facilitates the addition of employees to a web application.
It utilizes Firebase authentication and Firestore database to register new users and store their information. 
The modal interface allows input of employee email, password, and job role, with validation checks ensuring all 
fields are filled. Upon successful registration, the employee data is stored in the database, and the modal closes with a success alert.*/


import React, { useState } from 'react';
import { db, auth } from '@web/firebase'; // Ensure the path is accurate
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';

interface Employee {
  email: string;
  password: string;
  job: string;
}

interface AddEmployeeModalWebProps {
  propertyId: string;
  isVisible: boolean;
  onClose: () => void;
}

const AddEmployeeModalWeb: React.FC<AddEmployeeModalWebProps> = ({ propertyId, isVisible, onClose }) => {
  const [employee, setEmployee] = useState<Employee>({
    email: '',
    password: '',
    job: 'Janitor'
  });

  const jobOptions = [
    { label: "Janitor", value: "Janitor" },
    { label: "Pool Boy/Girl/...", value: "Pool Boy/Girl/..." },
    { label: "Chef", value: "Chef" },
    { label: "Finance", value: "Finance" },
    { label: "Custodian", value: "Custodian" }
  ];

  const registerEmployee = async () => {
    if (employee.email === "" || employee.password === "") {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, employee.email, employee.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: employee.email,
        role: "Employee",
        job: employee.job
      });

      await addDoc(collection(db, `properties/${propertyId}/Employees`), {
        user: doc(db, "users", user.uid),
        email: employee.email,
        job: employee.job
      });

      setEmployee({ email: '', password: '', job: 'Janitor' }); // Reset the form
      onClose(); // Close the modal
      alert("Employee added successfully!");
    } catch (error) {
      console.error('Error registering employee:', error);
      alert('Failed to register employee.');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg w-1/2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add Employee</h2>
          <button onClick={onClose} className="text-xl font-bold">&times;</button>
        </div>
        <div>
          <label className="block">Email *</label>
          <input
            type="email"
            value={employee.email}
            onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
            placeholder="Enter email"
            className="border-2 border-gray-200 rounded p-2 w-full"
          />
        </div>
        <div className="mt-4">
          <label className="block">Password *</label>
          <input
            type="password"
            value={employee.password}
            onChange={(e) => setEmployee({ ...employee, password: e.target.value })}
            placeholder="Enter password"
            className="border-2 border-gray-200 rounded p-2 w-full"
          />
        </div>
        <div className="mt-4">
          <label className="block">Job Role *</label>
          <select 
            value={employee.job} 
            onChange={(e) => setEmployee({ ...employee, job: e.target.value })}
            className="border-2 border-gray-200 rounded p-2 w-full">
            {jobOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4 flex justify-end">
          <button 
            onClick={registerEmployee} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Register Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModalWeb;


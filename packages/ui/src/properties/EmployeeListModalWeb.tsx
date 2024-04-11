/*EmployeeListModalWeb is a React component that showcases a list of employees linked to a property within 
a web application. It retrieves employee data from a Firestore collection based on the property ID and 
displays each employee's email and job role. Users can easily toggle an "Add Employee" modal to include 
new employees, enhancing the application's usability. This modal interaction is facilitated by the AddEmployeeModalWeb component.*/


import React, { useState, useEffect } from 'react';
import { db } from '@web/firebase'; // Ensure the path is accurate
import { collection, getDocs } from 'firebase/firestore';
import AddEmployeeModalWeb from './AddEmployeeModalWeb'; // Ensure the path is accurate

interface Employee {
  email: string;
  job: string;
}

interface EmployeeListModalWebProps {
  propertyId: string;
  isVisible: boolean;
  onClose: () => void;
}

const EmployeeListModalWeb: React.FC<EmployeeListModalWebProps> = ({ propertyId, isVisible, onClose }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      const newEmployees: Employee[] = [];
      const querySnapshot = await getDocs(collection(db, `properties/${propertyId}/Employees`));
      querySnapshot.forEach((doc) => {
        newEmployees.push(doc.data() as Employee);
      });
      setEmployees(newEmployees);
    };

    if (isVisible) {
      fetchEmployees();
    }
  }, [propertyId, isVisible]);

  const toggleAddEmployeeModal = () => setShowAddEmployeeModal(!showAddEmployeeModal);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg w-1/2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Employee List</h2>
          <button onClick={onClose} className="text-xl font-bold">&times;</button>
        </div>
        <ul>
          {employees.map((employee, index) => (
            <li key={index} className="border-t border-gray-300 py-2">
              Email: {employee.email}, Job: {employee.job}
            </li>
          ))}
        </ul>
        <button 
          onClick={toggleAddEmployeeModal} 
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Employee
        </button>
        {showAddEmployeeModal && (
          <AddEmployeeModalWeb
            propertyId={propertyId}
            isVisible={showAddEmployeeModal}
            onClose={toggleAddEmployeeModal}
          />
        )}
      </div>
    </div>
  );
};

export default EmployeeListModalWeb;

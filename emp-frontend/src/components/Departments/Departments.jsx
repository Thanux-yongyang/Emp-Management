import React, { useState } from 'react';
import { useDepartments } from '../../context/DepartmentContext';

const Departments = () => {
  const {
    departments,
    loading,
    error,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  } = useDepartments();

  const [newDept, setNewDept] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [localError, setLocalError] = useState('');
  const [inputError, setInputError] = useState(false);

  // Add department
  const handleAdd = async () => {
    if (!newDept.trim()) {
      setInputError(true);
      setNewDept('');
      setTimeout(() => setInputError(false), 2000);
      return;
    }
    try {
      await addDepartment(newDept.trim());
      setNewDept('');
      setLocalError('');
      setInputError(false);
    } catch {
      setLocalError('Failed to add department');
    }
  };

  // Start editing
  const handleEdit = (id, name) => {
    setEditId(id);
    setEditName(name);
    setLocalError('');
  };

  // Save edit
  const handleSave = async (id) => {
    try {
      await updateDepartment(id, editName.trim());
      setEditId(null);
      setEditName('');
      setLocalError('');
    } catch {
      setLocalError('Failed to update department');
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setEditId(null);
    setEditName('');
    setLocalError('');
  };

  // Delete department
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await deleteDepartment(id);
      setLocalError('');
    } catch {
      setLocalError('Failed to delete department');
    }
  };

  // Handle input change to reset error
  const handleInputChange = (e) => {
    setNewDept(e.target.value);
    if (inputError && e.target.value.trim()) {
      setInputError(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto bg-white rounded-xl shadow-lg p-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Departments</h1>
        {/* Add Department */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newDept}
            onChange={handleInputChange}
            placeholder={inputError ? 'Department name is required' : 'Enter department name (required)'}
            className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputError ? 'border-red-500 placeholder-red-500' : 'border-gray-300'}`}
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>
        {(error || localError) && <div className="mb-4 text-red-600 font-semibold">{error || localError}</div>}
        {/* Department List */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading departments...</div>
        ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-20">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-64">Department Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-56">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments.map(dept => (
              <tr key={dept.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 w-20">{dept.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-64">
                  {editId === dept.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded w-full"
                      style={{ minWidth: 180 }}
                    />
                  ) : (
                    <span style={{ display: 'inline-block', minWidth: 180 }}>{dept.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-56">
                  <div className="flex gap-2 justify-start min-w-[220px]">
                    {editId === dept.id ? (
                      <>
                        {/* Save Button */}
                        <button
                          onClick={() => handleSave(dept.id)}
                          className="px-3 py-1 rounded w-16 bg-green-600 text-white hover:bg-green-700"
                          style={{ minWidth: 64 }}
                        >
                          Save
                        </button>
                        {/* Cancel Button */}
                        <button
                          onClick={handleCancel}
                          className="px-3 py-1 rounded w-16 bg-gray-400 text-white hover:bg-gray-500"
                          style={{ minWidth: 64 }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Edit Button */}
                        <button
                          onClick={() => handleEdit(dept.id, dept.name)}
                          className="px-3 py-1 rounded w-16 bg-yellow-500 text-white hover:bg-yellow-600"
                          style={{ minWidth: 64 }}
                        >
                          Edit
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(dept.id)}
                          className="px-3 py-1 rounded w-16 bg-red-600 text-white hover:bg-red-700"
                          style={{ minWidth: 64 }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {departments.length === 0 && !loading && (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-400">No departments found.</td>
              </tr>
            )}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};

export default Departments;


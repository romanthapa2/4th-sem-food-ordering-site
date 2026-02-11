import { useEffect, useState } from 'react';
import axios from 'axios';
import './UserManagement.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Try to fetch from API, fallback to mock data if API fails
      try {
        const response = await axios.get('http://localhost:3000/api/users');
        setUsers(response.data.users || response.data || []);
      } catch (apiError) {
        // If API fails, use mock data for demonstration
        console.log('API not available, using mock data');
        setUsers([
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            created_at: new Date().toISOString(),
          },
          {
            id: 3,
            name: 'Bob Johnson',
            email: 'bob@example.com',
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '' });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      try {
        await axios.delete(`http://localhost:3000/api/users/${userId}`);
      } catch (apiError) {
        // If API fails, just remove from local state for demo
        console.log('API not available, removing from local state');
      }
      setUsers(users.filter((user) => user.id !== userId));
      setSuccess('User deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete user');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingUser) {
        // Update user
        try {
          const updateData = { name: formData.name, email: formData.email };
          if (formData.password) {
            updateData.password = formData.password;
          }
          const response = await axios.put(
            `http://localhost:3000/api/users/${editingUser.id}`,
            updateData
          );
          setUsers(
            users.map((user) =>
              user.id === editingUser.id
                ? { ...user, ...response.data.user }
                : user
            )
          );
        } catch (apiError) {
          // If API fails, update local state for demo
          setUsers(
            users.map((user) =>
              user.id === editingUser.id
                ? { ...user, name: formData.name, email: formData.email }
                : user
            )
          );
        }
        setSuccess('User updated successfully');
      } else {
        // Create user
        try {
          const response = await axios.post(
            'http://localhost:3000/api/users',
            formData
          );
          setUsers([...users, response.data.user]);
        } catch (apiError) {
          // If API fails, add to local state for demo
          const newUser = {
            id: Date.now(),
            name: formData.name,
            email: formData.email,
            created_at: new Date().toISOString(),
          };
          setUsers([...users, newUser]);
        }
        setSuccess('User created successfully');
      }
      setShowModal(false);
      setFormData({ name: '', email: '', password: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to save user. Please try again.'
      );
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ name: '', email: '', password: '' });
    setEditingUser(null);
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <button className="add-user-button" onClick={handleAddUser}>
          + Add User
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-users">
                  {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name || 'N/A'}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-button"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button className="close-button" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Enter user name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  placeholder="Enter user email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">
                  Password {editingUser && '(leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required={!editingUser}
                  placeholder="Enter password"
                />
              </div>
              {error && <div className="form-error">{error}</div>}
              <div className="form-actions">
                <button type="button" onClick={handleCloseModal} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  {editingUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;


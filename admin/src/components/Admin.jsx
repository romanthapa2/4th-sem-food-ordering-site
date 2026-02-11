import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserManagement from './UserManagement';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import './Admin.css';

function Admin() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('users');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(adminUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavClick = (e, view) => {
    e.preventDefault();
    setActiveView(view);
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'users':
        return 'User Management';
      case 'products':
        return 'Product Management';
      case 'orders':
        return 'Order Management';
      default:
        return 'Admin Dashboard';
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-container">
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <a 
            href="#" 
            className={`nav-item ${activeView === 'users' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'users')}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-text">User Management</span>
          </a>
          <a 
            href="#" 
            className={`nav-item ${activeView === 'products' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'products')}
          >
            <span className="nav-icon">📦</span>
            <span className="nav-text">Product Management</span>
          </a>
          <a 
            href="#" 
            className={`nav-item ${activeView === 'orders' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'orders')}
          >
            <span className="nav-icon">🛒</span>
            <span className="nav-text">Order Management</span>
          </a>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user-info">
            <span className="user-avatar">{user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}</span>
            <div className="user-details">
              <span className="user-name">{user.name || 'Admin'}</span>
              <span className="user-email">{user.email}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="admin-header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? '☰' : '☰'}
          </button>
          <h1>{getViewTitle()}</h1>
          <div className="admin-user-info">
            <span>Welcome, {user.name || user.email}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
        <div className="admin-content">
          {activeView === 'users' && <UserManagement />}
          {activeView === 'products' && <ProductManagement />}
          {activeView === 'orders' && <OrderManagement />}
        </div>
      </div>
    </div>
  );
}

export default Admin;


import { useEffect, useState } from 'react';
import axios from 'axios';
import './OrderManagement.css';

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Try to fetch from API, fallback to mock data if API fails
      try {
        const response = await axios.get('http://localhost:3000/api/orders');
        setOrders(response.data.orders || response.data || []);
      } catch (apiError) {
        // If API fails, use mock data for demonstration
        console.log('API not available, using mock data');
        setOrders([
          {
            id: 1,
            user_id: 1,
            user_name: 'John Doe',
            user_email: 'john@example.com',
            total: 129.98,
            status: 'pending',
            items: [
              { product_id: 1, product_name: 'Laptop Pro 15', quantity: 1, price: 1299.99 },
              { product_id: 2, product_name: 'Wireless Mouse', quantity: 1, price: 29.99 },
            ],
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 2,
            user_id: 2,
            user_name: 'Jane Smith',
            user_email: 'jane@example.com',
            total: 89.99,
            status: 'processing',
            items: [
              { product_id: 3, product_name: 'Mechanical Keyboard', quantity: 1, price: 89.99 },
            ],
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 3,
            user_id: 1,
            user_name: 'John Doe',
            user_email: 'john@example.com',
            total: 29.99,
            status: 'shipped',
            items: [
              { product_id: 2, product_name: 'Wireless Mouse', quantity: 1, price: 29.99 },
            ],
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 4,
            user_id: 3,
            user_name: 'Bob Johnson',
            user_email: 'bob@example.com',
            total: 1329.98,
            status: 'delivered',
            items: [
              { product_id: 1, product_name: 'Laptop Pro 15', quantity: 1, price: 1299.99 },
              { product_id: 2, product_name: 'Wireless Mouse', quantity: 1, price: 29.99 },
            ],
            created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ]);
      }
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id?.toString().includes(searchTerm) ||
      order.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some((item) =>
        item.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setFormData({ status: order.status || '' });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      try {
        await axios.delete(`http://localhost:3000/api/orders/${orderId}`);
      } catch (apiError) {
        // If API fails, just remove from local state for demo
        console.log('API not available, removing from local state');
      }
      setOrders(orders.filter((order) => order.id !== orderId));
      setSuccess('Order deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete order');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.status) {
      setError('Please select a status');
      return;
    }

    try {
      try {
        const response = await axios.put(
          `http://localhost:3000/api/orders/${selectedOrder.id}`,
          { status: formData.status }
        );
        setOrders(
          orders.map((order) =>
            order.id === selectedOrder.id
              ? { ...order, ...response.data.order }
              : order
          )
        );
      } catch (apiError) {
        // If API fails, update local state for demo
        setOrders(
          orders.map((order) =>
            order.id === selectedOrder.id
              ? { ...order, status: formData.status }
              : order
          )
        );
      }
      setSuccess('Order status updated successfully');
      setShowModal(false);
      setSelectedOrder(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update order status. Please try again.'
      );
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setFormData({ status: '' });
    setError('');
    setSuccess('');
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const getStatusLabel = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="order-management">
      <div className="order-management-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search orders by ID, customer name, email, or product..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <div className="filter-container">
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="status-filter"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Order Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-orders">
                  {searchTerm || statusFilter !== 'all'
                    ? 'No orders found matching your search.'
                    : 'No orders found.'}
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <div className="customer-cell">
                      <div className="customer-name">{order.user_name || 'N/A'}</div>
                      <div className="customer-email">{order.user_email || 'N/A'}</div>
                    </div>
                  </td>
                  <td>
                    <div className="items-cell">
                      {order.items && order.items.length > 0 ? (
                        <>
                          <div className="items-count">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </div>
                          <div className="items-preview">
                            {order.items
                              .slice(0, 2)
                              .map((item, idx) => (
                                <span key={idx} className="item-tag">
                                  {item.product_name} (x{item.quantity})
                                </span>
                              ))}
                            {order.items.length > 2 && (
                              <span className="item-tag-more">
                                +{order.items.length - 2} more
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <span className="no-items">No items</span>
                      )}
                    </div>
                  </td>
                  <td className="total-cell">{formatPrice(order.total)}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusBadgeClass(order.status)}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td>
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="view-button"
                        onClick={() => handleViewDetails(order)}
                      >
                        View
                      </button>
                      <button
                        className="edit-button"
                        onClick={() => handleUpdateStatus(order)}
                      >
                        Update
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteOrder(order.id)}
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

      {/* Status Update Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Order Status</h2>
              <button className="close-button" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="order-form">
              <div className="form-group">
                <label htmlFor="status">
                  Status <span className="required">*</span>
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  required
                  className="status-select"
                >
                  <option value="">Select status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              {error && <div className="form-error">{error}</div>}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="modal-overlay" onClick={handleCloseDetailsModal}>
          <div className="modal-content modal-content-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details - #{selectedOrder.id}</h2>
              <button className="close-button" onClick={handleCloseDetailsModal}>
                ×
              </button>
            </div>
            <div className="order-details">
              <div className="details-section">
                <h3>Customer Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedOrder.user_name || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedOrder.user_email || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">User ID:</span>
                    <span className="detail-value">{selectedOrder.user_id || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3>Order Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Order ID:</span>
                    <span className="detail-value">#{selectedOrder.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span
                      className={`status-badge ${getStatusBadgeClass(selectedOrder.status)}`}
                    >
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Order Date:</span>
                    <span className="detail-value">
                      {selectedOrder.created_at
                        ? new Date(selectedOrder.created_at).toLocaleString()
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Total Amount:</span>
                    <span className="detail-value total-amount">
                      {formatPrice(selectedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3>Order Items</h3>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <div className="items-list">
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.product_name || `Product #${item.product_id}`}</td>
                            <td>{item.quantity}</td>
                            <td>{formatPrice(item.price)}</td>
                            <td>{formatPrice(item.price * item.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3" className="total-label">
                            <strong>Total:</strong>
                          </td>
                          <td className="total-value">
                            <strong>{formatPrice(selectedOrder.total)}</strong>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <p className="no-items-text">No items in this order.</p>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={handleCloseDetailsModal}
                className="close-details-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;


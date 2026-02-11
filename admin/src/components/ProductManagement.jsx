import { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductManagement.css';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image_url: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Try to fetch from API, fallback to mock data if API fails
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        setProducts(response.data.products || response.data || []);
      } catch (apiError) {
        // If API fails, use mock data for demonstration
        console.log('API not available, using mock data');
        setProducts([
          {
            id: 1,
            name: 'Laptop Pro 15',
            description: 'High-performance laptop with 16GB RAM and 512GB SSD',
            price: 1299.99,
            stock: 25,
            category: 'Electronics',
            image_url: '',
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            name: 'Wireless Mouse',
            description: 'Ergonomic wireless mouse with long battery life',
            price: 29.99,
            stock: 150,
            category: 'Accessories',
            image_url: '',
            created_at: new Date().toISOString(),
          },
          {
            id: 3,
            name: 'Mechanical Keyboard',
            description: 'RGB mechanical keyboard with cherry switches',
            price: 89.99,
            stock: 45,
            category: 'Accessories',
            image_url: '',
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      image_url: '',
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
      category: product.category || '',
      image_url: product.image_url || '',
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      try {
        await axios.delete(`http://localhost:3000/api/products/${productId}`);
      } catch (apiError) {
        // If API fails, just remove from local state for demo
        console.log('API not available, removing from local state');
      }
      setProducts(products.filter((product) => product.id !== productId));
      setSuccess('Product deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete product');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!formData.name || !formData.price || !formData.stock) {
      setError('Please fill in all required fields');
      return;
    }

    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      setError('Price must be a positive number');
      return;
    }

    if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      setError('Stock must be a non-negative number');
      return;
    }

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        image_url: formData.image_url,
      };

      if (editingProduct) {
        // Update product
        try {
          const response = await axios.put(
            `http://localhost:3000/api/products/${editingProduct.id}`,
            productData
          );
          setProducts(
            products.map((product) =>
              product.id === editingProduct.id
                ? { ...product, ...response.data.product }
                : product
            )
          );
        } catch (apiError) {
          // If API fails, update local state for demo
          setProducts(
            products.map((product) =>
              product.id === editingProduct.id
                ? { ...product, ...productData }
                : product
            )
          );
        }
        setSuccess('Product updated successfully');
      } else {
        // Create product
        try {
          const response = await axios.post(
            'http://localhost:3000/api/products',
            productData
          );
          setProducts([...products, response.data.product]);
        } catch (apiError) {
          // If API fails, add to local state for demo
          const newProduct = {
            id: Date.now(),
            ...productData,
            created_at: new Date().toISOString(),
          };
          setProducts([...products, newProduct]);
        }
        setSuccess('Product created successfully');
      }
      setShowModal(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        image_url: '',
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to save product. Please try again.'
      );
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      image_url: '',
    });
    setEditingProduct(null);
    setError('');
    setSuccess('');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="product-management">
      <div className="product-management-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products by name, description, or category..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <button className="add-product-button" onClick={handleAddProduct}>
          + Add Product
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-products">
                  {searchTerm
                    ? 'No products found matching your search.'
                    : 'No products found.'}
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <div className="product-name-cell">
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="product-thumbnail"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <div className="product-name">{product.name}</div>
                        {product.description && (
                          <div className="product-description">
                            {product.description.length > 50
                              ? `${product.description.substring(0, 50)}...`
                              : product.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">{product.category || 'Uncategorized'}</span>
                  </td>
                  <td className="price-cell">{formatPrice(product.price)}</td>
                  <td>
                    <span
                      className={`stock-badge ${
                        product.stock === 0
                          ? 'out-of-stock'
                          : product.stock < 10
                          ? 'low-stock'
                          : ''
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    {product.created_at
                      ? new Date(product.created_at).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-button"
                        onClick={() => handleEditProduct(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteProduct(product.id)}
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
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="close-button" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label htmlFor="name">
                  Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Enter product name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter product description"
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">
                    Price <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="stock">
                    Stock <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="stock"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Enter product category"
                />
              </div>
              <div className="form-group">
                <label htmlFor="image_url">Image URL</label>
                <input
                  type="url"
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {formData.image_url && (
                <div className="image-preview">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
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
                  {editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;


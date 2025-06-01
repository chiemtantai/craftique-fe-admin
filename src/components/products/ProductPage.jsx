import React, { useState } from 'react';
import './ProductPage.css';

const categories = ['Ly', 'Chén', 'Dĩa', 'Chén đĩa secondhand Nhật Bản', 'Ly theo yêu cầu'];

const initialProducts = [
  {
    id: 1,
    name: 'Ly sứ uống nước hình con vịt 400ml',
    price: 135000,
    image: 'https://via.placeholder.com/200',
    category: 'Ly'
  },
  {
    id: 2,
    name: 'Ly cốc sứ có nắp đậy capybara 450ml',
    price: 120000,
    image: 'https://via.placeholder.com/200',
    category: 'Ly'
  },
];

const ProductPage = () => {
  const [products, setProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState('Ly');
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: ''
  });

  const handleAddClick = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const imageUrl = URL.createObjectURL(files[0]);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      id: Date.now(),
      name: formData.name,
      price: parseInt(formData.price),
      image: formData.image,
      category: formData.category
    };
    setProducts([...products, newProduct]);
    setFormData({ name: '', price: '', category: '', image: '' });
    setShowForm(false);
  };

  const filteredProducts = products.filter(p => p.category === selectedCategory);

  return (
    <div className="product-page">
      <button className="add-button" onClick={handleAddClick}>Add</button>

      <aside className="sidebar">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            className={`sidebar-item ${cat === selectedCategory ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </aside>

      <section className="product-grid">
        {filteredProducts.map((p) => (
          <div className="product-card" key={p.id}>
            <img src={p.image} alt={p.name} />
            <h4>{p.name}</h4>
            <p>{p.price.toLocaleString()} VND</p>
          </div>
        ))}
      </section>

      {/* FORM ADD */}
      {showForm && (
        <div className="slide-form">
          <div className="form-header">
            <h3>Add</h3>
            <button className="close-btn" onClick={handleCloseForm}>✖</button>
          </div>

          <form className="form-content" onSubmit={handleSubmit}>
            <label>Tên sản phẩm</label>
            <input name="name" value={formData.name} onChange={handleChange} required />

            <label>Giá tiền</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required />

            <label>Kiểu Sản Phẩm</label>
            <input name="category" value={formData.category} onChange={handleChange} required />

            <label>Hình ảnh</label>
            <input type="file" name="image" accept="image/*" onChange={handleChange} required />

            <div className="form-buttons">
              <button type="submit">Xác nhận</button>
              <button type="button" onClick={handleCloseForm}>Huỷ</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductPage;

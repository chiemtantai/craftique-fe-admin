import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Package, Tag, Image, X } from "lucide-react";
import { Button } from "../../components/ui/button/Button";
import { categoryService } from "../../services/categoryService";
import { productService } from "../../services/productService";
import { productItemService } from "../../services/productItemService";
import "./ProductPage.css";

const ProductPage = () => {
  const [categories, setCategories] = useState([]);
  const [mainProducts, setMainProducts] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [activeTab, setActiveTab] = useState("categories");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });
  const [mainProductForm, setMainProductForm] = useState({
    name: "",
    categoryID: "",
  });
  const [variantForm, setVariantForm] = useState({
    productID: "",
    name: "",
    description: "",
    price: "",
    quantity: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Load data with error handling
  const loadCategories = async () => {
    try {
      setError(null);
      const response = await categoryService.getAll();
      // Handle different response structures
      const data = response.data?.items || response.data || [];
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading categories:", error);
      setError("Không thể tải danh mục sản phẩm");
      setCategories([]);
    }
  };

  const loadProducts = async () => {
    try {
      setError(null);
      const response = await productService.getAll();
      // Handle different response structures
      const data = response.data?.items || response.data || [];
      setMainProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading products:", error);
      setError("Không thể tải sản phẩm chính");
      setMainProducts([]);
    }
  };

  const loadProductItems = async () => {
    try {
      setError(null);
      const response = await productItemService.getAll();
      const data = response.data?.items || [];
      setProductVariants(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading product items:", error);
      setError("Không thể tải biến thể sản phẩm");
      setProductVariants([]);
    }
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
    loadProductItems();
  }, []);

  // Modal handlers
  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setEditingId(null);
    setCategoryForm({ name: "", description: "" });
    setMainProductForm({ name: "", categoryID: "" });
    setVariantForm({
      productID: "",
      name: "",
      description: "",
      price: "",
      quantity: "",
    });
  };

  // CRUD operations with better error handling
  const handleAdd = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      if (
        modalType === "category" &&
        categoryForm.name &&
        categoryForm.description
      ) {
        await categoryService.create(categoryForm);
        await loadCategories();
      } else if (
        modalType === "mainProduct" &&
        mainProductForm.name &&
        mainProductForm.categoryID
      ) {
        await productService.create({
          ...mainProductForm,
          categoryID: parseInt(mainProductForm.categoryID),
        });
        await loadProducts();
      } else if (
        modalType === "variant" &&
        variantForm.productID &&
        variantForm.name &&
        variantForm.description &&
        variantForm.price &&
        variantForm.quantity
      ) {
        await productItemService.create({
          productID: parseInt(variantForm.productID),
          name: variantForm.name,
          description: variantForm.description,
          price: parseFloat(variantForm.price),
          quantity: parseInt(variantForm.quantity),
          displayIndex: 0,
        });
        await loadProductItems();
      }
      closeModal();
    } catch (error) {
      console.error("Error adding:", error);
      setError("Không thể thêm mới. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (type, item) => {
    setModalType(type);
    setEditMode(true);
    setEditingId(item.categoryID || item.productID || item.productItemID);

    if (type === "category") {
      setCategoryForm({
        name: item.name,
        description: item.description,
      });
    } else if (type === "mainProduct") {
      setMainProductForm({
        name: item.name,
        categoryID: item.categoryID.toString(),
      });
    } else if (type === "variant") {
      setVariantForm({
        productID: item.productID.toString(),
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        quantity: item.quantity.toString(),
        updatedProductImgs: item.updatedProductImgs, 
        removeImageIds: item.removeImageIds, 
      });
    }

    setShowModal(true);
  };

  const handleUpdate = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      if (
        modalType === "category" &&
        categoryForm.name &&
        categoryForm.description
      ) {
        await categoryService.update(editingId, categoryForm);
        await loadCategories();
      } else if (
        modalType === "mainProduct" &&
        mainProductForm.name &&
        mainProductForm.categoryID
      ) {
        await productService.update(editingId, {
          ...mainProductForm,
          categoryID: parseInt(mainProductForm.categoryID),
        });
        await loadProducts();
      } else if (
        modalType === "variant" &&
        variantForm.productID &&
        variantForm.name &&
        variantForm.description &&
        variantForm.price &&
        variantForm.quantity
      ) {
        // FIX: Cập nhật theo đúng format API yêu cầu
        const updateData = {
          productID: parseInt(variantForm.productID),
          name: variantForm.name,
          description: variantForm.description,
          quantity: parseInt(variantForm.quantity),
          displayIndex: 0,
          price: parseFloat(variantForm.price),
          updatedProductImgs: [], 
          removeImageIds: [], 
        };
        const response = await productItemService.update(editingId, updateData);

        // FIX: Kiểm tra response có lỗi không
        if (response.data && response.data.error) {
          throw new Error(response.data.error);
        }

        // FIX: Chỉ reload và đóng modal khi thực sự thành công
        if (response.status === 200 && !response.data?.error) {
          await loadProductItems();
          closeModal();
          setError(null); // Clear any previous errors
        }
      }
      closeModal();
    } catch (error) {
      console.error("Error updating:", error);
      setError("Không thể cập nhật. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (loading) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa không?")) return;

    setLoading(true);
    setError(null);

    try {
      if (type === "category") {
        await categoryService.delete(id);
        await loadCategories();
      } else if (type === "mainProduct") {
        await productService.delete(id);
        await loadProducts();
        await loadProductItems();
      } else if (type === "variant") {
        await productItemService.delete(id);
        await loadProductItems();
      }
    } catch (error) {
      console.error("Error deleting:", error);
      setError("Không thể xóa. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Helper functions with correct ID mapping
  const getCategoryName = (categoryID) => {
    if (!Array.isArray(categories)) return "Không xác định";
    const category = categories.find((cat) => cat.categoryID === categoryID);
    return category
      ? `${category.name} (${category.description})`
      : "Không xác định";
  };

  const getMainProductName = (productID) => {
    if (!Array.isArray(mainProducts)) return "Không xác định";
    const product = mainProducts.find((p) => p.productID === productID);
    return product ? product.name : "Không xác định";
  };

  // Fixed: Count variants by productID, not productItemID
  const getVariantCount = (productID) => {
    if (!Array.isArray(productVariants)) return 0;
    return productVariants.filter((v) => v.productID === productID).length;
  };

  // Helper to get first product image
  const getProductImage = (variant) => {
    if (variant.productImgs && variant.productImgs.length > 0) {
      return variant.productImgs[0].imageUrl;
    }
    return "https://via.placeholder.com/150?text=No+Image";
  };

  const tabs = [
    { id: "categories", label: "Danh mục sản phẩm", icon: Tag },
    { id: "mainProducts", label: "Sản phẩm chính", icon: Package },
    { id: "variants", label: "Biến thể sản phẩm", icon: Image },
  ];

  // Error display component
  const ErrorMessage = ({ message }) => (
    <div
      style={{
        background: "#fee",
        color: "#c33",
        padding: "1rem",
        borderRadius: "8px",
        margin: "1rem 0",
        border: "1px solid #fcc",
      }}
    >
      {message}
    </div>
  );

  // Empty state component
  const EmptyState = ({ title, description }) => (
    <div className="empty-state">
      <div className="empty-state-title">{title}</div>
      <div className="empty-state-text">{description}</div>
    </div>
  );

  return (
    <div className="product-page">
      <div className="header">
        <div className="header-content">
          <h1 className="title">Quản lý sản phẩm</h1>
        </div>
      </div>

      <div className="tab-navigation">
        <div className="tab-container">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="content">
        {error && <ErrorMessage message={error} />}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="tab-content">
            <div className="section-header">
              <h2 className="section-title">Danh mục sản phẩm</h2>
              <button
                onClick={() => openModal("category")}
                className="add-button"
              >
                <Plus size={20} />
                Thêm danh mục
              </button>
            </div>

            {!Array.isArray(categories) || categories.length === 0 ? (
              <EmptyState
                title="Chưa có danh mục sản phẩm"
                description="Thêm danh mục đầu tiên để bắt đầu quản lý sản phẩm"
              />
            ) : (
              <div className="cards-grid">
                {categories.map((category) => (
                  <div key={category.categoryID} className="card">
                    <div className="card-content">
                      <div className="card-info">
                        <h3 className="card-title">{category.name}</h3>
                        <p className="card-subtitle">{category.description}</p>
                      </div>
                      <div className="card-actions">
                        <Button
                          variant="edit"
                          size="sm"
                          onClick={() => openEditModal("category", category)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="delete"
                          size="sm"
                          onClick={() =>
                            handleDelete("category", category.categoryID)
                          }
                          disabled={loading}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Products Tab */}
        {activeTab === "mainProducts" && (
          <div className="tab-content">
            <div className="section-header">
              <h2 className="section-title">Sản phẩm chính</h2>
              <button
                onClick={() => openModal("mainProduct")}
                className="add-button"
              >
                <Plus size={20} />
                Thêm sản phẩm
              </button>
            </div>

            {!Array.isArray(mainProducts) || mainProducts.length === 0 ? (
              <EmptyState
                title="Chưa có sản phẩm chính"
                description="Thêm sản phẩm đầu tiên để bắt đầu bán hàng"
              />
            ) : (
              <div className="cards-grid">
                {mainProducts.map((product) => (
                  <div key={product.productID} className="card">
                    <div className="card-content">
                      <div className="card-info">
                        <h3 className="card-title">{product.name}</h3>
                        <p className="card-subtitle">
                          Danh mục: {getCategoryName(product.categoryID)}
                        </p>
                        <p className="card-meta">
                          Số biến thể: {getVariantCount(product.productID)}
                        </p>
                      </div>
                      <div className="card-actions">
                        <Button
                          variant="edit"
                          size="sm"
                          onClick={() => openEditModal("mainProduct", product)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="delete"
                          size="sm"
                          onClick={() =>
                            handleDelete("mainProduct", product.productID)
                          }
                          disabled={loading}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Product Variants Tab */}
        {activeTab === "variants" && (
          <div className="tab-content">
            <div className="section-header">
              <h2 className="section-title">Biến thể sản phẩm</h2>
              <button
                onClick={() => openModal("variant")}
                className="add-button"
              >
                <Plus size={20} />
                Thêm biến thể
              </button>
            </div>

            {!Array.isArray(productVariants) || productVariants.length === 0 ? (
              <EmptyState
                title="Chưa có biến thể sản phẩm"
                description="Thêm biến thể để khách hàng có thể lựa chọn màu sắc, kích thước..."
              />
            ) : (
              <div className="variant-grid">
                {productVariants.map((variant) => (
                  <div key={variant.productItemID} className="variant-card">
                    <div className="variant-content">
                      <div className="variant-image">
                        <img src={getProductImage(variant)} alt="Product" />
                      </div>
                      <div className="variant-info">
                        <h3 className="variant-title">{variant.name}</h3>
                        <p className="variant-product">
                          Sản phẩm: {getMainProductName(variant.productID)}
                        </p>
                        <p className="variant-color">
                          Mô tả: {variant.description}
                        </p>
                        <p className="variant-price">
                          {variant.price?.toLocaleString()}₫
                        </p>
                        <p className="variant-quantity">
                          Số lượng: {variant.quantity}
                        </p>
                      </div>
                      <div className="variant-actions">
                        <Button
                          variant="edit"
                          size="sm"
                          onClick={() => openEditModal("variant", variant)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="delete"
                          size="sm"
                          onClick={() =>
                            handleDelete("variant", variant.productItemID)
                          }
                          disabled={loading}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">
                {editMode
                  ? modalType === "category"
                    ? "Chỉnh sửa danh mục"
                    : modalType === "mainProduct"
                    ? "Chỉnh sửa sản phẩm"
                    : "Chỉnh sửa biến thể"
                  : modalType === "category"
                  ? "Thêm danh mục mới"
                  : modalType === "mainProduct"
                  ? "Thêm sản phẩm mới"
                  : "Thêm biến thể sản phẩm"}
              </h3>
              <button onClick={closeModal} className="modal-close">
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              {modalType === "category" && (
                <div className="form-fields">
                  <div className="form-field">
                    <label className="form-label">Tên danh mục</label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="Tên danh mục"
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Mô tả</label>
                    <input
                      type="text"
                      value={categoryForm.description}
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Mô tả danh mục"
                      className="form-input"
                    />
                  </div>
                </div>
              )}

              {modalType === "mainProduct" && (
                <div className="form-fields">
                  <div className="form-field">
                    <label className="form-label">Tên sản phẩm</label>
                    <input
                      type="text"
                      value={mainProductForm.name}
                      onChange={(e) =>
                        setMainProductForm({
                          ...mainProductForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="Tên sản phẩm"
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Danh mục</label>
                    <select
                      value={mainProductForm.categoryID}
                      onChange={(e) =>
                        setMainProductForm({
                          ...mainProductForm,
                          categoryID: e.target.value,
                        })
                      }
                      className="form-select"
                    >
                      <option value="">Chọn danh mục</option>
                      {Array.isArray(categories) &&
                        categories.map((category) => (
                          <option
                            key={category.categoryID}
                            value={category.categoryID}
                          >
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              )}

              {modalType === "variant" && (
                <div className="form-fields">
                  <div className="form-field">
                    <label className="form-label">Sản phẩm chính</label>
                    <select
                      value={variantForm.productID}
                      onChange={(e) =>
                        setVariantForm({
                          ...variantForm,
                          productID: e.target.value,
                        })
                      }
                      className="form-select"
                    >
                      <option value="">Chọn sản phẩm chính</option>
                      {Array.isArray(mainProducts) &&
                        mainProducts.map((product) => (
                          <option
                            key={product.productID}
                            value={product.productID}
                          >
                            {product.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Tên biến thể</label>
                    <input
                      type="text"
                      value={variantForm.name}
                      onChange={(e) =>
                        setVariantForm({ ...variantForm, name: e.target.value })
                      }
                      placeholder="Tên biến thể"
                      className="form-input"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-field">
                      <label className="form-label">
                        Mô tả (Màu sắc, kích thước...)
                      </label>
                      <input
                        type="text"
                        value={variantForm.description}
                        onChange={(e) =>
                          setVariantForm({
                            ...variantForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Ví dụ: Màu đỏ, Size M"
                        className="form-input"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Số lượng</label>
                      <input
                        type="number"
                        value={variantForm.quantity}
                        onChange={(e) =>
                          setVariantForm({
                            ...variantForm,
                            quantity: e.target.value,
                          })
                        }
                        placeholder="Số lượng"
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Giá tiền (VND)</label>
                    <input
                      type="number"
                      value={variantForm.price}
                      onChange={(e) =>
                        setVariantForm({
                          ...variantForm,
                          price: e.target.value,
                        })
                      }
                      placeholder="Giá tiền"
                      className="form-input"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={closeModal} className="modal-button cancel">
                Hủy
              </button>
              <button
                onClick={editMode ? handleUpdate : handleAdd}
                className="modal-button confirm"
                disabled={loading}
              >
                {loading
                  ? "Đang xử lý..."
                  : editMode
                  ? "Cập nhật"
                  : modalType === "category"
                  ? "Thêm danh mục"
                  : modalType === "mainProduct"
                  ? "Thêm sản phẩm"
                  : "Thêm biến thể"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;

import React, { useState, useEffect } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "../../ui/button/Button";
import { categoryService } from "../../../services/categoryService";
import { productService } from "../../../services/productService";
import { productItemService } from "../../../services/productItemService";
import { productImgService } from "../../../services/productImgService";

const ProductList = ({ activeTab, onEdit, onDelete }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productItems, setProductItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      switch (activeTab) {
        case "categories":
          await fetchCategories();
          break;
        case "products":
          await fetchProducts();
          break;
        case "productItems":
          await fetchProductItems();
          break;
        default:
          break;
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải dữ liệu");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const response = await categoryService.getAll();
    setCategories(response.data || []);
  };

  const fetchProducts = async () => {
    const [productsRes, categoriesRes, itemsRes] = await Promise.all([
      productService.getAll(),
      categoryService.getAll(),
      productItemService.getAll(),
    ]);
    setProducts(productsRes.data || []);
    setCategories(categoriesRes.data || []);
    setProductItems(itemsRes.data?.items || itemsRes.data || []);
  };

  const fetchProductItems = async () => {
    const [itemsRes, productsRes, categoriesRes] = await Promise.all([
      productItemService.getAll(),
      productService.getAll(),
      categoryService.getAll(),
    ]);

    const items = itemsRes.data?.items || [];
    
    const itemsWithImages = await Promise.all(
      items.map(async (item) => {
        try {
          const imagesRes = await productImgService.getAll();
          const allImages = imagesRes.data || [];
          const itemImages = allImages.filter(
            (img) => img.productItemID === item.productItemID && !img.isDeleted
          );

          return {
            ...item,
            images: itemImages,
          };
        } catch (error) {
          console.error("Error fetching images:", error);
          return {
            ...item,
            images: [],
          };
        }
      })
    );

    setProductItems(itemsWithImages);
    setProducts(productsRes.data || []);
    setCategories(categoriesRes.data || []);
  };

  const getCategoryName = (categoryID) => {
    const category = categories.find((cat) => cat.categoryID === categoryID);
    return category ? category.name : "Không xác định";
  };

  const getProductName = (productID) => {
    const product = products.find((p) => p.productID === productID);
    return product ? product.name : "Không xác định";
  };

  const handleDelete = async (type, id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa không?")) {
      await onDelete(type, id);
      fetchData(); // Refresh data after delete
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchData} className="retry-button">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="product-list">
      {activeTab === "categories" && (
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
                    onClick={() => onEdit("category", category)}
                    className="action-button"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="delete"
                    size="sm"
                    onClick={() =>
                      handleDelete("category", category.categoryID)
                    }
                    className="action-button"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "products" && (
        <div className="cards-grid">
          {products.map((product) => (
            <div key={product.productID} className="card">
              <div className="card-content">
                <div className="card-info">
                  <h3 className="card-title">{product.name}</h3>
                  <p className="card-subtitle">{product.description}</p>
                  <p className="card-meta">
                    Danh mục: {getCategoryName(product.categoryID)}
                  </p>
                  <p className="card-meta">
                    Số biến thể:{" "}
                    {
                      productItems.filter(
                        (item) => item.productID === product.productID
                      ).length
                    }
                  </p>
                </div>
                <div className="card-actions">
                  <Button
                    variant="edit"
                    size="sm"
                    onClick={() => onEdit("product", product)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="delete"
                    size="sm"
                    onClick={() => handleDelete("product", product.productID)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "productItems" && (
        <div className="variant-grid">
          {productItems.map((item) => (
            <div key={item.productItemID} className="variant-card">
              <div className="variant-content">
                <div className="variant-image">
                  <img
                    src={
                      item.images && item.images.length > 0
                        ? item.images[0].imageUrl
                        : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=="
                    }
                    alt={item.name}
                  />
                </div>
                <div className="variant-info">
                  <h3 className="variant-title">{item.name}</h3>
                  <p className="variant-color">
                    Sản phẩm: {getProductName(item.productID)}
                  </p>
                  <p className="variant-price">
                    {item.price ? item.price.toLocaleString() : "0"}₫
                  </p>
                  <p className="variant-quantity">
                    Số lượng: {item.quantity || 0}
                  </p>
                  <p className="variant-meta">
                    Hình ảnh: {item.images ? item.images.length : 0}
                  </p>
                </div>
                <div className="variant-actions">
                  <Button
                    variant="edit"
                    size="sm"
                    onClick={() => onEdit("productItem", item)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="delete"
                    size="sm"
                    onClick={() =>
                      handleDelete("productItem", item.productItemID)
                    }
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {((activeTab === "categories" && categories.length === 0) ||
        (activeTab === "products" && products.length === 0) ||
        (activeTab === "productItems" && productItems.length === 0)) && (
        <div className="empty-state">
          <p>Chưa có dữ liệu nào</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;

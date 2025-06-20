import React, { useState, useEffect } from "react";
import { Plus, X, Image as ImageIcon } from "lucide-react";
import { productImgService } from "../../../services/productImgService";

const ProductImg = ({ images = [], onImagesChange, productItemId, isEditing = false }) => {
  const [localImages, setLocalImages] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productItemId && isEditing) {
      fetchImages();
    } else {
      // For new product items, use passed images
      setLocalImages(images.map((img, index) => ({
        imageUrl: typeof img === 'string' ? img : img.imageUrl,
        productImgID: img.productImgID || `temp_${index}`,
        isTemp: !img.productImgID // Mark as temporary for new items
      })));
    }
  }, [productItemId, images, isEditing]);

  const fetchImages = async () => {
    try {
      const response = await productImgService.getAll();
      const allImages = response.data || [];

      // Filter images for this productItemId
      const filteredImages = allImages.filter(
        (img) => img.productItemID === productItemId && !img.isDeleted
      );

      setLocalImages(filteredImages);
      notifyParent(filteredImages, []);
    } catch (error) {
      console.error("Error fetching images:", error);
      setLocalImages([]);
    }
  };

  const notifyParent = (currentImages) => {
    if (isEditing) {
      // For editing mode, return format expected by edit API
      const updatedProductImgs = currentImages.map(img => ({
        imageUrl: img.imageUrl,
        productImgID: img.productImgID
      }));
      
      onImagesChange({
        updatedProductImgs,
      });
    } else {
      // For new product items, just return array of image URLs
      const imageUrls = currentImages.map(img => img.imageUrl);
      onImagesChange(imageUrls);
    }
  };

  const handleAddImage = async () => {
    if (!newImageUrl.trim()) {
      alert("Vui lòng nhập URL hình ảnh");
      return;
    }

    // Validate URL format
    try {
      new URL(newImageUrl);
    } catch (error) {
      alert("URL không hợp lệ", error);
      return;
    }

    setLoading(true);

    try {
      if (productItemId && isEditing) {
        // If editing existing product item, create image via API
        const imageData = {
          imageUrl: [newImageUrl.trim()],
          productItemID: productItemId
        };
        
        const response = await productImgService.create(imageData);
        notifyParent(response);
        // Handle response - refresh images from server
        await fetchImages();
      } else {
        // If adding new product item, just add to local state
        const tempImage = {
          imageUrl: newImageUrl.trim(),
          productImgID: `temp_${Date.now()}`,
          isTemp: true
        };
        
        const updatedImages = [...localImages, tempImage];
        setLocalImages(updatedImages);
        notifyParent(updatedImages);
      }

      setNewImageUrl("");
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding image:", error);
      alert("Có lỗi xảy ra khi thêm hình ảnh");
    } finally {
      setLoading(false);
    }
  };

  const isValidImageUrl = (url) => {
    return url && (url.startsWith("http://") || url.startsWith("https://"));
  };

  return (
    <div className="product-img-container">
      <div className="images-grid">
        {localImages.map((image, index) => (
          <div key={image.productImgID || index} className="image-item">
            <div className="image-wrapper">
              <img
                src={
                  isValidImageUrl(image.imageUrl)
                    ? image.imageUrl
                    : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkludmFsaWQgVVJMPC90ZXh0Pjwvc3ZnPg=="
                }
                alt={`Product ${index + 1}`}
                className="product-image"
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yIExvYWRpbmc8L3RleHQ+PC9zdmc+";
                }}
              />
             
            </div>
          </div>
        ))}

        <div className="add-image-item">
          <button
            className="add-image-btn"
            onClick={() => setShowAddModal(true)}
            title="Thêm hình ảnh"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {localImages.length === 0 && (
        <div className="empty-images">
          <ImageIcon size={48} className="empty-icon" />
          <p>Chưa có hình ảnh nào</p>
          <p className="empty-subtitle">Nhấn "+" để thêm ảnh</p>
        </div>
      )}

      {/* Add Image Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal small-modal">
            <div className="modal-header">
              <h3 className="modal-title">Thêm hình ảnh</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewImageUrl("");
                }}
                className="modal-close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              <div className="form-field">
                <label className="form-label">URL hình ảnh</label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="form-input"
                  autoFocus
                />
                <small className="form-help">
                  Nhập URL hình ảnh hợp lệ (bắt đầu bằng http:// hoặc https://)
                </small>
              </div>

              {newImageUrl && isValidImageUrl(newImageUrl) && (
                <div className="image-preview">
                  <label className="form-label">Xem trước:</label>
                  <img
                    src={newImageUrl}
                    alt="Preview"
                    className="preview-image"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/200x150?text=Cannot+Load+Image";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewImageUrl("");
                }}
                className="modal-button cancel"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                onClick={handleAddImage}
                className="modal-button confirm"
                disabled={loading || !newImageUrl}
              >
                {loading ? "Đang thêm..." : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImg;
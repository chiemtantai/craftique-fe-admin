import React, { useState, useEffect } from "react";
import { Plus, X, Image as ImageIcon } from "lucide-react";
import { productImgService } from "../../../services/productImgService";

const ProductImg = ({ images = [], onImagesChange, productItemId }) => {
  const [localImages, setLocalImages] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productItemId) {
      fetchImages();
    } else {
      setLocalImages(images);
    }
  }, [productItemId, images]);

  const fetchImages = async () => {
    try {
      const response = await productImgService.getAll();
      const allImages = response.data || [];

      // Filter images for this productItemId and exclude deleted ones
      const filteredImages = allImages.filter(
        (img) => img.productItemID === productItemId && !img.isDeleted
      );

      setLocalImages(filteredImages);
      onImagesChange(filteredImages);
    } catch (error) {
      console.error("Error fetching images:", error);
      setLocalImages([]);
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
      if (productItemId) {
        // If we have productItemId, create the image via API with correct structure
        const response = await productImgService.createSingle(
          productItemId,
          newImageUrl.trim()
        );

        // Backend might return different structure, handle accordingly
        let createdImage;
        if (Array.isArray(response.data)) {
          createdImage = response.data[0]; // If backend returns array
        } else {
          createdImage = response.data; // If backend returns single object
        }

        const updatedImages = [...localImages, createdImage];
        setLocalImages(updatedImages);
        onImagesChange(updatedImages);
      } else {
        // If no productItemId (adding new product), just add to local state
        const tempImage = {
          imageUrl: newImageUrl.trim(),
          productItemID: productItemId,
          productImgID: Date.now(), // temporary ID
          isDeleted: false,
        };
        const updatedImages = [...localImages, tempImage];
        setLocalImages(updatedImages);
        onImagesChange(updatedImages);
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

  const handleRemoveImage = async (imageId, index) => {
    try {
      if (productItemId && imageId) {
        // If we have productItemId and imageId, delete via API
        await productImgService.delete(imageId);
      }

      // Remove from local state
      const updatedImages = localImages.filter((_, i) => i !== index);
      setLocalImages(updatedImages);
      onImagesChange(updatedImages);
    } catch (error) {
      console.error("Error removing image:", error);
      alert("Có lỗi xảy ra khi xóa hình ảnh");
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
              <button
                className="remove-image-btn"
                onClick={() => handleRemoveImage(image.productImgID, index)}
                title="Xóa hình ảnh"
              >
                <X size={16} />
              </button>
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
            <span>Thêm hình ảnh</span>
          </button>
        </div>
      </div>

      {localImages.length === 0 && (
        <div className="empty-images">
          <ImageIcon size={48} className="empty-icon" />
          <p>Chưa có hình ảnh nào</p>
          <p className="empty-subtitle">Nhấn "Thêm hình ảnh" để bắt đầu</p>
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

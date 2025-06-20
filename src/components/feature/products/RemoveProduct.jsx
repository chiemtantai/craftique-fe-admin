import { categoryService } from '../../../services/categoryService'
import { productService } from '../../../services/productService';
import { productItemService } from '../../../services/productItemService';
import { productImgService } from '../../../services/productImgService';

const RemoveProduct = {
  // Delete category
  deleteCategory: async (categoryId) => {
    try {
      const productsResponse = await productService.getAll();
      const hasProducts = productsResponse.data.some(product => product.categoryID === categoryId);
      
      if (hasProducts) {
        throw new Error('Không thể xóa danh mục này vì vẫn còn sản phẩm thuộc danh mục');
      }

      await categoryService.delete(categoryId);
      return { success: true, message: 'Đã xóa danh mục thành công' };
    } catch (error) {
      console.error('Error deleting category:', error);
      return { 
        success: false, 
        message: error.message || 'Có lỗi xảy ra khi xóa danh mục' 
      };
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    try {
      if (!productId) {
        throw new Error('Product ID không hợp lệ');
      }
      
      const itemsResponse = await productItemService.getAll();
      let items = [];
      if (itemsResponse?.data?.items && Array.isArray(itemsResponse.data.items)) {
        items = itemsResponse.data.items;
      } else if (itemsResponse?.items && Array.isArray(itemsResponse.items)) {
        items = itemsResponse.items;
      } else if (Array.isArray(itemsResponse?.data)) {
        items = itemsResponse.data;
      } else if (Array.isArray(itemsResponse)) {
        items = itemsResponse;
      }
      
      const hasItems = items.some(item => item.productID == productId);
      
      if (hasItems) {
        throw new Error('Không thể xóa sản phẩm này vì vẫn còn biến thể sản phẩm');
      }

      await productService.delete(productId);
      return { success: true, message: 'Đã xóa sản phẩm thành công' };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { 
        success: false, 
        message: error.message || 'Có lỗi xảy ra khi xóa sản phẩm' 
      };
    }
  },

  // Delete product item
  deleteProductItem: async (productItemId) => {
    try {
      // Xóa tất cả hình ảnh liên quan trước khi xóa product item
      try {
        const imagesResponse = await productImgService.getAll();
        const allImages = imagesResponse.data || [];
        
        // Lọc ra những hình ảnh thuộc về productItemId này
        const imagesToDelete = allImages.filter(image => 
          image.productItemID == productItemId
        );
        
        // Xóa từng hình ảnh (vì không có hàm delete, chúng ta sẽ bỏ qua bước này)
        // Hoặc có thể thông báo cho user biết cần xóa thủ công
        if (imagesToDelete.length > 0) {
          console.warn(`Phát hiện ${imagesToDelete.length} hình ảnh liên quan đến product item ${productItemId}. Cần xóa thủ công hoặc thêm API xóa hình ảnh.`);
        }
        
      } catch (imageError) {
        console.error('Error checking images:', imageError);
        // Không throw error ở đây để tiếp tục xóa product item
      }

      await productItemService.delete(productItemId);
      return { 
        success: true, 
        message: 'Đã xóa biến thể sản phẩm thành công. Lưu ý: Hình ảnh liên quan cần được xóa thủ công.' 
      };
    } catch (error) {
      console.error('Error deleting product item:', error);
      return { 
        success: false, 
        message: error.message || 'Có lỗi xảy ra khi xóa biến thể sản phẩm' 
      };
    }
  },

  delete: async (type, id) => {
    switch (type) {
      case 'category':
        return await RemoveProduct.deleteCategory(id);
      case 'product':
        return await RemoveProduct.deleteProduct(id);
      case 'productItem':
        return await RemoveProduct.deleteProductItem(id);
      default:
        return { 
          success: false, 
          message: 'Loại dữ liệu không hợp lệ' 
        };
    }
  }
};

export default RemoveProduct;
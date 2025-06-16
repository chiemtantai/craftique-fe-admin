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
      try {
        const imagesResponse = await productImgService.getByProductItemId(productItemId);
        const images = imagesResponse.data || [];
        
        const deletePromises = images.map(image => 
          productImgService.delete(image.productImgID)
        );
        await Promise.all(deletePromises);
      } catch (imageError) {
        console.error('Error deleting images:', imageError);
      }

      await productItemService.delete(productItemId);
      return { success: true, message: 'Đã xóa biến thể sản phẩm thành công' };
    } catch (error) {
      console.error('Error deleting product item:', error);
      return { 
        success: false, 
        message: error.message || 'Có lỗi xảy ra khi xóa biến thể sản phẩm' 
      };
    }
  },

  // Delete image
  deleteImage: async (imageId) => {
    try {
      await productImgService.delete(imageId);
      return { success: true, message: 'Đã xóa hình ảnh thành công' };
    } catch (error) {
      console.error('Error deleting image:', error);
      return { 
        success: false, 
        message: error.message || 'Có lỗi xảy ra khi xóa hình ảnh' 
      };
    }
  },

  // Generic delete function
  delete: async (type, id) => {
    switch (type) {
      case 'category':
        return await RemoveProduct.deleteCategory(id);
      case 'product':
        return await RemoveProduct.deleteProduct(id);
      case 'productItem':
        return await RemoveProduct.deleteProductItem(id);
      case 'image':
        return await RemoveProduct.deleteImage(id);
      default:
        return { 
          success: false, 
          message: 'Loại dữ liệu không hợp lệ' 
        };
    }
  }
};

export default RemoveProduct;
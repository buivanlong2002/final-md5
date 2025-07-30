import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ProductEdit.css';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    productCode: '',
    productName: '',
    importDate: '',
    quantity: '',
    categoryId: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [productResponse, categoriesResponse] = await Promise.all([
        fetch(`http://localhost:3001/products/${id}`),
        fetch('http://localhost:3001/categories')
      ]);

      if (!productResponse.ok || !categoriesResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const productData = await productResponse.json();
      const categoriesData = await categoriesResponse.json();

      setProduct(productData);
      setCategories(categoriesData);
      
      // Hiển thị giá trị ban đầu của sản phẩm
      setFormData({
        productCode: productData.productCode,
        productName: productData.productName,
        importDate: productData.importDate,
        quantity: productData.quantity ? productData.quantity.toString() : '',
        categoryId: productData.categoryId ? productData.categoryId.toString() : ''
      });
      
      setLoading(false);
    } catch (err) {
      setError('Không thể tải dữ liệu sản phẩm.');
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    // Kiểm tra mã sản phẩm không được để trống
    if (!formData.productCode) {
      errors.productCode = 'Mã sản phẩm không được để trống';
    } else if (formData.productCode.length > 20) {
      errors.productCode = 'Mã sản phẩm không được dài quá 20 ký tự';
    }

    // Kiểm tra tên sản phẩm không dài quá 100 ký tự
    if (!formData.productName) {
      errors.productName = 'Tên sản phẩm không được để trống';
    } else if (formData.productName.length > 100) {
      errors.productName = 'Tên sản phẩm không được dài quá 100 ký tự';
    }

    // Kiểm tra ngày nhập không được lớn hơn ngày hiện tại
    if (!formData.importDate) {
      errors.importDate = 'Ngày nhập không được để trống';
    } else {
      const importDate = new Date(formData.importDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Đặt thời gian cuối ngày hôm nay
      
      if (importDate > today) {
        errors.importDate = 'Ngày nhập không được lớn hơn ngày hiện tại';
      }
    }

    // Kiểm tra thể loại không được để trống
    if (!formData.categoryId) {
      errors.categoryId = 'Thể loại không được để trống';
    }

    // Kiểm tra số lượng phải là số nguyên lớn hơn 0
    if (!formData.quantity) {
      errors.quantity = 'Số lượng không được để trống';
    } else {
      const quantity = parseInt(formData.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        errors.quantity = 'Số lượng phải là số nguyên lớn hơn 0';
      }
    }

    setValidationErrors(errors);
    
    // Hiển thị toast lỗi nếu có validation errors
    if (Object.keys(errors).length > 0) {
      toast.error('Vui lòng kiểm tra lại thông tin!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Cắt bớt text nếu vượt quá giới hạn thay vì chặn hoàn toàn
    let processedValue = value;
    
    if (name === 'productName' && value.length > 100) {
      processedValue = value.substring(0, 100);
      toast.warning('Tên sản phẩm đã được cắt bớt xuống 100 ký tự!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    
    if (name === 'productCode' && value.length > 20) {
      processedValue = value.substring(0, 20);
      toast.warning('Mã sản phẩm đã được cắt bớt xuống 20 ký tự!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Xóa lỗi validation khi user bắt đầu sửa
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePaste = (e) => {
    const { name } = e.target;
    const pastedText = e.clipboardData.getData('text');
    
    // Kiểm tra độ dài text được paste
    if (name === 'productName' && pastedText.length > 100) {
      e.preventDefault();
      const truncatedText = pastedText.substring(0, 100);
      e.target.value = truncatedText;
      
      setFormData(prev => ({
        ...prev,
        [name]: truncatedText
      }));
      
      toast.warning('Text được paste đã được cắt bớt xuống 100 ký tự!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    
    if (name === 'productCode' && pastedText.length > 20) {
      e.preventDefault();
      const truncatedText = pastedText.substring(0, 20);
      e.target.value = truncatedText;
      
      setFormData(prev => ({
        ...prev,
        [name]: truncatedText
      }));
      
      toast.warning('Text được paste đã được cắt bớt xuống 20 ký tự!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleKeyDown = (e) => {
    const { name } = e.target;
    const currentValue = e.target.value;
    
    // Ngăn chặn nhập thêm ký tự nếu đã đạt giới hạn
    if (name === 'productName' && currentValue.length >= 100 && 
        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'].includes(e.key)) {
      e.preventDefault();
      toast.warning('Tên sản phẩm đã đạt giới hạn 100 ký tự!', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    
    if (name === 'productCode' && currentValue.length >= 20 && 
        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'].includes(e.key)) {
      e.preventDefault();
      toast.warning('Mã sản phẩm đã đạt giới hạn 20 ký tự!', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const updatedProduct = {
        ...product,
        productCode: formData.productCode,
        productName: formData.productName,
        importDate: formData.importDate,
        quantity: parseInt(formData.quantity),
        categoryId: parseInt(formData.categoryId)
      };

      const response = await fetch(`http://localhost:3001/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct)
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      // Hiển thị toast thành công
      toast.success('Cập nhật sản phẩm thành công!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Quay về danh sách sau khi hiển thị toast
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (err) {
      toast.error('Không thể cập nhật sản phẩm. Vui lòng thử lại.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="product-edit-container">
      <h2>Cập nhật thông tin sản phẩm</h2>
      
      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label>Mã sản phẩm:</label>
          <input
            type="text"
            name="productCode"
            value={formData.productCode}
            onChange={handleInputChange}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            required
            maxLength={20}
            placeholder="Nhập mã sản phẩm (tối đa 20 ký tự)"
          />
          <div className={`char-counter ${
            formData.productCode.length >= 18 ? 'danger' : 
            formData.productCode.length >= 15 ? 'warning' : ''
          }`}>
            {formData.productCode.length}/20 ký tự
          </div>
          {validationErrors.productCode && (
            <span className="error-message">{validationErrors.productCode}</span>
          )}
        </div>

        <div className="form-group">
          <label>Tên sản phẩm:</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            required
            maxLength={100}
            placeholder="Nhập tên sản phẩm (tối đa 100 ký tự)"
          />
          <div className={`char-counter ${
            formData.productName.length >= 90 ? 'danger' : 
            formData.productName.length >= 80 ? 'warning' : ''
          }`}>
            {formData.productName.length}/100 ký tự
          </div>
          {validationErrors.productName && (
            <span className="error-message">{validationErrors.productName}</span>
          )}
        </div>

        <div className="form-group">
          <label>Ngày nhập:</label>
          <input
            type="date"
            name="importDate"
            value={formData.importDate}
            onChange={handleInputChange}
            required
          />
          {validationErrors.importDate && (
            <span className="error-message">{validationErrors.importDate}</span>
          )}
        </div>

        <div className="form-group">
          <label>Số lượng:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            required
            min="1"
          />
          {validationErrors.quantity && (
            <span className="error-message">{validationErrors.quantity}</span>
          )}
        </div>

        <div className="form-group">
          <label>Loại sản phẩm:</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            required
          >
            <option value="">Chọn loại sản phẩm</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.categoryName}
              </option>
            ))}
          </select>
          {validationErrors.categoryId && (
            <span className="error-message">{validationErrors.categoryId}</span>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            Lưu thay đổi
          </button>
          <button type="button" onClick={handleCancel} className="cancel-btn">
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit; 
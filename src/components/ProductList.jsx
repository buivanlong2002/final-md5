import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterProducts();
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  }, [products, searchName, searchCategory]);

  const fetchData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch('http://localhost:3001/products'),
        fetch('http://localhost:3001/categories')
      ]);

      if (!productsResponse.ok || !categoriesResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const productsData = await productsResponse.json();
      const categoriesData = await categoriesResponse.json();

      // Sắp xếp sản phẩm theo số lượng tăng dần
    // Sắp xếp sản phẩm theo số lượng giảm dần
const sortedProducts = productsData.sort((a, b) => b.quantity - a.quantity);

      
      setProducts(sortedProducts);
      setCategories(categoriesData);
      setLoading(false);
    } catch (err) {
      toast.error('Không thể tải dữ liệu. Vui lòng kiểm tra kết nối server.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Tìm kiếm theo tên sản phẩm (gần đúng)
    if (searchName) {
      filtered = filtered.filter(product =>
        product.productName.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Tìm kiếm theo thể loại
    if (searchCategory) {
      filtered = filtered.filter(product =>
        product.categoryId.toString() === searchCategory
      );
    }

    setFilteredProducts(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCategoryName = (categoryId) => {
    // Chuyển đổi categoryId thành string để so sánh với id của categories
    const category = categories.find(cat => cat.id === categoryId.toString());
    return category ? category.categoryName : 'Không xác định';
  };

  const handleRefresh = () => {
    setSearchName('');
    setSearchCategory('');
    setCurrentPage(1);
    fetchData();
    
    // Hiển thị toast thông báo làm mới
    toast.info('Đã làm mới dữ liệu!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Tính toán phân trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="product-list-container">
      <div className="search-section">
        <h2>Tìm kiếm sản phẩm</h2>
        <div className="search-controls">
          <div className="search-input">
            <label>Tên sản phẩm:</label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Nhập tên sản phẩm..."
            />
          </div>
          <div className="search-input">
            <label>Thể loại:</label>
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            >
              <option value="">Tất cả thể loại</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleRefresh} className="refresh-btn">
            Làm mới
          </button>
        </div>
      </div>

      <div className="products-section">
        <h2>Danh sách sản phẩm</h2>
        {filteredProducts.length === 0 ? (
          <div className="no-results">
            Không tìm thấy sản phẩm
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Mã sản phẩm</th>
                    <th>Tên sản phẩm</th>
                    <th>Ngày nhập</th>
                    <th>Số lượng</th>
                    <th>Loại sản phẩm</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map(product => (
                    <tr key={product.id}>
                      <td>{product.productCode}</td>
                      <td>{product.productName}</td>
                      <td>{formatDate(product.importDate)}</td>
                      <td>{product.quantity}</td>
                      <td>{getCategoryName(product.categoryId)}</td>
                      <td>
                        <Link to={`/edit/${product.id}`} className="edit-btn">
                          Cập nhật
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="pagination">
                <div className="pagination-info">
                  Hiển thị {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} 
                  trong tổng số {filteredProducts.length} sản phẩm
                </div>
                <div className="pagination-controls">
                  <button 
                    onClick={handlePreviousPage} 
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    Trước
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  
                  <button 
                    onClick={handleNextPage} 
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductList from './components/ProductList';
import ProductEdit from './components/ProductEdit';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Hệ thống quản lý sản phẩm - Đại lý Clothing</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/edit/:id" element={<ProductEdit />} />
          </Routes>
        </main>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;

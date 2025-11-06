// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; // We will create this next
import Footer from './components/Footer'; // We will create this next
import HomeScreen from './screens/HomeScreen'; // We will create this next
import LoginScreen from './screens/LoginScreen'; // Placeholder for now
import RegisterScreen from './screens/RegisterScreen';
import CartScreen from './screens/CartScreen';
import ProductScreen from './screens/ProductScreen';
import ProtectedRoute from './components/ProtectedRoute'; // For protected routes
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrderScreen from './screens/OrderScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/admin/ProductListScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen"> {/* Tailwind utility to set min-height to 100vh */}
        <Header />

        <main className="flex-grow p-4 md:p-8 container mx-auto">
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<HomeScreen />} exact />
            <Route path="/page/:pageNumber" element={<HomeScreen />} />
            <Route path="/search/:keyword" element={<HomeScreen />} />
            <Route path="/search/:keyword/page/:pageNumber" element={<HomeScreen />} />
            {/* Placeholder routes (to be implemented) */}
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />

            {/* ADMIN ROUTES (Protected routes will be implemented later) */}
            <Route path='' element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/shipping" element={<ShippingScreen />} />
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
            </Route>
            {/* **PROTECTED ADMIN ROUTES** */}
            <Route path='' element={<AdminRoute />}>
              <Route path='/admin/productlist' element={<ProductListScreen />} />
              <Route path="/admin/productlist/page/:pageNumber" element={<ProductListScreen />} />
              <Route path='/admin/product/:id/edit' element={<ProductEditScreen />} />
            </Route>
          </Routes>
        </main>
        <ToastContainer />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
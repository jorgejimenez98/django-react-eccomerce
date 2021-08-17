import { HashRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/homeScreen";
import ProductScreen from "./screens/productScreen";
import CartScreen from "./screens/cartScreen";
import LoginScreen from "./screens/loginScreen";
import RegisterScreen from "./screens/registerScreen";
import ProfileScreen from "./screens/profileScreen";
import ShippingScreen from "./screens/shippingScreen";
import PaymentScreen from "./screens/paymentScreen";
import PlaceOrder from "./screens/placeOrderScreen";
import OrderScreen from "./screens/orderScreen";
import UserListScreen from "./screens/userListScreen";
import EditUserScreen from "./screens/userEditScreen";
import ProductListScreen from "./screens/productListScreen";
import EditProductScreen from "./screens/productEditScreen";
import OrderListScreen from "./screens/OrderListScreen";

// BrowserRouter => Usar este cuando estes usando solo react
// HashRouter => Usar este cuando se ponga el proyecto de react en el servidor de django
function App() {
  return (
    <Router>
      <Header />

      <main className="py-3">
        <Container>
          <Route path="/" component={HomeScreen} exact />
          <Route path="/product/:id" component={ProductScreen} />
          <Route path="/order/:id" component={OrderScreen} />
          <Route path="/cart/:id?" component={CartScreen} />
          <Route path="/login" component={LoginScreen} />
          <Route path="/register" component={RegisterScreen} />
          <Route path="/profile" component={ProfileScreen} />
          <Route path="/shipping" component={ShippingScreen} />
          <Route path="/payment" component={PaymentScreen} />
          <Route path="/placeorder" component={PlaceOrder} />
          <Route path="/admin/userList" component={UserListScreen} />
          <Route path="/admin/user/:id/edit" component={EditUserScreen} />
          <Route path="/admin/productList" component={ProductListScreen} />
          <Route path="/admin/product/:id/edit" component={EditProductScreen} />
          <Route path="/admin/orders" component={OrderListScreen} />
        </Container>
      </main>

      <Footer />
    </Router>
  );
}

export default App;

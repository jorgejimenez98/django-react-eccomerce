import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Message from "../components/message";
import CheckoutSteps from "../components/checkoutSteps";
import { createOrder } from "../redux/actions/orderAction";
import { ORDER_CREATE_RESET } from '../redux/constants/orderConstants'

function PlaceOrder({history}) {
  const orderCreate = useSelector(state => state.orderCreate);
  const {order, error, success} = orderCreate;

  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  cart.itemPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);
  cart.shippingPrice = (cart.itemPrice > 100 ? 0 : 10).toFixed(2);
  cart.taxPrice = (0.082 * cart.itemPrice).toFixed(2);
  cart.totalPrice = (Number(cart.itemPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2);

  if (!cart.paymentMethod) {
    history.push('/payment');
    dispatch({type: ORDER_CREATE_RESET})
  }

  useEffect(() => {
    if (success) {
      console.log(success);
      history.push(`/order/${order._id}`);
    }
  }, [history, success, order]);

  const placeOrder = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAdress: cart.shippingAdress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  return (
    <React.Fragment>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        {/* LADO IZQ */}
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Direccion</h2>
              <p>
                <strong>Direccion </strong>
                {cart.shippingAdress.adress}, {cart.shippingAdress.city},{"   "}
                {cart.shippingAdress.postalCode}
                {"   "}
                {cart.shippingAdress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Tipo de Pago</h2>
              <p>
                <strong>Metodo: </strong>
                {cart.paymentMethod}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Productos de la compra</h2>
              {cart.cartItems.length === 0 ? (
                <Message variant="info">Su carrito esta vacio</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.qty} x ${item.price} ={" "}
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* LADO DERECHO */}
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Total a pagar</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Productos:</Col>
                  <Col>${cart.itemPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Domicilio:</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Impuestos:</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total a pagar:</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                {error && <Message variant='danger'>{error}</Message>}
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrder}
                  type="button"
                  className="btn-block"
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default PlaceOrder;

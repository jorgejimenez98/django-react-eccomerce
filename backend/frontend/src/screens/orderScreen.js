import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Message from "../components/message";
import Loader from "../components/loader";
import { getOrderDetails, deliverOrder } from "../redux/actions/orderAction";
import { ORDER_DELIVER_RESET } from "../redux/constants/orderConstants";

function OrderScreen({ match, history }) {
  const orderId = match.params.id;
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { success: successDeliver, loading: loadingDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading && !error) {
    order.itemPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
  }

  useEffect(() => {
    if (!order || order._id !== Number(orderId) || successDeliver) {
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, order, orderId, successDeliver]);

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <React.Fragment>
      <h1>Orden: {order._id}</h1>
      <Row>
        {/* LADO IZQ */}
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Direccion</h2>
              <p>
                <strong>Nombre: </strong> {order.user.name}
                <strong> Correo: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Direccion </strong>
                {order.shippingAdress.adress}, {order.shippingAdress.city},
                {"   "}
                {order.shippingAdress.postalCode}
                {"   "}
                {order.shippingAdress.country}
              </p>

              {order.isDelivered ? (
                <Message variant="success">
                  Entregado el {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="warning">No se ha entregado</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Tipo de Pago</h2>
              <p>
                <strong>Metodo: </strong>
                {order.paymentMethod}
              </p>

              {order.isPaid ? (
                <Message variant="success">Pagada el {order.paidAt}</Message>
              ) : (
                <Message variant="warning">No se ha pagado</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Productos de la orden</h2>
              {order.orderItems.length === 0 ? (
                <Message variant="info">Su orden esta vacia</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
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
                  <Col>${order.itemPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Domicilio:</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Impuestos:</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total a pagar:</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {/*  order.isPaid && */}
              {userInfo &&
                userInfo.isAdmin &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    {loadingDeliver && <Loader />}
                    <Button
                      type="button"
                      onClick={deliverHandler}
                      className="btn btn-block"
                    >
                      Marcar como entregado
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default OrderScreen;

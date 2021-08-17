import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import {
  getUserDetails,
  updateUserProfile,
} from "../redux/actions/userActions";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Message from "../components/message";
import Loader from "../components/loader";
import { USER_UPDATE_PROFILE_RESET } from "../redux/constants/userConstants";
import { getUserOrders } from "../redux/actions/orderAction";

function ProfileScreen({ history }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { user, error, loading } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const updateUserProfiles = useSelector((state) => state.userUpdateProfile);
  const { sucess } = updateUserProfiles;

  const userOrders = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, orders, error: errorOrders } = userOrders;

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Las contrasennas no coinciden");
    } else {
      dispatch(
        updateUserProfile({
          id: user._id,
          name: name,
          email: email,
          password: password,
        })
      );
      setPassword("");
      setConfirmPassword("");
      setMessage("");
    }
  };

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      if (!user || !user.name || sucess || userInfo._id !== user._id) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails("profile"));
        dispatch(getUserOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [user, history, userInfo, dispatch, sucess]);

  return (
    <Row>
      <Col md={3}>
        <h2>Perfil</h2>

        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}

        <Form onSubmit={submitHandler}>
          {/* Nombre */}
          <Form.Group controlId="name">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="name"
              placeholder="Escribe aqui el nombre"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              required
            ></Form.Control>
          </Form.Group>

          {/* Correo */}
          <Form.Group controlId="email">
            <Form.Label>Direccion de Correo</Form.Label>
            <Form.Control
              type="email"
              placeholder="Escribe aqui el correo"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            ></Form.Control>
          </Form.Group>

          {/* Contrasenna */}
          <Form.Group controlId="password">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Escribe aqui"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>

          {/* Contrasenna */}
          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirma aqui"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary">
            Actualizar Perfil
          </Button>
        </Form>
      </Col>

      <Col>
        <h2>Mis ordenes</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant="danger">{errorOrders}</Message>
        ) : (
          <Table striped responsive className="table-sm">
            <thead>
              <th>ID</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Pagado?</th>
              <th></th>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className="btn btnsm"> Detalles</Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
}

export default ProfileScreen;

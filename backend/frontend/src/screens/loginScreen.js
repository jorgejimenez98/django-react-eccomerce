import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/actions/userActions";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import Loader from "../components/loader";
import Message from "../components/message";
import FormContainer from "../components/FormContainer";

function LoginScreen({ location, history }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const redirect = location.search ? location.search.split("=")[1] : "/";

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, userInfo, error } = userLogin;

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, redirect, userInfo]);

  return (
    <FormContainer>
      <h1>Acceder</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}

      <Form onSubmit={submitHandler}>
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

        <Button type="submit" variant="primary">
          Acceder
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          Nueva cuenta ?
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
            Registrarse
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
}

export default LoginScreen;

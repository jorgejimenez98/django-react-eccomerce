import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/actions/userActions";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import Message from "../components/message";
import FormContainer from "../components/FormContainer";

function RegisterScreen({ location, history }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo } = userRegister;

  const redirect = location.search ? location.search.split("=")[1] : "/";

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Las contrasennas no coinciden");
    } else {
      dispatch(registerUser(name, email, password));
    }
  };

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, redirect, userInfo]);

  return (
    <FormContainer>
      <h1>Acceder</h1>
      {message && <Message variant="danger">{message}</Message>}

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
            required
          ></Form.Control>
        </Form.Group>

        {/* Contrasenna */}
        <Form.Group controlId="confirmPassoword">
          <Form.Label>Confirmar Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirma aqui"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            required
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          Acceder
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          Ya tienes cuenta ?
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            Accede aqui
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
}

export default RegisterScreen;

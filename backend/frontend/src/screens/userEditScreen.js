import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, updateUser } from "../redux/actions/userActions";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../components/message";
import Loader from "../components/loader";
import FormContainer from "../components/FormContainer";
import { USER_UPDATE_RESET } from "../redux/constants/userConstants";

function EditUserScreen({ match, history }) {
  const userId = match.params.id;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { user, loading, error } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    success: successUpdate,
    loading: loadingUpdate,
    error: errorUpdate,
  } = userUpdate;

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: user._id, name, email, isAdmin }));
  };

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      history.push("/admin/userList");
    } else {
      if (!user.name || user._id !== Number(userId)) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [dispatch, user, userId, successUpdate, history]);

  return (
    <React.Fragment>
      <Link to="/admin/userList">Volver Al Listado</Link>
      <FormContainer>
        <h1>Editar Usuario</h1>

        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
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
              ></Form.Control>
            </Form.Group>

            {/* Is Admin */}
            <Form.Group controlId="isAdmin">
              <Form.Check
                type="checkbox"
                label="Es Admistrador"
                checked={isAdmin}
                onChange={(e) => {
                  setIsAdmin(e.target.checked);
                }}
              ></Form.Check>
            </Form.Group>

            <Button type="submit" variant="primary">
              Actualizar
            </Button>
          </Form>
        )}
      </FormContainer>
    </React.Fragment>
  );
}

export default EditUserScreen;

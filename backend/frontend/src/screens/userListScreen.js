import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserList, deleteUser } from "../redux/actions/userActions";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import Message from "../components/message";
import Loader from "../components/loader";

function UserListScreen({history}) {
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.userList);
  const { users, loading, error } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success : successDelete } = userDelete;

  useEffect(() => {
      if (userInfo && userInfo.isAdmin) {
        dispatch(getUserList());
      } else {
        history.push('/login')
      }
  }, [dispatch, history, userInfo, successDelete]);

  const deleteHandler = (id) => {
    if (window.confirm(`Seguro que desea eliminar el usuario?`)) {
      dispatch(deleteUser(id))
    }
  };

  return (
    <React.Fragment>
      <h1>Listado de Usuarios</h1>
      {successDelete && (
        <Message variant='success'>Usuario Eliminado satisfactoriamente</Message>
      )}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered responsive hover className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Administrador</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck color="green" />
                  ) : (
                    <FaCheck color="blue" />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant="light" className="btn btn-sm">
                      <FaEdit color="gray" />
                    </Button>
                  </LinkContainer>

                  <Button
                    variant="danger"
                    className="btn btn-sm ml-2"
                    onClick={() => deleteHandler(user._id)}
                  >
                    <FaTrash color="white" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </React.Fragment>
  );
}

export default UserListScreen;

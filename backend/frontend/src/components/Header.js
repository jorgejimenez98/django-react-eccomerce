import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaCartArrowDown, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { logout } from "../redux/actions/userActions";
import SearchBox from './searchBox'

function Header() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar bg="dark" expand="lg" variant="dark" collapseOnSelect>
        <Container>
          <Link to="/">
            <Navbar.Brand>ProShop</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <SearchBox/>
            <Nav className="ml-auto">
              <LinkContainer to="/cart">
                <Nav.Link>
                  <FaCartArrowDown /> Cart
                </Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Perfil de Usuario</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <FaUser /> Login
                  </Nav.Link>
                </LinkContainer>
              )}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown title={"Administrador"} id="adminMenu">
                  <LinkContainer to="/admin/userList">
                    <NavDropdown.Item>Usuarios</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/productList">
                    <NavDropdown.Item>Productos</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/orders">
                    <NavDropdown.Item>Pedidos</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;

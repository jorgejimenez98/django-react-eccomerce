import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listProducts,
  deleteProduct,
  createProduct,
} from "../redux/actions/productActions";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Message from "../components/message";
import Loader from "../components/loader";
import Paginate from "../components/Paginate";
import { PRODUCT_CREATE_RESET } from "../redux/constants/productConstants";

function ProductListScreen({ history, match }) {
  const dispatch = useDispatch();
  const productsList = useSelector((state) => state.productsList);
  const { products, loading, error, page, pages } = productsList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productDelete = useSelector((state) => state.deleteProduct);
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.createProduct);
  const {
    loading: loadingCreate,
    success: succesCreate,
    error: errorCreate,
    product: productCreated,
  } = productCreate;

  let keyword = history.location.search;
  
  // USE EFFECT
  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    if (userInfo && !userInfo.isAdmin) {
      history.push("/login");
    }

    if (succesCreate) {
      history.push(`/admin/product/${productCreated._id}/edit`);
    } else {
      dispatch(listProducts());
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    productCreated,
    succesCreate,
    keyword,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm(`Seguro que desea eliminar este producto?`)) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <React.Fragment>
      <Row className="align-items-center">
        <Col>
          <h1>Listado de Productos</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <FaPlus /> {"  "}
            Insertar Producto
          </Button>
        </Col>
      </Row>

      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}

      {successDelete && (
        <Message variant="success">
          Producto eliminado satisfactoriamente
        </Message>
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Table striped bordered responsive hover className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Categoria</th>
                <th>Marca</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn btn-sm">
                        <FaEdit color="gray" />
                      </Button>
                    </LinkContainer>

                    <Button
                      variant="danger"
                      className="btn btn-sm ml-2"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash color="white" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate page={page} pages={pages} isAdmin={true}/>
        </div>
      )}
    </React.Fragment>
  );
}

export default ProductListScreen;

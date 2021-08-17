import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Button,
  Card,
  Image,
  ListGroupItem,
  Form,
} from "react-bootstrap";
import Rating from "../components/rating";
import Loader from "../components/loader";
import Message from "../components/message";
import { useDispatch, useSelector } from "react-redux";
import {
  listProductsDetails,
  createProductReview,
} from "../redux/actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../redux/constants/productConstants";

function ProductScreen({ match, history }) {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    loading: loadingReview,
    error: errorReview,
    success: successReview,
  } = productReviewCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (successReview) {
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductsDetails(match.params.id));
  }, [dispatch, match.params.id, successReview]);

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview(match.params.id, rating, comment));
  };

  return (
    <div>
      <Link to="/" className="btn btn-light my-3 ">
        Volver
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>

            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} vistas`}
                    color={"#f8e825"}
                  />
                </ListGroup.Item>

                <ListGroup.Item>Precio: ${product.price}</ListGroup.Item>

                <ListGroup.Item>
                  Descripcion: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroupItem>
                    <Row>
                      <Col>Precio</Col>
                      <Col>${product.price}</Col>
                    </Row>
                  </ListGroupItem>

                  <ListGroupItem>
                    <Row>
                      <Col>¿Stock?</Col>
                      <Col>{product.countInStock > 0 ? "Si" : "No"}</Col>
                    </Row>
                  </ListGroupItem>

                  {/* SE CREA UN ARRAY PARA SELECCIONAR LA CANTIDAD DE PRODUCTOS DEPENDIENDO DE SU EXISTENCIA Y SE MUESTRAN LOS DATOS EN UN SELECT */}
                  {product.countInStock > 0 && (
                    <ListGroupItem>
                      <Row>
                        <Col>Cantidad</Col>
                        <Col xs="auto" className="my-1">
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option value={x + 1} key={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroupItem>
                  )}

                  <ListGroupItem>
                    <Button
                      className="btn btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Agregar al carrito
                    </Button>
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h4>Review</h4>
              {product.reviews.length === 0 && (
                <Message variant="info">No hay review</Message>
              )}

              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} color="#f8e825" />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}

                <ListGroup.Item>
                  <h4>Comenta el producto</h4>
                  {loadingReview && <Loader />}
                  {successReview && (
                    <Message variant="success">{successReview}</Message>
                  )}
                  {errorReview && (
                    <Message variant="danger">{errorReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                          as="select"
                        >
                          <option value="">Selecciona</option>
                          <option value="1">1 - Muy Mal</option>
                          <option value="2">2 - Mal</option>
                          <option value="3">3 - Regular</option>
                          <option value="4">4 - Bien</option>
                          <option value="5">5 - Excelente</option>
                        </Form.Control>
                      </Form.Group>

                      <Form.Group controlId="comment">
                        <Form.Label>Comentario</Form.Label>
                        <Form.Control
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          as="textarea"
                          row="5"
                        ></Form.Control>
                      </Form.Group>

                      <Button
                        disabled={loadingReview}
                        type="submit"
                        variant="primary"
                      >
                        Agregar Comentario
                      </Button>
                    </Form>
                  ) : (
                    <Message variant="info">
                      Por favor, <Link to="/login">accede al sistema</Link> para
                      comentar
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

export default ProductScreen;

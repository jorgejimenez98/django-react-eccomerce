import React, { useEffect, Fragment } from "react";
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../redux/actions/productActions";
import Product from "../components/product";
import Loader from "../components/loader";
import Message from "../components/message";
/* import Paginate from "../components/Paginate"; */

function HomeScreen({ history }) {
  const dispatch = useDispatch();
  const productsList = useSelector((state) => state.productsList);
  const { error, loading, products, } = productsList;

  // pages, page
  let keyword = history.location.search;

  useEffect(() => {
    dispatch(listProducts(keyword));
  }, [dispatch, keyword]);

  return (
    <Fragment>
      <h1 className="text-center mt-2">Ultimos Productos</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Row>
            {products.map((product) => (
              <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                <Product product={product} />
              </Col>
            ))}
          </Row> 
          {/* <Paginate page={page} pages={pages} keyword={keyword} /> */}
        </div>
      )}
    </Fragment>
  );
}

export default HomeScreen;

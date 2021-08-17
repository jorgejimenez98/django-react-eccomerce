import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listProductsDetails,
  updateProduct,
} from "../redux/actions/productActions";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../components/message";
import Loader from "../components/loader";
import FormContainer from "../components/FormContainer";
import { PRODUCT_UPDATE_RESET } from "../redux/constants/productConstants";
import axios from "axios";
import proxy from "../publicvariables";

function EditProductScreen({ match, history }) {
  const productId = match.params.id;
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(0);
  const [brand, setBrand] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { product, loading, error } = productDetails;

  const updateProductSelector = useSelector((state) => state.updateProduct);
  const {
    success: successUpdate,
    loading: loadingUpdate,
    error: errorUpdate,
  } = updateProductSelector;

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        image,
        price,
        brand,
        countInStock,
        category,
        description,
      })
    );
  };

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      history.push("/admin/productList");
    } else {
      if (!product.name || product._id !== Number(productId)) {
        dispatch(listProductsDetails(productId));
      } else {
        setName(product.name);
        setImage(product.image);
        setPrice(product.price);
        setBrand(product.brand);
        setCountInStock(product.countInStock);
        setCategory(product.category);
        setDescription(product.description);
      }
    }
  }, [dispatch, product, productId, successUpdate, history]);

  const uploadFileHandler = async (e) => {
    setUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    formData.append("product_id", productId);
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post(
        `${proxy}/api/products/upload/`,
        formData,
        config
      );

      setImage(data);
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  return (
    <React.Fragment>
      <Link to="/admin/productList">Volver Al Listado</Link>
      <FormContainer>
        <h1>Editar Producto</h1>

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

            {/* Precio */}
            <Form.Group controlId="price">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                placeholder="Escribe aqui el precio del prodcuto"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>

            {/* Image */}
            <Form.Group controlId="image">
              <Form.Label>Imagen</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escribe aqui la imagen"
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                }}
              ></Form.Control>
              <Form.File
                id="imageFile"
                onChange={uploadFileHandler}
                custom
                label="Imagen"
              ></Form.File>
              {uploading && <Loader />}
            </Form.Group>

            {/* Marca */}
            <Form.Group controlId="brand">
              <Form.Label>Marca</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escribe aqui la marca"
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>

            {/* Cantidad Disponible */}
            <Form.Group controlId="countInStock">
              <Form.Label>Cantidad Disponible</Form.Label>
              <Form.Control
                type="number"
                placeholder="Escribe aqui la cantidad Disponible"
                value={countInStock}
                onChange={(e) => {
                  setCountInStock(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>

            {/* Categoria */}
            <Form.Group controlId="category">
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escribe aqui la categoria"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>

            {/* Descipcion */}
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escribe aqui la descripcion"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              ></Form.Control>
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

export default EditProductScreen;

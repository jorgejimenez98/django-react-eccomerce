import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAdress } from "../redux/actions/cartActions";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/checkoutSteps";

function ShippingScreen({ history }) {
  const cart = useSelector((state) => state.cart);
  const { shippingAdress } = cart;
  const dispatch = useDispatch();

  const [adress, setAdress] = useState(
    shippingAdress ? shippingAdress.adress : ""
  );
  const [city, setCity] = useState(shippingAdress ? shippingAdress.city : "");
  const [postalCode, setPostalCode] = useState(
    shippingAdress ? shippingAdress.postalCode : ""
  );
  const [country, setCountry] = useState(
    shippingAdress ? shippingAdress.country : ""
  );

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAdress({ adress, city, postalCode, country }));
    history.push("/payment");
  };

  return (
    <React.Fragment>
      <CheckoutSteps step1 step2 />
      <FormContainer>
        <h1>Direccion</h1>
        <Form onSubmit={submitHandler}>
          {/* ADRESS */}
          <Form.Group controlId="adress">
            <Form.Label>Direccion</Form.Label>
            <Form.Control
              type="text"
              placeholder="Escribe aqui la direccion"
              value={adress ? adress : ""}
              onChange={(e) => {
                setAdress(e.target.value);
              }}
              required
            ></Form.Control>
          </Form.Group>

          {/* CITY */}
          <Form.Group controlId="city">
            <Form.Label>Ciudad</Form.Label>
            <Form.Control
              type="text"
              placeholder="Escribe aqui la ciudad"
              value={city ? city : ""}
              onChange={(e) => {
                setCity(e.target.value);
              }}
              required
            ></Form.Control>
          </Form.Group>

          {/* POSTAL CODE */}
          <Form.Group controlId="postalCode">
            <Form.Label>Codigo Postal</Form.Label>
            <Form.Control
              type="text"
              placeholder="Escribe aqui el codigo postal"
              value={postalCode ? postalCode : ""}
              onChange={(e) => {
                setPostalCode(e.target.value);
              }}
              required
            ></Form.Control>
          </Form.Group>

          {/* COUNTRY */}
          <Form.Group controlId="country">
            <Form.Label>Pais</Form.Label>
            <Form.Control
              type="text"
              placeholder="Escribe aqui el nombre del pais"
              value={country ? country : ""}
              onChange={(e) => {
                setCountry(e.target.value);
              }}
              required
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary">
            Continue
          </Button>
        </Form>
      </FormContainer>
    </React.Fragment>
  );
}

export default ShippingScreen;

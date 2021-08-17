import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { savePaymentMethod } from "../redux/actions/cartActions";
import { Form, Button, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/checkoutSteps";

function PaymentScreen({ history }) {
  const cart = useSelector((state) => state.cart);
  const { shippingAdress } = cart;
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState("PayPpal");

  if (!shippingAdress.adress) {
    history.push("/shipping");
  }

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push("/placeorder");
  };

  return (
    <React.Fragment>
      <CheckoutSteps step1 step2 step3 />
      <FormContainer>
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label as="legend">Seleccion forma de pago</Form.Label>
            <Col>
              <Form.Check
                name="paymentMethod"
                checked
                type="radio"
                label="Paypal or Credit Card"
                id="paypal"
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </Col>
          </Form.Group>

          <Button type="submit" variant="primary">
            Continuar
          </Button>
        </Form>
      </FormContainer>
    </React.Fragment>
  );
}

export default PaymentScreen;

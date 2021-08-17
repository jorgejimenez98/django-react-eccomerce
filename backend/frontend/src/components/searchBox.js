import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";

function SearchBox() {
  const [keyWord, setkeyWord] = useState("");

  let history = useHistory();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyWord) {
      history.push(`/?keyword=${keyWord}%page=1`);
    } else { 
      // Volver a la pagina original en q se encuentra el usuario
      history.push(history.push(history.location.pathname));
    }
  };
  return (
    <Form onSubmit={submitHandler} inline>
      <Form.Control
        type="text"
        name="q"
        value={keyWord}
        onChange={(e) => setkeyWord(e.target.value)}
        className="mr-sm-2 ml-sm-5"
      ></Form.Control>
      <Button type="submit" variant="outline-success" className="p-2">
        Buscar
      </Button>
    </Form>
  );
}

export default SearchBox;

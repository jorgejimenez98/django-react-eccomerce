import React from "react";
import { Spinner } from "react-bootstrap";

function Loader() {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        height: "100px",
        with: "100px",
        margin: "auto",
        display: "block",
      }}
    >
      <span className="sr-only">Cargando...</span>
    </Spinner>
  );
}

export default Loader;

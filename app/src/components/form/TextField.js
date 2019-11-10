import React from "react";
import { FormControl } from "react-bootstrap";

const TextField = ({ input, meta, type, placeholder, min, max }) => {
  return (
    <FormControl
      type={type}
      placeholder={placeholder}
      min={min}
      max={max}
      value={input.value}
      onChange={input.onChange}
    />
  );
};

export default TextField;

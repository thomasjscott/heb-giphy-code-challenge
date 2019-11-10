import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import TextField from "../components/form/TextField";
import Container from "react-bootstrap/Form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
class Login extends Component {
  onSubmit() {
    console.log("Submitting");
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <Container>
        <Row className="justify-content-center">
          <Col xs="auto" sm="4" md="6">
            <Row className="justify-content-left mt-4">
              <h2>Login</h2>
            </Row>
            <Form onSubmit={handleSubmit(this.onSubmit)}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Field
                  name="email"
                  component={TextField}
                  type="text"
                  placeholder="Email Address"
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Field
                  name="password"
                  component={TextField}
                  type="password"
                  placeholder="Password"
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default reduxForm({
  form: "login" // a unique identifier for this form
})(Login);

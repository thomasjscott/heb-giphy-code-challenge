import React from "react";
import { Navbar, Nav, Form, Button } from "react-bootstrap";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import TextField from "../form/TextField";
import FormConstants from "../../constants/formConstants";

class Header extends React.Component {
  render() {
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">HEB Giphy</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">My Giphys</Nav.Link>
            <Nav.Link href="#link">Profile</Nav.Link>
          </Nav>
          <Form inline>
            <Field
              name="giphy-search"
              component={TextField}
              type="text"
              placeholder="Search Giphys..."
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default reduxForm({
  form: "giphy-search" // a unique identifier for this form
})(Header);

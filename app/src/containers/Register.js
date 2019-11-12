// External Libraries
import React, { Component } from "react";
import { Field } from "redux-form";
import { MDBContainer, MDBBtn } from "mdbreact";

class Register extends Component {
  render() {
    return (
      <MDBContainer className="mt-4">
        <p className="h4 mb-4">Register</p>
        Register and have the ability to:
        <ul>
          <li>Search for Giphys</li>
          <li>Save Giphys you love for future viewing</li>
          <li>Tag Giphys to so you remember why you enjoyed them</li>
        </ul>
        <label className="grey-text">Email</label>
        <Field
          name="email"
          component="input"
          type="text"
          className="form-control"
          placeholder="E-Mail"
        />
        <label className="grey-text mt-3">Password</label>
        <Field
          name="password"
          component="input"
          type="password"
          className="form-control"
          placeholder="Password"
        />
        <div className="text-center mt-4">
          <MDBBtn color="primary" type="submit">
            Register
          </MDBBtn>
          <MDBBtn color="secondary" onClick={() => this.props.toggleAuthForm()}>
            Go To Login
          </MDBBtn>
        </div>
      </MDBContainer>
    );
  }
}

export default Register;

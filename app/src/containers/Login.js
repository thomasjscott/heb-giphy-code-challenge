// External
import React, { Component } from "react";
import { MDBContainer, MDBBtn } from "mdbreact";
import { Field } from "redux-form";

class Login extends Component {
  render() {
    return (
      <MDBContainer className="mt-4">
        <p className="h4 mb-4">Login</p>

        {/* Email */}
        <label className="grey-text">Your email</label>
        <Field
          name="email"
          component="input"
          type="text"
          className="form-control"
          placeholder="E-Mail"
        />

        {/* Password */}
        <label className="grey-text">Your password</label>
        <Field
          name="password"
          component="input"
          type="password"
          className="form-control"
          placeholder="Password"
        />

        <div className="text-center mt-4">
          {/* Submit Button */}
          <MDBBtn color="indigo" type="submit">
            Login
          </MDBBtn>

          {/* Register Button */}
          <MDBBtn color="secondary" onClick={() => this.props.toggleAuthForm()}>
            Go To Register
          </MDBBtn>
        </div>
      </MDBContainer>
    );
  }
}

export default Login;

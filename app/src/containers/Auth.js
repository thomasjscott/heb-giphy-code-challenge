// External
import React, { Component } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBAlert } from "mdbreact";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

// Constants, Actions
import { Form, reduxForm, getFormValues } from "redux-form";
import { AUTH_FORM, MY_GIPHYS_ROUTE } from "../constants/ApplicationConstants";
import {
  logUserIn,
  getUserDetails,
  registerUser
} from "../services/AuthenticationServices";
import { addUserDetailsToReduxStore } from "../redux/actions/UserActions";
import Login from "./Login";
import Register from "./Register";

class Auth extends Component {
  constructor(props) {
    super(props);

    // Set local state so there are no errors and we are not submitting
    this.state = {
      isSubmitting: false,
      error: undefined,
      displayLogin: true
    };

    this.toggleAuthForm = this.toggleAuthForm.bind(this);
  }

  /**
   * Toggles the auth form from Login to Register
   */
  toggleAuthForm = () => {
    this.props.clearFields(false, false, "email");
    this.props.clearFields(false, false, "password");
    this.setState({ displayLogin: !this.state.displayLogin });
  };

  /**
   * Checks the auth response and gets user details, sets local storage, and redirects accordingly
   */
  getUserDetailsAndUpdateRedux = async authResponse => {
    if (authResponse.status === 200 || authResponse.status === 201) {
      localStorage.setItem(
        "hebGiphyAuthenticationToken",
        authResponse.data.token
      );

      // Retrieves user details from service
      const userDetails = await getUserDetails();

      // Retrieve users details and store in redux state
      this.props.addUserDetailsToReduxStore(userDetails.data.data);

      // User is now logged in, move to their giphy page
      this.props.history.push({
        pathname: MY_GIPHYS_ROUTE
      });
    }
    // Error occured when logging in.  Display error.
    else {
      this.setState({
        error: "An error occured.  Please try to login again.",
        isSubmitting: false
      });
    }
  };

  /**
   * Handles the submission of the form.
   */
  submitHandler = async () => {
    // If form is submitting, no reason to re-submit
    if (this.state.isSubmitting) return;

    // If no form values, provide user error and return
    if (!this.props.formValues) {
      this.setState({
        error: "You must provide a value for all fields"
      });
      return;
    }

    const { email, password } = this.props.formValues;

    // Checks that email and password are filled out
    if (!email || !password) {
      this.setState({
        error: "You must provide a value for all fields"
      });
      return;
    }

    // Set state so form is currently submitting. Prevents duplicate submissions in future
    this.setState({ isSubmitting: true });

    let authResponse;

    if (this.state.displayLogin) {
      // Calls login service
      authResponse = await logUserIn(email, password);
    } else {
      authResponse = await registerUser(email, password);
    }

    // Set local auth token, populate redux state,  and re-direct to favorite giphys
    this.getUserDetailsAndUpdateRedux(authResponse);
  };

  render() {
    const { handleSubmit } = this.props;

    // If error exists, display an alert
    const alert = this.state.error ? (
      <MDBContainer>
        <MDBAlert color="warning">{this.state.error}</MDBAlert>
      </MDBContainer>
    ) : null;

    // If user is logged in, re-direct to their giphy page
    if (this.props.isLoggedIn) {
      return <Redirect to={MY_GIPHYS_ROUTE} />;
    }

    return (
      <MDBContainer className="mt-4">
        <MDBRow>
          <MDBCol md="12">
            <Form onSubmit={handleSubmit(this.submitHandler)}>
              <MDBRow>{alert}</MDBRow>

              {this.state.displayLogin ? (
                <Login toggleAuthForm={() => this.toggleAuthForm()} />
              ) : (
                <Register toggleAuthForm={() => this.toggleAuthForm()} />
              )}
            </Form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addUserDetailsToReduxStore: userDetails => {
      return dispatch(addUserDetailsToReduxStore(userDetails));
    }
  };
};

const mapStateToProps = state => {
  return {
    formValues: getFormValues(AUTH_FORM)(state)
  };
};

export default reduxForm({
  form: AUTH_FORM
})(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Auth)
);

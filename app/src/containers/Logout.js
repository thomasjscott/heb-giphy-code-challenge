import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../redux/actions/UserActions";

import {
  AUTH_ROUTE,
  AUTH_TOKEN_LOCATION
} from "../constants/ApplicationConstants";

class Logout extends Component {
  render() {
    localStorage.removeItem(AUTH_TOKEN_LOCATION);
    this.props.logoutUser();
    return <Redirect to={AUTH_ROUTE} />;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logoutUser: () => {
      return dispatch(logoutUser());
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Logout);

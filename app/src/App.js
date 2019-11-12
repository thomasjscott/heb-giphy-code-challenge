// External Libraries
import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { Switch, Route, Redirect } from "react-router-dom";

// Application - Actions, Components, Constants
import { addUserDetailsToReduxStore } from "./redux/actions/UserActions";
import Auth from "./containers/Auth";
import Header from "./components/Header";
import Spinner from "./components/Spinner";
import MyGiphys from "./containers/MyGiphys";
import SearchGiphys from "./containers/SearchGiphys";
import Logout from "./containers/Logout";
import {
  AUTH_TOKEN_LOCATION,
  AUTH_ROUTE,
  MY_GIPHYS_ROUTE,
  SEARCH_GIPHYS_ROUTE,
  LOGOUT_ROUTE
} from "./constants/ApplicationConstants";
import { getUserDetails } from "./services/AuthenticationServices";

// CSS
import "./App.css";

class App extends React.Component {
  async componentDidMount() {
    // Retrieve user data if there is local storage and user not already set
    if (!this.props.isLoggedIn && localStorage.getItem(AUTH_TOKEN_LOCATION)) {
      const userDetails = await getUserDetails();
      this.props.addUserDetailsToReduxStore(userDetails.data.data);
    }
  }

  render() {
    const { isLoggedIn, isInitialized } = this.props;

    // Load spinner until application initialized
    if (!isInitialized) {
      return <Spinner />;
    }

    const authRedirect = <Redirect to={AUTH_ROUTE} />;

    return (
      <Fragment>
        <Helmet title="HEB Giphy Challenge" />
        <Header {...this.props} />

        <Switch>
          <Route path={AUTH_ROUTE} exact component={Auth} />
          <Route path={LOGOUT_ROUTE} component={Logout} />
          <Route
            path={MY_GIPHYS_ROUTE}
            render={() =>
              isLoggedIn && isInitialized ? (
                <MyGiphys {...this.props} />
              ) : (
                authRedirect
              )
            }
          />
          <Route
            path={SEARCH_GIPHYS_ROUTE}
            render={() =>
              isLoggedIn && isInitialized ? (
                <SearchGiphys {...this.props} />
              ) : (
                authRedirect
              )
            }
          />

          <Redirect to={this.props.isLoggedIn ? MY_GIPHYS_ROUTE : AUTH_ROUTE} />
        </Switch>
      </Fragment>
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
    currentUser: {
      id: state.currentUser.id,
      email: state.currentUser.email
    },
    isLoggedIn: state.currentUser.id !== undefined,
    isInitialized:
      (localStorage.getItem(AUTH_TOKEN_LOCATION) && state.currentUser.id) ||
      !localStorage.getItem(AUTH_TOKEN_LOCATION)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

import React, { Fragment } from "react";
import "./App.css";
import Header from "./components/layout/Header";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Login from "./containers/Login";
class App extends React.Component {
  // loggedIn() {}

  // requireAuth() {
  //   if (!loggedIn()) {
  //     replace({
  //       pathname: "/login"
  //     });
  //   }
  // }

  render() {
    return (
      <Fragment>
        <Helmet title="HEB Giphy Challenge" />
        <Header />
        <Login />
      </Fragment>
    );
  }
}

export default App;

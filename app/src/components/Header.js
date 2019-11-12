// External Libraries
import React from "react";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink,
  MDBNavbarToggler,
  MDBCollapse
} from "mdbreact";

// Constants
import {
  SEARCH_GIPHYS_ROUTE,
  MY_GIPHYS_ROUTE,
  LOGOUT_ROUTE
} from "../constants/ApplicationConstants";

class Header extends React.Component {
  constructor(props) {
    super(props);

    // Controls navigation bar and whether it is toggled or not
    this.state = {
      isOpen: false
    };
  }

  /**
   * Toggles the collapse of the menu bar
   */
  toggleCollapse = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    let linksForLoggedIn = null;

    if (this.props.isLoggedIn) {
      linksForLoggedIn = (
        <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
          <MDBNavbarNav left>
            {/* My Giphys */}
            <MDBNavItem active={window.location.pathname === MY_GIPHYS_ROUTE}>
              <MDBNavLink to={MY_GIPHYS_ROUTE}>My Giphys</MDBNavLink>
            </MDBNavItem>

            {/* Search Giphys */}
            <MDBNavItem
              active={window.location.pathname === SEARCH_GIPHYS_ROUTE}
            >
              <MDBNavLink to={SEARCH_GIPHYS_ROUTE}>Search Giphys</MDBNavLink>
            </MDBNavItem>
          </MDBNavbarNav>
          <MDBNavbarNav right>
            <MDBNavItem>
              <MDBNavLink to={LOGOUT_ROUTE}>Logout</MDBNavLink>
            </MDBNavItem>
          </MDBNavbarNav>
        </MDBCollapse>
      );
    }

    return (
      <MDBNavbar color="indigo" dark expand="md">
        <MDBNavbarBrand>
          <strong className="white-text">HEB Giphy</strong>
        </MDBNavbarBrand>
        {linksForLoggedIn}
        <MDBNavbarToggler onClick={this.toggleCollapse} />
      </MDBNavbar>
    );
  }
}

export default Header;

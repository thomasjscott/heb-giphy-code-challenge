// External Libraries
import React, { Component } from "react";
import { connect } from "react-redux";
import Card from "./Card";
import { MDBCol, MDBContainer, MDBRow } from "mdbreact";
import { SEARCH_GIPHYS_ROUTE } from "../constants/ApplicationConstants";
import { Link } from "react-router-dom";

class MyGiphys extends Component {
  render() {
    let cardContent = null;

    // Creates cards to display
    if (this.props.favoritedGiphys && this.props.favoritedGiphys.length > 0) {
      cardContent = this.props.favoritedGiphys.map(giphy => {
        return (
          <MDBCol size="6">
            <Card
              key={giphy.giphyId}
              embedUrl={giphy.embedUrl}
              giphyId={giphy.giphyId}
            />
          </MDBCol>
        );
      });
    } else {
      console.log("NO CONTENT");
      cardContent = (
        <MDBCol md="12" className="ml-3">
          <p>
            You have not favorited any Giphys. You should try
            {<Link to={SEARCH_GIPHYS_ROUTE}> searching </Link>}
            for some and come back later.
          </p>
        </MDBCol>
      );
    }

    return (
      <React.Fragment>
        <MDBContainer className="mt-3">
          <MDBCol md="12">
            <p className="h4 mb-4">My Favorite Giphys</p>
          </MDBCol>
        </MDBContainer>
        <MDBContainer>
          <MDBRow>{cardContent}</MDBRow>
        </MDBContainer>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    favoritedGiphys: state.currentUser.favoritedGiphys
  };
};

export default connect(mapStateToProps)(MyGiphys);

// External Libraries
import React, { Component } from "react";
import { connect } from "react-redux";
import Card from "./Card";
import { MDBCol, MDBContainer, MDBRow } from "mdbreact";

class MyGiphys extends Component {
  render() {
    let cards = null;

    // Creates cards to display
    if (this.props.favoritedGiphys) {
      cards = this.props.favoritedGiphys.map(giphy => {
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
    }

    return (
      <React.Fragment>
        <MDBContainer className="mt-3">
          <MDBCol md="12">
            <p className="h4 mb-4">My Favorite Giphys</p>
          </MDBCol>
        </MDBContainer>
        <MDBContainer>
          <MDBRow>{cards}</MDBRow>
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

import React, { Component } from "react";
import { MDBCard, MDBCardBody, MDBBtn, MDBIframe, MDBIcon } from "mdbreact";
import { favoriteGiphy, unfavoriteGiphy } from "../services/GiphyServices";
import { connect } from "react-redux";
import {
  addGiphyToReduxStore,
  removeGiphyFromReduxStore
} from "../redux/actions/UserActions";

import Tags from "../components/Tags";

class Card extends Component {
  constructor(props) {
    super(props);

    const { favoritedGiphys, giphyId } = props;

    // Checks if giphy is a current favorite and whether or not to toggle tag form
    const isFavoriteGiphy = favoritedGiphys.some(favoritedGiphy => {
      return favoritedGiphy.giphyId === giphyId;
    });

    this.state = {
      isFavoriteGiphy,
      toggleTagForm: false
    };
  }

  /**
   * Toggles the Giphy Tag Form
   */
  toggleTagFormHandler = () => {
    this.setState({ toggleTagForm: !this.state.toggleTagForm });
  };

  /**
   * Adds giphy to users favorites
   */
  updateFavorites = async () => {
    // If it is not a favorite, call the service and add it
    if (!this.state.isFavoriteGiphy) {
      const favoriteResponse = await favoriteGiphy(
        this.props.giphyId,
        this.props.embedUrl
      );
      this.props.addGiphyToReduxStore(favoriteResponse.data.data);
      this.setState({ isFavoriteGiphy: true });
    }
    // Else it is a favorite, unfavorite it
    else {
      const unfavoriteResponse = await unfavoriteGiphy(this.props.giphyId);
      this.props.removeGiphyFromReduxStore(unfavoriteResponse.data.data);
      this.setState({ isFavoriteGiphy: false });
    }
  };

  render() {
    let tagButton, tags;
    let icon = <MDBIcon far icon="heart" className="red-text" size="lg" />;

    if (this.state.isFavoriteGiphy) {
      icon = <MDBIcon icon="heart" className="red-text" size="lg" />;

      // Build the tag form and buttons
      tags = (
        <React.Fragment>
          <p className="h6">Tags</p>
          <Tags
            toggleTagForm={this.state.toggleTagForm}
            toggleTagFormHandler={() => this.toggleTagFormHandler()}
            giphyId={this.props.giphyId}
          />
        </React.Fragment>
      );
    }

    // It is a favorite and the form is currently not displaying, show Add Tag
    if (this.state.isFavoriteGiphy && !this.state.toggleTagForm) {
      tagButton = (
        <MDBBtn
          rounded
          outline
          className="text-center"
          color="primary"
          onClick={() => this.toggleTagFormHandler()}
        >
          Add Tag
        </MDBBtn>
      );
    }

    return (
      <MDBCard style={{ marginTop: "1rem" }}>
        <MDBCardBody className="text-center">
          <MDBIframe src={this.props.embedUrl}></MDBIframe>
          <MDBBtn
            rounded
            outline
            className="text-center"
            color={this.state.isFavoriteGiphy ? "danger" : "primary"}
            onClick={() => this.updateFavorites()}
          >
            {icon}
          </MDBBtn>
          {tagButton}
          {tags}
        </MDBCardBody>
      </MDBCard>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addGiphyToReduxStore: data => {
      return dispatch(addGiphyToReduxStore(data));
    },
    removeGiphyFromReduxStore: data => {
      return dispatch(removeGiphyFromReduxStore(data));
    }
  };
};

const mapStateToProps = state => {
  return {
    favoritedGiphys: state.currentUser.favoritedGiphys,
    giphyTags: state.currentUser.giphyTags
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Card);

import React, { Component } from "react";
import { connect } from "react-redux";

import { Field, reduxForm, getFormValues } from "redux-form";
import { MDBBtn, MDBFormInline, MDBCol, MDBIcon } from "mdbreact";
import { TAG_FORM } from "../constants/ApplicationConstants";
import { tagGiphy, deleteGiphyTagService } from "../services/GiphyServices";
import {
  addGiphyTagToReduxStore,
  removeGiphyTagFromReduxStore
} from "../redux/actions/UserActions";

class Tags extends Component {
  /**
   * Handles the submission of the form.
   */
  submitHandler = async () => {
    if (!this.props.formValues) return;
    const fieldName = `tagGiphy_${this.props.giphyId}`;
    const tag = this.props.formValues[fieldName];

    if (!tag) return;
    const createdTag = await tagGiphy(this.props.giphyId, tag);
    this.props.addGiphyTagToReduxStore(createdTag.data.data);

    this.props.clearFields(false, false, fieldName);
    return;
  };

  /**
   * Filters giphy tags and maps only ones of interest
   */
  getGiphyTags = (giphyTags, giphyId) => {
    return giphyTags
      .filter(giphyTag => {
        return giphyTag.giphyId === giphyId;
      })
      .map(giphyTag => {
        return giphyTag.tag;
      });
  };

  /**
   * Removes giphy tag from redux store and updates server
   */
  removeGiphyTag = async (giphyId, tag) => {
    await deleteGiphyTagService(giphyId, tag);
    this.props.removeGiphyTagFromReduxStore(giphyId, tag);
  };

  render() {
    const { handleSubmit } = this.props;

    const { giphyTags, giphyId } = this.props;
    let tagForm = null;
    const tags = this.getGiphyTags(giphyTags, giphyId);

    const tagButtons = tags.map(tag => {
      return (
        <MDBBtn
          color="light-blue"
          key={`${giphyId}_${tag}`}
          className="ml-3 mb-3"
          size="sm"
          onClick={() => this.removeGiphyTag(giphyId, tag)}
        >
          {tag}{" "}
          <MDBIcon
            far
            icon="times-circle"
            className="red-text ml-1"
            size="lg"
          />
        </MDBBtn>
      );
    });

    if (this.props.toggleTagForm) {
      tagForm = (
        <MDBFormInline
          onSubmit={handleSubmit(this.submitHandler)}
          className="md-form mr-auto mb-4"
        >
          <MDBCol md="12">
            <Field
              name={`tagGiphy_${this.props.giphyId}`}
              component="input"
              type="text"
              className="form-control mr-sm-2"
              placeholder="Tag Giphy"
            />
          </MDBCol>
          <MDBCol>
            <MDBBtn
              outline
              color="primary"
              rounded
              size="md"
              type="submit"
              className="mr-auto"
            >
              Add Tag
            </MDBBtn>
            <MDBBtn
              outline
              color="warning"
              rounded
              size="md"
              className="mr-auto"
              onClick={() => this.props.toggleTagFormHandler()}
            >
              Done
            </MDBBtn>
          </MDBCol>
        </MDBFormInline>
      );
    }

    return (
      <React.Fragment>
        {tagForm}
        {tagButtons}
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addGiphyTagToReduxStore: giphyTag => {
      return dispatch(addGiphyTagToReduxStore(giphyTag));
    },
    removeGiphyTagFromReduxStore: (giphyId, tag) => {
      return dispatch(removeGiphyTagFromReduxStore(giphyId, tag));
    }
  };
};

const mapStateToProps = state => {
  return {
    formValues: getFormValues(TAG_FORM)(state),
    giphyTags: state.currentUser.giphyTags
  };
};

export default reduxForm({
  form: TAG_FORM
})(connect(mapStateToProps, mapDispatchToProps)(Tags));

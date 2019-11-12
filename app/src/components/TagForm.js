// External Libraries
import React, { Component } from "react";
import { Field, reduxForm, getFormValues } from "redux-form";
import { MDBBtn, MDBFormInline, MDBCol } from "mdbreact";
import { connect } from "react-redux";

// Application - Constants, Services, Actions
import { TAG_FORM } from "../constants/ApplicationConstants";
import { tagGiphy } from "../services/GiphyServices";
import { addGiphyTagToReduxStore } from "../redux/actions/UserActions";

class TagForm extends Component {
  /**
   * Handles the submission of the form.
   */
  submitHandler = async () => {
    if (!this.props.formValues) return;

    // Retrieve the unique values in the form for the giphy
    const tag = this.props.formValues[`tagGiphy_${this.props.giphyId}`];

    // If no value, return
    if (!tag) return;

    const createdTag = await tagGiphy(this.props.giphyId, tag);

    this.props.addGiphyTagToReduxStore(createdTag.data.data);
  };

  render() {
    const { handleSubmit } = this.props;

    return (
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
            onClick={() => this.props.toggleTagForm()}
          >
            Cancel
          </MDBBtn>
        </MDBCol>
      </MDBFormInline>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addGiphyTagToReduxStore: giphyTag => {
      return dispatch(addGiphyTagToReduxStore(giphyTag));
    }
  };
};

const mapStateToProps = state => {
  return {
    formValues: getFormValues(TAG_FORM)(state)
  };
};

export default reduxForm({
  form: TAG_FORM
})(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TagForm)
);

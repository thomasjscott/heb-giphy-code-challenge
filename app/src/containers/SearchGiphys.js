import React, { Component } from "react";
import { MDBCol, MDBContainer, MDBRow } from "mdbreact";
import { Field, reduxForm, Form, getFormValues } from "redux-form";
import { GIPHY_SEARCH_FORM } from "../constants/ApplicationConstants";
import Spinner from "../components/Spinner";
import Card from "./Card";
import { searchGiphys } from "../services/GiphyServices";
import { connect } from "react-redux";
class SearchGiphys extends Component {
  constructor(props) {
    super(props);

    // Set local state so form is not submitting and there are no errors
    this.state = {
      isSearching: false,
      error: undefined,
      giphys: []
    };

    this.submitHandler = this.submitHandler.bind(this);
  }

  /**
   * Handles the submission of the form.
   */
  submitHandler = async () => {
    if (!this.props.formValues || !this.props.formValues.giphySearch) return;
    this.setState({ isSearching: true });

    const giphys = await searchGiphys(this.props.formValues.giphySearch);

    this.setState({ isSearching: false, giphys: [...giphys.data.data] });
  };

  render() {
    const { handleSubmit } = this.props;

    if (this.state.isSearching) {
      return (
        <MDBContainer className="mt-3">
          <MDBCol md="12" className="text-center">
            <Spinner />
          </MDBCol>
        </MDBContainer>
      );
    }

    // Giphy Cards
    const cards = this.state.giphys.map(giphy => {
      return (
        <MDBCol size="6">
          <Card key={giphy.id} embedUrl={giphy.embed_url} giphyId={giphy.id} />
        </MDBCol>
      );
    });

    return (
      <React.Fragment>
        <MDBContainer className="mt-3">
          <MDBCol md="12">
            <p className="h4 mb-4">Search Giphys</p>
            <Form onSubmit={handleSubmit(this.submitHandler)}>
              <Field
                name="giphySearch"
                component="input"
                type="text"
                className="form-control"
                placeholder="Search for Giphys..."
              />
            </Form>
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
    formValues: getFormValues(GIPHY_SEARCH_FORM)(state)
  };
};

export default reduxForm({
  form: GIPHY_SEARCH_FORM
})(connect(mapStateToProps)(SearchGiphys));

import axios from "axios";
import { AUTH_TOKEN_LOCATION } from "../constants/ApplicationConstants";

/**
 * Calls server and retrieves giphys for given search term
 * @param {string} query - search query
 */
export const searchGiphys = async query => {
  const authToken = localStorage.getItem(AUTH_TOKEN_LOCATION);

  if (!authToken) return;

  const giphySearchResponse = await axios
    .get(`/api/v1/giphy?q=${query}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
    .catch(err => {
      return err.response;
    });

  return giphySearchResponse;
};

/**
 * Saves the giphy as a favorite for the user
 * @param {string} giphyId - giphy ID being saved
 * @param {string} embedUrl - embedURL being saved
 */
export const favoriteGiphy = async (giphyId, embedUrl) => {
  const authToken = localStorage.getItem(AUTH_TOKEN_LOCATION);

  if (!authToken) return;

  const data = {
    giphyId,
    embedUrl
  };

  const giphyFavoriteResponse = await axios
    .post(`/api/v1/users/giphy`, data, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
    .catch(err => {
      return err.response;
    });

  return giphyFavoriteResponse;
};

/**
 * Removes the giphy as a favorite for the user
 * @param {string} giphyId - giphyID being removed
 */
export const unfavoriteGiphy = async giphyId => {
  const authToken = localStorage.getItem(AUTH_TOKEN_LOCATION);

  if (!authToken) return;

  const data = {
    giphyId
  };

  const giphyUnfavoriteResponse = await axios
    .delete(`/api/v1/users/giphy`, {
      data: data,
      headers: { Authorization: `Bearer ${authToken}` }
    })
    .catch(err => {
      return err.response;
    });

  return giphyUnfavoriteResponse;
};

export const tagGiphy = async (giphyId, tag) => {
  const authToken = localStorage.getItem(AUTH_TOKEN_LOCATION);

  if (!authToken) return;

  const data = {
    giphyId,
    tag
  };

  const giphyTagResponse = await axios
    .post(`/api/v1/users/giphy/tags`, data, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
    .catch(err => {
      return err.response;
    });

  return giphyTagResponse;
};

export const deleteGiphyTagService = async (giphyId, tag) => {
  const authToken = localStorage.getItem(AUTH_TOKEN_LOCATION);

  if (!authToken) return;

  const data = {
    giphyId,
    tag
  };

  const giphyTagResponse = await axios
    .delete(`/api/v1/users/giphy/tags`, {
      data: data,
      headers: { Authorization: `Bearer ${authToken}` }
    })
    .catch(err => {
      return err.response;
    });

  return giphyTagResponse;
};

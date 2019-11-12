import {
  POPULATE_USER_DETAILS,
  LOGOUT_USER,
  ADD_GIPHY_TO_FAVORITES,
  REMOVE_GIPHY_FROM_FAVORITES,
  ADD_GIPHY_TAG,
  DELETE_GIPHY_TAG
} from "../actions/ActionTypes";

/**
 * Calls service to get logged in members details
 *
 */
export const addUserDetailsToReduxStore = userDetails => {
  return dispatch => {
    dispatch({ type: POPULATE_USER_DETAILS, data: userDetails });
  };
};

/**
 * Removes user details from redux on logout
 */
export const logoutUser = () => {
  return dispatch => {
    dispatch({ type: LOGOUT_USER });
  };
};

/**
 * Adds the giphy to the users favorites
 * @param {object} giphy - giphy to add
 */
export const addGiphyToReduxStore = giphy => {
  return dispatch => {
    dispatch({ type: ADD_GIPHY_TO_FAVORITES, data: giphy });
  };
};

/**
 * Removes giphy from users favorites
 * @param {object} giphy - Giphy to remove
 */
export const removeGiphyFromReduxStore = giphy => {
  return dispatch => {
    dispatch({ type: REMOVE_GIPHY_FROM_FAVORITES, data: giphy });
  };
};

/**
 * Adds the giphy tag to the users tags
 * @param {object} giphyTag - giphy tag to add
 */
export const addGiphyTagToReduxStore = giphyTag => {
  return dispatch => {
    dispatch({ type: ADD_GIPHY_TAG, data: giphyTag });
  };
};

export const removeGiphyTagFromReduxStore = (giphyId, tag) => {
  return dispatch => {
    dispatch({ type: DELETE_GIPHY_TAG, giphyId: giphyId, tag: tag });
  };
};

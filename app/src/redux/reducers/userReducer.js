import {
  POPULATE_USER_DETAILS,
  LOGOUT_USER,
  ADD_GIPHY_TO_FAVORITES,
  REMOVE_GIPHY_FROM_FAVORITES,
  ADD_GIPHY_TAG,
  DELETE_GIPHY_TAG
} from "../actions/ActionTypes";

const userReducer = (state = {}, action) => {
  switch (action.type) {
    case POPULATE_USER_DETAILS: {
      return { ...action.data };
    }
    case ADD_GIPHY_TAG: {
      const stateCopy = state;
      stateCopy.giphyTags.push(action.data);
      return {
        ...stateCopy
      };
    }
    case DELETE_GIPHY_TAG: {
      const stateCopy = { ...state };
      stateCopy.giphyTags = stateCopy.giphyTags.filter(giphy => {
        return giphy.giphyId === action.giphyId && giphy.tag !== action.tag;
      });

      console.log(stateCopy.giphyTags.length);
      return {
        ...stateCopy
      };
    }
    case ADD_GIPHY_TO_FAVORITES: {
      const stateCopy = { ...state };
      stateCopy.favoritedGiphys.push(action.data);
      return {
        ...stateCopy
      };
    }
    case REMOVE_GIPHY_FROM_FAVORITES: {
      const stateCopy = { ...state };
      stateCopy.favoritedGiphys = stateCopy.favoritedGiphys.filter(giphy => {
        return giphy.giphyId !== action.data.giphyId;
      });
      return {
        ...stateCopy
      };
    }
    case LOGOUT_USER: {
      return {};
    }
    default:
      return state;
  }
};

export default userReducer;

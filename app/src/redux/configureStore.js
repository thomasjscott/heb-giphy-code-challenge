import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { reducer as formReducer } from "redux-form";
export default function configureStore(initialState = {}) {
  let reducer = combineReducers({
    form: formReducer
  });

  let enhancements = [applyMiddleware(thunk)];

  if (window.chrome) enhancements.push(window.__REDUX_DEVTOOLS_EXTENSION__());

  return createStore(reducer, initialState, compose(...enhancements));
}

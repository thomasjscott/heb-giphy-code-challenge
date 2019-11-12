// External
import axios from "axios";

// Constants
import { AUTH_TOKEN_LOCATION } from "../constants/ApplicationConstants";

/**
 * Serivce call to obtain logged in users details
 */
export const getUserDetails = async () => {
  const authToken = localStorage.getItem(AUTH_TOKEN_LOCATION);

  if (!authToken) return;

  const userDataResponse = await axios
    .get("/api/v1/users/my-info", {
      headers: { Authorization: `Bearer ${authToken}` }
    })
    .catch(err => {
      localStorage.removeItem(AUTH_TOKEN_LOCATION);
      return err.response;
    });

  return userDataResponse;
};

/**
 * Service call to log a user in
 * @param {string} email    - users email address logging in with
 * @param {string} password - users password logging in with
 */
export const logUserIn = async (email, password) => {
  const loginResponse = await axios
    .post("/api/v1/users/login", {
      email,
      password
    })
    .catch(err => {
      return err.response;
    });

  return loginResponse;
};

export const registerUser = async (email, password) => {
  const registerResponse = await axios
    .post("/api/v1/users/sign-up", {
      email,
      password
    })
    .catch(err => {
      return err.response;
    });

  return registerResponse;
};

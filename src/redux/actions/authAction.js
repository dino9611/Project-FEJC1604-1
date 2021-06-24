import { API_URL } from "../../helper";
import axios from "axios";

export const LoginAction = (input) => {
  return {
    type: "LOGIN",
    payload: input,
  };
};

export const LogoutAction = () => {
  return {
    type: "LOGOUT",
  };
};

export const LoadingAction = () => {
  return {
    type: "LOADING",
  };
};

export const ResetActionthunk = () => {
  return (dispatch) => {
    dispatch({ type: "RESET" });
  };
};

export const LoginActionThunk = (input) => {
  let { emailorusername, password } = input;
  return (dispatch) => {
    dispatch({ type: "LOADING" });
    axios
      .post(`${API_URL}/auth/login`, {
        emailorusername: emailorusername,
        password: password,
      })
      .then((res) => {
        // console.log(res.data);
        // console.log(res.headers);
        localStorage.setItem("data", JSON.stringify(res.data));
        localStorage.setItem("TA", res.headers["x-token-access"]);
        localStorage.setItem("TR", res.headers["x-token-refresh"]);
        // console.log(res.data)
        dispatch({ type: "LOGIN", payload: res.data });
      })
      .catch((err) => {
        dispatch({ type: "ERROR", error: err.response.data.message });
      });
  };
};

export const RegActionThunk = (input) => {
  return (dispatch) => {
    let { username, password, confirmpass, email, gender } = input;
    if (!email && !username && !password && !confirmpass && !gender) {
      dispatch({
        type: "ERROR",
        error: "Data must be filled",
      });
    } else {
      let data = {
        username,
        password,
        confirmpass,
        email,
        gender,
      };
      dispatch({ type: "LOADING" });
      axios
        .post(`${API_URL}/auth/registration`, data)
        .then((res) => {
          // console.log(res1.data);
          // console.log(res1.headers);
          localStorage.setItem("data", JSON.stringify(res.data));
          localStorage.setItem("TA", res.headers["x-token-access"]);
          localStorage.setItem("TR", res.headers["x-token-refresh"]);
          dispatch({ type: "EMAIL", mess: 'A verification link has been sent to your email account'});
          // dispatch({ type: "LOGIN", payload: res.data });
        })
        .catch((err) => {
          dispatch({ type: "ERROR", error: err.response.data.message });
        });
    }
  };
};

export const LoginAdminActionThunk = (input) => {
  let { emailorusername, password } = input;
  return (dispatch) => {
    dispatch({ type: "LOADING" });
    let data = {
      emailorusername: emailorusername,
      password: password,
    };
    axios
      .post(`${API_URL}/admin/login`, data)
      .then((res) => {
        localStorage.setItem("TA", res.headers["x-token-access"]);
        localStorage.setItem("TR", res.headers["x-token-refresh"]);
        dispatch({ type: "LOGIN", payload: res.data });
      })
      .catch((err) => {
        dispatch({ type: "ERROR", error: err.response.data.message });
      });
  };
};
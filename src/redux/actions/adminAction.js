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

export const LoginAdminActionThunk = (input) => {
    let { emailorusername, password } = input;
    return (dispatch) => {
        dispatch({ type: "LOADING" });
        axios
            .post(`${API_URL}/admin/login`, {
                emailorusername: emailorusername,
                password: password,
            })
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
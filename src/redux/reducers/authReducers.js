const INITIAL_STATE = {
  id: 0,
  emailorusername: "",
  password: "",
  role: "",
  error: "",
  islogin: false,
  loading: false,
};

const AuthReducers = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        ...action.payload,
        islogin: true,
        loading: false,
        error: "",
      };
    case "ERROR":
      return { ...state, error: action.error, loading: false };
    case "LOGOUT":
      return INITIAL_STATE;
    case "LOADING":
      return { ...state, loading: true };
    case "RESET":
      return { ...state, error: "", loading: false };
    default:
      return state;
  }
};

export default AuthReducers;

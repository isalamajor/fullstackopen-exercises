import { useReducer, createContext } from "react";

const initialState = { username: "", token: "" };

const reducerUser = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "CLEAR":
      return {};
    default:
      return state;
  }
};

export const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [userdata, userDispatch] = useReducer(reducerUser, initialState);
  return (
    <UserContext.Provider value={{ userdata, userDispatch }}>
      {props.children}
    </UserContext.Provider>
  );
};

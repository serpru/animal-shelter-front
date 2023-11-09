import React, { createContext, useEffect, useReducer } from "react";
import { EndPoint } from "../../models/EndPoint";

type AuthInitialState = {
  user: null;
};

const initialState = {
  user: null,
};

export const AuthContext = createContext<{
  state: AuthInitialState;
  dispatch: React.Dispatch<any>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const authReducer = (state: any, action: any) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const response = fetch(EndPoint.root + EndPoint.check_if_logged_in, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text.slice(1, text.length - 1));
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          dispatch({ type: "LOGIN", payload: "logged in" });
        } else {
          dispatch({ type: "LOGOUT" });
        }
      })
      .catch((err) => {
        dispatch({ type: "LOGOUT" });
      });
  }, []);

  console.log("AuthContext state: ", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

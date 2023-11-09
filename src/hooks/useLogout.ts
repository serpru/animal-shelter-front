import { EndPoint } from "../models/EndPoint";
import { useAuthContext } from "./useAuthContext"

export const useLogout = () => {
    const { dispatch } = useAuthContext();
    const logout = async () => {
        // request server to remove cookie
        const response = await fetch(EndPoint.root + EndPoint.logout, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          })
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((text) => {
                    throw new Error(text.slice(1, text.length - 1));
                    });
                }
                console.log(response);
                // update auth context to no longer be logged in
                dispatch({type: 'LOGOUT'});
                return response.json();
            })
            .catch((err) => {
              console.log(err.message);
            });
    }
    return { logout }
}
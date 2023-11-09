import { useState } from "react"
import { EndPoint } from "../models/EndPoint"
import { useAuthContext } from "./useAuthContext"


export const useLogin = () => {
    const [error, setError] = useState<boolean | null>(null)
    const [isLoading, setIsLoading] = useState<boolean | null>(null)
    const { dispatch } = useAuthContext()

    const login = async (login: string, password: string) => {
        setIsLoading(true)
        setError(null)

        const response = await fetch(EndPoint.root + EndPoint.login, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
            body: JSON.stringify({ login, password })
        })
        .then((response) => {
            if (!response.ok) {
                setIsLoading(false);
                return response.text().then((text) => {
                  throw new Error(text.slice(1, text.length - 1));
                });
            }
            console.log("response:")
            console.log(response)
            console.log("cookies:")
            console.log(response.headers.get('refreshToken'))
            dispatch({type: 'LOGIN', payload: "logged in"})

            setIsLoading(false);
        })

        
    } 
    return { login, isLoading, error };
}
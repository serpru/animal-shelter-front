import { Box, Button, Input, TextField, TextareaAutosize } from "@mui/material";
import React, { ReactNode, useState } from "react";
import { EndPoint } from "../../models/EndPoint";
import { Credentials } from "../../models/Login/Credentials";
import { useLogin } from "../../hooks/useLogin";

export default function LoginForm() {
  const [credentials, setCredentials] = useState<Credentials>({
    login: "",
    password: "",
  });
  const [state, setState] = useState("typing");
  const { login, error, isLoading } = useLogin();

  function setLogin(value: string) {
    setCredentials({ ...credentials, login: value });
  }

  function setPassword(value: string) {
    setCredentials({ ...credentials, password: value });
  }

  async function submitCredentials() {
    setState("submitting");
    const data = JSON.stringify(credentials);
    console.log("Sending:");
    console.log(data);

    await login(credentials.login, credentials.password);

    // const response = await fetch(EndPoint.root + "/" + EndPoint.login, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: data,
    // })
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error(
    //         `This is an HTTP error: The status is ${response.status}`
    //       );
    //     }
    //     console.log("Wysłanie loginu do API");
    //     console.log(response);
    //     return response.text();
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //     setState("typing");
    //   });
  }
  return (
    <>
      <Box
        display="flex"
        justifyContent={"center"}
        marginTop={"50px"}
        marginBottom={"50px"}
        fontSize={"1.7rem"}
      >
        <div className="credentials-window">
          <Box
            border={"5px"}
            borderColor={"green"}
            borderRadius={5}
            padding={"5px"}
          >
            <Box my={"65px"}>
              <TextField
                disabled={state === "typing" ? false : true}
                required
                label="Login"
                placeholder="Login"
                value={credentials.login}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setLogin(event.target.value);
                }}
              />
            </Box>
            <Box my={"65px"}>
              <TextField
                disabled={state === "typing" ? false : true}
                required
                label="Password"
                placeholder="Password"
                type="password"
                value={credentials.password}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(event.target.value);
                }}
              />
            </Box>
            <Button
              disabled={
                credentials.login !== "" &&
                credentials.password !== "" &&
                isLoading
                  ? true
                  : false
                //&&
                // state === "typing"
                //   ? false
                //   : true
              }
              variant="contained"
              onClick={() => submitCredentials()}
            >
              Login
            </Button>
          </Box>
          {error && <div>{error}</div>}
        </div>
      </Box>
    </>
  );
}

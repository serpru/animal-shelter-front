import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

export default function LoginForm() {
  const [credentials, setCredentials] = useState({ login: "", password: "" });
  const [state, setState] = useState("typing");

  function setLogin(value: string) {
    setCredentials({ ...credentials, login: value });
  }

  function setPassword(value: string) {
    setCredentials({ ...credentials, password: value });
  }

  async function submitCredentials() {
    const data = JSON.stringify(credentials);

    const response = await fetch("https://localhost:7224/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        console.log(response);
        return response.json();
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  useEffect(() => {
    console.log(credentials);
  }, [credentials]);

  return (
    <Container maxWidth="xs">
      <Paper>
        <Box textAlign={"center"}>
          <Typography>Login</Typography>
          <TextField
            disabled={state === "typing" ? false : true}
            label="Username"
            variant="outlined"
            value={credentials.login}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setLogin(event.target.value);
            }}
          />
          <Typography>Password</Typography>
          <TextField
            disabled={state === "typing" ? false : true}
            label="Password"
            variant="outlined"
            type="password"
            value={credentials.password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(event.target.value);
            }}
          />
        </Box>
        <Box textAlign={"center"}>
          <Button
            disabled={
              credentials.login !== "" && credentials.password !== ""
                ? false
                : true
            }
            onClick={() => submitCredentials()}
            variant="contained"
          >
            Sign in
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

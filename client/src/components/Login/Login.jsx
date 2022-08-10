import React, { useState, useEffect, useContext } from "react";
// import { Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  FormGroup,
  FormControl,
  Alert,
  Stack,
} from "@material-ui/core";
import axios from "axios";
import { CartContext } from '../CartContext/CartContext';
import Cookies from "universal-cookie";
import HomePage2 from "../HomePage2/HomePage2";

const cookies = new Cookies();

export default function Login() {
  // initial state
	const cartContext = useContext(CartContext);
	const {setUser}= cartContext;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(false);
  
  const token = cookies.get("token");
  let navigate = useNavigate();

  const handleSubmit = (e) => {
    // prevent the form from refreshing the whole page
    e.preventDefault();

    // set configurations
    const configuration = {
      method: "post",
      url: "/login",
      data: {
        email,
        password,
      },
    };

    // make the API call
    axios(configuration)
      .then((result) => {
        setLogin(true);
        setUser(cookies.get("user"));
        // navigate(`/`, { replace: true });
        window.location.href = "/";
      })
      .catch((error) => {
        error = new Error();
      });

  };

  return (
    <>
    {token ? (
    <HomePage2/>
    ):( <>
      {/* <ThemeProvider theme={theme}> */}
        {/* <CssBaseline /> */}
        <h2>Login</h2>
        <Box>
        <form onSubmit={(e) => handleSubmit(e)}>
          {/* email */}
          <FormGroup>
            <FormControl sx={{ mb: 2 }}>
              <TextField
                id="outlined-name"
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
          </FormGroup>

          {/* password */}
          <FormGroup>
            <FormControl sx={{ mb: 2 }}>
              <TextField
                id="outlined-name"
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
          </FormGroup>

          {/* submit button */}
          <Button
            sx={{ mb: 2 }}
            variant="contained"
            type="submit"
            onClick={(e) => handleSubmit(e)}
          >
            Login
          </Button>
          {/* display success message */}
          <>
            <Stack sx={{ width: "100%",  mb: 2}} spacing={2}>
              {login ? (
                <Alert severity="success">You Are Logged in Successfully</Alert>
              ) : (
                <Alert severity="error">You Are Not Logged in</Alert>
              )}
            </Stack>
          </>
        </form>
        </Box>
      {/* </ThemeProvider> */}
    </>)
    }
     </>         
  );
}



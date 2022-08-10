// import React, { useEffect, useState } from "react";
import { Box, Button } from "@material-ui/core";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function AuthComponent() {

  // logout
  const logout = () => {
    // destroy the cookie
    cookies.remove("token", { path: "/" });
    cookies.remove("user", { path: "/" });
    // redirect user to the landing page
    window.location.href = "/";
  };

  return (
    <>
      <Box>
        <Button type="submit" color="error" variant="contained" onClick={() => logout()}>
          Logout
        </Button>
      </Box>
    </>
  );
}

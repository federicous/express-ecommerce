import { Button, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";

const Return = () => {
  return (
    <>
      <Typography variant={"h5"} sx={{ margin: "40px" }}>
        NOT FOUND 404
      </Typography>
      <Link
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
        to={`/`}
      >
        <Button size="small" variant="contained" color="primary">
          return
        </Button>
      </Link>
    </>
  );
};

export default Return;

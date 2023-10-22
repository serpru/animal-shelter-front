import { Button, Typography } from "@mui/material";
import React from "react";

function Dashboard() {
  return (
    <>
      <Typography>Animal Shelter Management System</Typography>
      <Button variant="contained" href={"/animal-search"}>
        Search animals
      </Button>
      <Button variant="contained" href={"/animal-add"}>
        Add animal
      </Button>
      <Button variant="contained" href={"/adoption-add"}>
        Create adoption
      </Button>
      <Button variant="contained" href={"/adoptee-add"}>
        Add adoptee
      </Button>
    </>
  );
}

export default Dashboard;

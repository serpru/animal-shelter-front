import { Button, Card, Grid, Typography } from "@mui/material";
import React from "react";

function Dashboard() {
  return (
    <>
      <Typography>Animal Shelter Management System</Typography>
      <Grid container rowGap={2} maxWidth={500}>
        <Grid rowGap={2} xs={12}>
          <Card>
            <Grid container rowGap={2} margin={1}>
              <Grid item xs={12}>
                <Typography>Manage animals</Typography>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" href={"/animal-add"}>
                  Add animal
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" href={"/animal-search"}>
                  Search animals
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid rowGap={2} xs={12}>
          <Card>
            {" "}
            <Grid container rowGap={2} margin={1}>
              <Grid item xs={12}>
                <Typography>Manage employees</Typography>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" href={"/employee-add"}>
                  Add employee
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" href={"/employee-search"}>
                  Search employees
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid rowGap={2} xs={12}>
          <Card>
            {" "}
            <Grid container rowGap={2} margin={1} item xs={12}>
              <Grid item xs={12}>
                <Typography>Manage adoptions</Typography>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" href={"/adoptee-add"}>
                  Add adoptee
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" href={"/adoption-add"}>
                  Create adoption
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" href={"/visit-add"}>
                  Add visit
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default Dashboard;

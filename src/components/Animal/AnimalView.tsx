import React, { useEffect, useState } from "react";
import { EndPoint } from "../../models/EndPoint";
import { useParams } from "react-router-dom";
import { AnimalResponse } from "../../models/Animal/AnimalResponse";
import {
  Button,
  Card,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Adoption } from "../../models/Adoption/Adoption";
import { AdoptionShort } from "../../models/Adoption/AdoptionShort";

function AnimalView() {
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<boolean>(false);

  const [data, setData] = useState<AnimalResponse>();

  const { animal_id } = useParams();

  useEffect(() => {
    getAnimal();
  }, []);

  function getAnimal() {
    fetch(EndPoint.root + EndPoint.animal + "/" + animal_id, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((actualData: AnimalResponse) => {
        let fetchData: AnimalResponse = {
          animal: actualData.animal,
          adoptions: actualData.adoptions,
        };
        setData(fetchData);
        console.log(fetchData);
      })
      .catch((err) => {
        setError(true);
        console.log(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  return (
    <>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <Card>
            <Grid container>
              <Grid item xs={4}>
                <Typography fontWeight={"bold"}>Name</Typography>
                <Typography>{data?.animal.name}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography fontWeight={"bold"}>{"Weight (kg)"}</Typography>
                <Typography>{data?.animal.weight_kg}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography fontWeight={"bold"}>
                  Aggression towards animals
                </Typography>
                <Typography>
                  {data?.animal.aggression_animals.description}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography fontWeight={"bold"}>Date of arrival</Typography>
                <Typography>
                  {new Date(data!.animal.arrive_date).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography fontWeight={"bold"}>Status</Typography>
                <Typography>{data?.animal.status.name}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography fontWeight={"bold"}>
                  Aggression towards humans
                </Typography>
                <Typography>
                  {data?.animal.aggression_humans.description}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {data?.animal.adoption_date && (
                  <>
                    <Typography fontWeight={"bold"}>Adopted on</Typography>
                    <Typography>
                      {new Date(
                        data?.animal.adoption_date
                      ).toLocaleDateString()}
                    </Typography>
                  </>
                )}
              </Grid>
            </Grid>
          </Card>
          <Button variant="contained" href={"/animal-edit/" + data?.animal.id}>
            Edit
          </Button>
          {data!.adoptions.length > 0 ? (
            <>
              <Typography fontWeight={"bold"}>Adoption history</Typography>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Start date</TableCell>
                      <TableCell align="right">End date</TableCell>
                      <TableCell align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  {data && (
                    <TableBody>
                      {data?.adoptions.map((adoption: AdoptionShort) => (
                        <TableRow
                          key={adoption.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {new Date(adoption.start_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="right">
                            {new Date(adoption.end_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="right">
                            {adoption.status.description}
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              variant="contained"
                              href={"/adoption/" + adoption.id}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </>
          ) : (
            <Typography>No adoption history</Typography>
          )}
        </>
      )}
    </>
  );
}

export default AnimalView;

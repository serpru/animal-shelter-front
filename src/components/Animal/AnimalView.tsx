import React, { useEffect, useState } from "react";
import { EndPoint } from "../../models/EndPoint";
import { useParams } from "react-router-dom";
import { AnimalResponse } from "../../models/Animal/AnimalResponse";
import { Button, Grid, Typography } from "@mui/material";
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
    fetch(EndPoint.root + EndPoint.animal + "/" + animal_id)
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
          <Typography fontWeight={"bold"}>Name</Typography>
          <Typography>{data?.animal.name}</Typography>
          <Typography fontWeight={"bold"}>
            Aggression towards animals
          </Typography>
          <Typography>{data?.animal.aggression_animals.description}</Typography>
          <Typography fontWeight={"bold"}>Aggression towards humans</Typography>
          <Typography>{data?.animal.aggression_humans.description}</Typography>
          <Typography fontWeight={"bold"}>Date of arrival</Typography>
          <Typography>
            {new Date(data!.animal.arrive_date).toLocaleDateString()}
          </Typography>
          {data?.animal.adoption_date && (
            <>
              <Typography fontWeight={"bold"}>Adopted on</Typography>
              <Typography>
                {new Date(data?.animal.adoption_date).toLocaleDateString()}
              </Typography>
            </>
          )}
          <Typography fontWeight={"bold"}>{"Weight (kg)"}</Typography>
          <Typography>{data?.animal.weight_kg}</Typography>
          <Typography fontWeight={"bold"}>Status</Typography>
          <Typography>{data?.animal.status.name}</Typography>

          {data!.adoptions.length > 0 ? (
            <>
              <Typography fontWeight={"bold"}>Adoption history</Typography>
              <Grid container rowGap={2}>
                <Grid item xs={3}>
                  Start date
                </Grid>
                <Grid item xs={3}>
                  End date
                </Grid>
                <Grid item xs={3}>
                  Status
                </Grid>
                {data?.adoptions.map((adoption: AdoptionShort) => (
                  <Grid container spacing={3} key={adoption.id}>
                    <Grid item xs={3}>
                      <Typography>
                        {new Date(adoption.start_date).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      {adoption.end_date ? (
                        <Typography>
                          {new Date(adoption.end_date).toLocaleDateString()}
                        </Typography>
                      ) : (
                        <Typography>N/A</Typography>
                      )}
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>{adoption.status.description}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        variant="contained"
                        href={"/adoption/" + adoption.id}
                      >
                        View
                      </Button>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <Typography>No adoptions in history</Typography>
          )}
        </>
      )}
    </>
  );
}

export default AnimalView;

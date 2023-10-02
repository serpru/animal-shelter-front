import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Adoption } from "../../models/Adoption/Adoption";
import { EndPoint } from "../../models/EndPoint";
import { AdoptionStatus } from "../../models/Adoption/AdoptionStatus";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent,
  Button,
  AlertColor,
  Grid,
} from "@mui/material";
import { AdoptionRequest } from "../../models/Adoption/AdoptionRequest";
import SimpleSnackbar from "../SimpleSnackbar";

function AdoptionView() {
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<boolean>(false);

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [formData, setFormData] = useState<AdoptionStatus[]>();

  let today: Date = dayjs.utc(new Date()).toDate();

  const { adoption_id } = useParams();

  const [data, setData] = useState<Adoption>();

  const [dataOriginal, setDataOriginal] = useState<Adoption>();

  const [openSnack, setOpenSnack] = useState(false);

  const [snackMessage, setSnackMessage] = useState<{
    message: string;
    severity: AlertColor;
  }>({
    message: "Blank",
    severity: "warning",
  });

  useEffect(() => {
    getFormData();
    getAdoption();
  }, []);

  function getFormData() {
    fetch(EndPoint.root + EndPoint.adoption_statuses)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((actualData) => {
        let fetchData: AdoptionStatus[] = actualData;
        console.log(fetchData);
        setFormData(fetchData);
        //setLoading(false);
      })
      .catch((err) => {
        //setLoading(false);
        setError(true);
        console.log(err.message);
      })
      .finally(() => {});
  }

  function getAdoption() {
    fetch(EndPoint.root + EndPoint.adoption + "/" + adoption_id)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((actualData) => {
        console.log("Actual data");
        console.log(actualData);
        let fetchData: Adoption = {
          id: actualData.id,
          start_date: new Date(actualData.start_date + "Z"),
          end_date: actualData.end_date
            ? new Date(actualData.end_date + "Z")
            : undefined,
          note: actualData.note ? actualData.note : "",
          adoptee: actualData.adoptee,
          employee: actualData.employee,
          adoption_status: actualData.adoption_status,
          animal: actualData.animal,
          visits: actualData.visits,
        };
        setData(fetchData);
        setDataOriginal(fetchData);
        console.log(fetchData);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        console.log(err.message);
      });
  }

  async function submitData() {
    let endpoint = EndPoint.root + EndPoint.adoption_edit + "/" + adoption_id;

    let submitData = {
      id: data!.id,
      employee_id: data!.employee.id,
      adoption_status_id: data!.adoption_status.id,
      note: data!.note,
    };

    console.warn("Submit data");
    console.log(submitData);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submitData),
    })
      .then((response) => {
        if (!response.ok) {
          setSnackMessage({ message: "Error.", severity: "error" });
          return response.text().then((text) => {
            throw new Error(text.slice(1, text.length - 1));
          });
        }
        console.log(response);
        setSnackMessage({
          message: "Adoption created.",
          severity: "success",
        });

        return response.json();
      })
      .catch((err) => {
        console.log(err);
        setSnackMessage({
          message: err.message,
          severity: "error",
        });
      })
      .finally(() => {
        setOpenSnack(true);
      });
  }

  function handleAdoptionStatusChange(event: SelectChangeEvent) {
    let newId = Number(event.target.value);
    let newStatus: AdoptionStatus = formData!.find((x) => x.id == newId)!;
    console.log(newStatus);
    setData({
      ...data!,
      adoption_status: newStatus,
    });
  }

  function resetForm() {
    setData(dataOriginal);
  }

  //  Debug
  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <Typography>Adoption</Typography>
          <Grid container>
            <Grid item xs={6}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography>Adoptee</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{`${data?.adoptee.first_name} ${data?.adoptee.last_name}`}</Typography>
                </Grid>
                <Grid item xs={6}>{`${data?.adoptee.phone_number}`}</Grid>
                <Grid item xs={6}>{`${data?.adoptee.address}`}</Grid>
                <Grid item xs={6}>{`${data?.adoptee.email}`}</Grid>
                <Grid
                  item
                  xs={6}
                >{`${data?.adoptee.zip_code} ${data?.adoptee.city}`}</Grid>

                <Grid item xs={6}>{`${data?.adoptee.country}`}</Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography>Animal</Typography>
                </Grid>
                <Grid item xs={12}>{`${data?.animal.name}`}</Grid>
                <Grid
                  item
                  xs={12}
                >{`${data?.animal.breed.name} | ${data?.animal.breed.animalSpecies.species}`}</Grid>
                <Grid item xs={12}>{`Birthday: ${new Date(
                  data!.animal.birth_date
                ).toLocaleDateString()}`}</Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={6}>
                  <Typography>Employee</Typography>
                  <Typography>{`${data?.employee.first_name} ${data?.employee.last_name}`}</Typography>
                </Grid>
                <Grid item xs={6}>
                  {" "}
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">
                      Status
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={data?.adoption_status.id.toString()}
                      label="Status"
                      onChange={handleAdoptionStatusChange}
                      disabled={!isEdit}
                    >
                      {formData?.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          {`${x.description}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {isEdit ? (
                    <>
                      <Button
                        onClick={() => {
                          setIsEdit(false);
                          submitData();
                        }}
                      >
                        Submit
                      </Button>
                      <Button
                        onClick={() => {
                          resetForm();
                          setIsEdit(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEdit(true)}>Edit</Button>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container>
                {data?.visits ? (
                  data.visits.map((visit) => (
                    <Grid container key={visit.id}>
                      <Grid item xs={4}>
                        {new Date(visit.date).toLocaleDateString()}
                      </Grid>
                      <Grid
                        item
                        xs={4}
                      >{`${visit.visit_status.description}`}</Grid>
                      <Grid item xs={4}>
                        <Button variant="contained" href={"/visit/" + visit.id}>
                          View
                        </Button>
                      </Grid>
                    </Grid>
                  ))
                ) : (
                  <Typography>Test</Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
      <SimpleSnackbar
        open={openSnack}
        setOpen={setOpenSnack}
        message={snackMessage.message}
        severity={snackMessage.severity}
      ></SimpleSnackbar>
    </>
  );
}

export default AdoptionView;

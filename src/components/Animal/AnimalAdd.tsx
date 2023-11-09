import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { AnimalRequest } from "../../models/Animal/AnimalRequest";
import {
  AlertColor,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { EndPoint } from "../../models/EndPoint";
import { AnimalAddForm } from "../../models/AnimalAddForm";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { getTodayDate } from "@mui/x-date-pickers/internals";
import moment from "moment";

import SimpleSnackbar from "../SimpleSnackbar";
import { useParams } from "react-router-dom";
import { AnimalResponse } from "../../models/Animal/AnimalResponse";

interface Props {
  mode: "edit" | "add";
}

function AnimalAdd({ mode }: Props) {
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<boolean>(false);

  const [isEdit, setIsEdit] = useState<boolean>(mode == "edit" ? false : true);

  const [formData, setFormData] = useState<AnimalAddForm>();

  const [value, setValue] = useState<Dayjs | null>(dayjs.utc(new Date()));

  let today: Date = dayjs.utc(new Date()).toDate();

  const dataBlank: AnimalRequest = {
    name: "",
    birth_date: today,
    aggression_animals_id: 3,
    aggression_humans_id: 3,
    origin_id: 2,
    status_id: 3,
    breed_id: 3,
    weight_kg: 5,
    need_medication: false,
    arrive_date: today,
  };

  const [data, setData] = useState<AnimalRequest>(dataBlank);

  const [dataOriginal, setDataOriginal] = useState<AnimalRequest>(dataBlank);

  const { animal_id } = useParams();

  function getFormData() {
    fetch(EndPoint.root + EndPoint.animal_add_form, {
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
      .then((actualData) => {
        let fetchData: AnimalAddForm = {
          aggressions: actualData.aggressions,
          breeds: actualData.breeds,
          origins: actualData.origins,
          statuses: actualData.statuses,
        };
        setFormData(fetchData);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        console.log(err.message);
      })
      .finally(() => {});
  }

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
        let fetchData: AnimalRequest = {
          id: actualData.animal.id,
          name: actualData.animal.name,
          birth_date: new Date(actualData.animal.birth_date + "Z"),
          aggression_animals_id: actualData.animal.aggression_animals.id,
          aggression_humans_id: actualData.animal.aggression_humans.id,
          note: actualData.animal.note ? actualData.animal.note : "",
          breed_id: actualData.animal.breed.id,
          weight_kg: actualData.animal.weight_kg,
          need_medication: actualData.animal.need_medication,
          status_id: actualData.animal.status.id,
          origin_id: actualData.animal.origin.id,
          arrive_date: new Date(actualData.animal.arrive_date + "Z"),
          adoption_date: actualData.animal.adoption_date,
        };
        setData(fetchData);
        setDataOriginal(fetchData);
        console.log(fetchData);
        console.log(actualData);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        console.log(err.message);
      });
  }

  async function submitData() {
    let endpoint = undefined;
    if (animal_id) {
      endpoint = EndPoint.root + EndPoint.animal_edit + "/" + animal_id;
    } else {
      endpoint = EndPoint.root + EndPoint.animal_add;
    }

    let t = dayjs.tz.guess();
    console.log(t);
    console.log(endpoint);

    let submitData: AnimalRequest = {
      id: data.id,
      name: data.name,
      birth_date: data.birth_date,
      aggression_animals_id: data.aggression_animals_id,
      aggression_humans_id: data.aggression_humans_id,
      note: data.note,
      breed_id: data.breed_id,
      weight_kg: data.weight_kg,
      need_medication: data.need_medication,
      status_id: data.status_id,
      origin_id: data.origin_id,
      arrive_date: data.arrive_date,
      adoption_date: data.adoption_date,
    };

    console.warn("Submit data");
    console.log(submitData);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(submitData),
    })
      .then((response) => {
        if (!response.ok) {
          setSnackMessage({ message: "Error.", severity: "error" });
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        console.log(response);
        setSnackMessage({
          message: "Updated animal data in database.",
          severity: "success",
        });

        return response.json();
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        setOpenSnack(true);
      });
  }

  function resetForm() {
    setData(dataOriginal);
  }

  useEffect(() => {
    console.log(data);
  }, [data]);

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, name: event.target.value });
  }

  function handleBirthDateChange(newDate: Dayjs | null) {
    setData({ ...data, birth_date: newDate!.toDate() });
  }

  function handleSpeciesChange(event: SelectChangeEvent) {
    console.log(event.target.value);
    let newId = formData?.breeds.find(
      (x) => x.animalSpecies.species == event.target.value
    )?.id;
    console.log(newId);
    //let newBreeds = filterBreeds(newId);
    setData({
      ...data,
      breed_id: newId,
    });
  }

  function handleAggressionAnimalsChange(event: SelectChangeEvent) {
    setData({
      ...data,
      aggression_animals_id: Number(event.target.value),
    });
  }

  function handleAggressionHumansChange(event: SelectChangeEvent) {
    setData({
      ...data,
      aggression_humans_id: Number(event.target.value),
    });
  }

  function handleOriginChange(event: SelectChangeEvent) {
    setData({
      ...data,
      origin_id: Number(event.target.value),
    });
  }

  function handleStatusChange(event: SelectChangeEvent) {
    setData({
      ...data,
      status_id: Number(event.target.value),
    });
  }

  function filterBreeds(animalSpeciesId: number) {
    var breeds = formData?.breeds.filter(
      (x) => x.animalSpecies.id === animalSpeciesId
    );
    return breeds;
  }

  function handleBreedChange(event: SelectChangeEvent) {
    setData({ ...data, breed_id: Number(event.target.value) });
  }

  function handleNoteChange(event: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, note: event.target.value });
  }

  function handleWeightChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    let newWeight = Number(event.target.value);
    if (newWeight < 0 || newWeight > 160) {
      return;
    }
    setData({
      ...data,
      weight_kg: newWeight,
    });
  }

  function handleMedicationChange(event: React.ChangeEvent<HTMLInputElement>) {
    let newValue = event.target.checked;
    console.log(newValue);
    setData({
      ...data,
      need_medication: newValue,
    });
  }

  function handleArriveDateChange(newDate: Dayjs | null) {
    setData({ ...data, arrive_date: newDate!.toDate() });
  }

  useEffect(() => {
    getFormData();
    if (animal_id) {
      getAnimal();
    }
  }, []);

  // useEffect(() => {
  //   console.log(formData);
  // }, [formData]);

  const [openSnack, setOpenSnack] = useState(false);

  const [snackMessage, setSnackMessage] = useState<{
    message: string;
    severity: AlertColor;
  }>({
    message: "Blank",
    severity: "warning",
  });

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (formData) {
    return (
      <>
        {!loading && (
          <>
            {mode == "add" ? (
              <Typography>Adding new animal</Typography>
            ) : (
              <Typography>Edit animal info</Typography>
            )}
            <Grid container rowGap={2}>
              <Grid item xs={4}>
                <FormControl>
                  <InputLabel htmlFor="animal-name">Name</InputLabel>
                  <Input
                    value={data.name}
                    onChange={handleNameChange}
                    disabled={!isEdit}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                {" "}
                <FormControl>
                  <DatePicker
                    label="Birth date"
                    value={dayjs(data.birth_date)}
                    disableFuture
                    onChange={handleBirthDateChange}
                    format="DD/MM/YYYY"
                    timezone="system"
                    disabled={mode == "add" ? false : true}
                  ></DatePicker>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                {" "}
                <FormControl>
                  <DateTimePicker
                    label="Arrive date"
                    value={dayjs(data.arrive_date)}
                    disableFuture
                    onChange={handleArriveDateChange}
                    ampm={false}
                    format="DD/MM/YYYY HH:mm"
                    timezone="system"
                    disabled={mode == "add" ? false : true}
                  ></DateTimePicker>
                </FormControl>
              </Grid>
              <Grid container item xs={4} rowGap={2}>
                <Grid item xs={12}>
                  {" "}
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">
                      Species
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={
                        formData.breeds.find((x) => x.id == data.breed_id)
                          ?.animalSpecies.species
                      }
                      label="Species"
                      onChange={handleSpeciesChange}
                      disabled={!isEdit}
                    >
                      {[
                        ...new Set(
                          formData.breeds.map((x) => x.animalSpecies.species)
                        ),
                      ].map((x) => (
                        <MenuItem key={x} value={x}>
                          {x}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  {" "}
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">Breed</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={data.breed_id?.toString()}
                      label="Breeds"
                      onChange={handleBreedChange}
                      disabled={!isEdit}
                    >
                      {filterBreeds(
                        formData.breeds.find((x) => x.id == data.breed_id)
                          ?.animalSpecies.id!
                      )?.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          {x.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container item xs={4} rowGap={2}>
                <Grid item xs={12}>
                  {" "}
                  <FormControl style={{ minWidth: 240 }}>
                    <InputLabel id="demo-simple-select-label">
                      Aggression towards animals
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={data.aggression_animals_id?.toString()}
                      label="Species"
                      onChange={handleAggressionAnimalsChange}
                      disabled={!isEdit}
                    >
                      {formData.aggressions.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          {x.description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  {" "}
                  <FormControl style={{ minWidth: 240 }}>
                    <InputLabel id="demo-simple-select-label">
                      Aggression towards humans
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={data.aggression_humans_id?.toString()}
                      label="Species"
                      onChange={handleAggressionHumansChange}
                      disabled={!isEdit}
                    >
                      {formData.aggressions.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          {x.description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container item xs={4}>
                <Grid item xs={12}>
                  {" "}
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">
                      Origin
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={data.origin_id?.toString()}
                      label="Species"
                      onChange={handleOriginChange}
                      disabled={!isEdit}
                    >
                      {formData.origins.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          {x.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  {" "}
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">
                      Status
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={data.status_id?.toString()}
                      label="Species"
                      onChange={handleStatusChange}
                      disabled={mode == "add" ? true : !isEdit}
                    >
                      {formData.statuses.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          {x.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid item xs={4}>
                {" "}
                <FormControl>
                  <InputLabel id="demo-simple-select-label">Note</InputLabel>
                  <Input
                    multiline
                    onChange={handleNoteChange}
                    value={data.note}
                    disabled={!isEdit}
                  ></Input>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                {" "}
                <FormControl>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={data.need_medication}
                        onChange={handleMedicationChange}
                        disabled={!isEdit}
                      />
                    }
                    label="Need medication"
                  ></FormControlLabel>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                {" "}
                <FormControl>
                  <TextField
                    id="outlined-number"
                    label="Weight (kg)"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleWeightChange}
                    value={data.weight_kg}
                    disabled={!isEdit}
                  />
                </FormControl>
              </Grid>
            </Grid>

            {mode === "edit" ? (
              <>
                {" "}
                {isEdit && (
                  <>
                    <Button onClick={submitData}>Submit</Button>
                    <Button
                      onClick={() => {
                        resetForm();
                        setIsEdit(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
                {!isEdit && (
                  <Button onClick={() => setIsEdit(true)}>Edit</Button>
                )}
              </>
            ) : (
              <Button variant="contained" onClick={submitData}>
                Submit
              </Button>
            )}
            <SimpleSnackbar
              open={openSnack}
              setOpen={setOpenSnack}
              message={snackMessage.message}
              severity={snackMessage.severity}
            ></SimpleSnackbar>
          </>
        )}
      </>
    );
  }

  return <div>Error</div>;
}

{
}

export default AnimalAdd;

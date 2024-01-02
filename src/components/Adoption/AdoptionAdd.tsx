import {
  SelectChangeEvent,
  AlertColor,
  Typography,
  FormControl,
  InputLabel,
  Input,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  Card,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs, PluginFunc } from "dayjs";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EmployeeRequest } from "../../models/Employee/EmployeeRequest";
import { EmployeeAddForm } from "../../models/EmployeeAddForm";
import { EndPoint } from "../../models/EndPoint";
import SimpleSnackbar from "../SimpleSnackbar";
import { AdoptionForm } from "../../models/Adoption/AdoptionForm";
import { AdoptionRequest } from "../../models/Adoption/AdoptionRequest";

interface Props {
  mode: "edit" | "add";
  timezone: PluginFunc;
}

function AdoptionAdd({ mode, timezone }: Props) {
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<boolean>(false);

  const [isEdit, setIsEdit] = useState<boolean>(mode == "edit" ? false : true);

  const [formData, setFormData] = useState<AdoptionForm>();

  let today: Date = dayjs.utc(new Date()).toDate();

  const { adoption_id } = useParams();

  const dataBlank: AdoptionRequest = {
    adoptee_id: 0,
    employee_id: 0,
    adoption_status_id: 0,
    start_date: today,
    animal_id: 0,
  };

  const [data, setData] = useState<AdoptionRequest>();

  const [dataOriginal, setDataOriginal] = useState<AdoptionRequest>(dataBlank);

  useEffect(() => {
    getFormData();
    if (mode == "edit") {
      getAdoption();
    }
  }, []);

  function getAdoption() {
    fetch(EndPoint.root + EndPoint.adoption + "/" + adoption_id, {
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
        console.log("Actual data");
        console.log(actualData);
        let fetchData: AdoptionRequest = {
          id: actualData.id,
          start_date: new Date(actualData.start_date + "Z"),
          end_date: new Date(actualData.end_date + "Z"),
          note: actualData.note ? actualData.note : "",
          adoptee_id: actualData.adoptee.id,
          employee_id: actualData.employee.id,
          adoption_status_id: actualData.adoption_status.id,
          animal_id: actualData.animal.id,
        };
        setData(fetchData);
        setDataOriginal(fetchData);
        console.log(fetchData);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        console.log(err.message);
      });
  }

  function getFormData() {
    fetch(EndPoint.root + EndPoint.adoption_add_form, {
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
        let fetchData: AdoptionForm = {
          adoptees: actualData.adoptees,
          employees: actualData.employees,
          statuses: actualData.statuses,
          animals: actualData.animals,
        };
        console.log(fetchData);
        setFormData(fetchData);
        if (!adoption_id) {
          let mock: AdoptionRequest = {
            adoptee_id: fetchData.adoptees[0].id,
            employee_id: fetchData.employees[0].id,
            adoption_status_id: fetchData.statuses[0].id,
            start_date: today,
            animal_id: fetchData.animals[0].id,
          };
          setData(mock);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        console.log(err.message);
      })
      .finally(() => {});
  }

  async function submitData() {
    let endpoint = undefined;
    if (adoption_id) {
      endpoint = EndPoint.root + EndPoint.adoption_edit + "/" + adoption_id;
    } else {
      endpoint = EndPoint.root + EndPoint.adoption_add;
    }

    let t = dayjs.tz.guess();

    let submitData: AdoptionRequest = {
      adoptee_id: data!.adoptee_id,
      employee_id: data!.employee_id,
      adoption_status_id: data!.adoption_status_id,
      start_date: data!.start_date,
      animal_id: data!.animal_id,
      end_date: data!.end_date,
      note: data!.note,
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

  function resetForm() {
    setData(dataOriginal);
  }

  useEffect(() => {
    console.log("data");
    console.log(data);
  }, [data]);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  function handleAnimalChange(event: SelectChangeEvent) {
    let newId = Number(event.target.value);
    setData({ ...data!, animal_id: newId });
  }

  function handleAdopteeChange(event: SelectChangeEvent) {
    let newId = Number(event.target.value);
    setData({ ...data!, adoptee_id: newId });
  }

  function handleEmployeeChange(event: SelectChangeEvent) {
    let newId = Number(event.target.value);
    setData({ ...data!, employee_id: newId });
  }

  function handleAdoptionStatusChange(event: SelectChangeEvent) {
    let newId = Number(event.target.value);
    setData({ ...data!, adoption_status_id: newId });
  }

  function handleStartDateChange(newDate: Dayjs | null) {
    setData({ ...data!, start_date: newDate!.toDate() });
  }

  function handleNoteChange(event: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data!, note: event.target.value });
  }

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

  if (data) {
    return (
      <>
        {!loading && (
          <>
            <Card>
              <Typography>
                {mode == "add"
                  ? "Create adoption for"
                  : "Edit adoption info for"}
              </Typography>
              <Typography>
                {
                  formData?.animals.find(
                    (animal) => animal.id == data.animal_id
                  )?.name
                }
              </Typography>
              <Typography>{data.start_date.toLocaleDateString()}</Typography>
              <Grid container rowGap={2}>
                <Grid item xs={4}>
                  {" "}
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">
                      Animal
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={data.animal_id.toString()}
                      label="Animal"
                      onChange={handleAnimalChange}
                      disabled={!isEdit}
                    >
                      {formData?.animals.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          {x.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  {" "}
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">
                      Adoptee
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={data.adoptee_id.toString()}
                      label="Adoptee"
                      onChange={handleAdopteeChange}
                      disabled={mode == "edit" ? true : !isEdit}
                    >
                      {formData?.adoptees.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          {`${x.first_name} ${x.last_name}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  {" "}
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">
                      Employee
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={data.employee_id.toString()}
                      label="Employee"
                      onChange={handleEmployeeChange}
                      disabled={mode == "edit" ? true : !isEdit}
                    >
                      {formData?.employees.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          {`${x.first_name} ${x.last_name}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
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
              </Grid>

              {mode === "edit" ? (
                <>
                  {" "}
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">
                      Status
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={data.adoption_status_id.toString()}
                      label="Status"
                      onChange={handleAdoptionStatusChange}
                      disabled={!isEdit}
                    >
                      {formData?.statuses.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          {`${x.description}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {isEdit && (
                    <>
                      <Button variant="contained" onClick={submitData}>
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
            </Card>
          </>
        )}
      </>
    );
  }
}

export default AdoptionAdd;

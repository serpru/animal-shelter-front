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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React, { ChangeEvent, useEffect, useState } from "react";
import { EmployeeRequest } from "../../models/Employee/EmployeeRequest";
import { EmployeeAddForm } from "../../models/EmployeeAddForm";
import { EndPoint } from "../../models/EndPoint";
import SimpleSnackbar from "../SimpleSnackbar";
import { useParams } from "react-router-dom";

interface Props {
  mode: "edit" | "add";
}

function EmployeeEdit({ mode }: Props) {
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<boolean>(false);

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [formData, setFormData] = useState<EmployeeAddForm>();

  let today: Date = dayjs.utc(new Date()).toDate();

  const dataBlank: EmployeeRequest = {
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    salary: 0,
    job_type_id: 1,
    start_date: today,
    birth_date: today,
  };

  const [data, setData] = useState<EmployeeRequest>(dataBlank);

  const [dataOriginal, setDataOriginal] = useState<EmployeeRequest>(dataBlank);

  const { employee_id } = useParams();

  useEffect(() => {
    getFormData();
    if (employee_id) {
      getEmployee();
    }
  }, []);

  function getEmployee() {
    fetch(EndPoint.root + EndPoint.employee + "/" + employee_id)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((actualData) => {
        let fetchData: EmployeeRequest = {
          id: actualData.id,
          first_name: actualData.first_name,
          last_name: actualData.last_name,
          phone_number: actualData.phone_number,
          email: actualData.email,
          salary: actualData.salary,
          job_type_id: actualData.job_type.id,
          start_date: actualData.start_date,
          birth_date: actualData.birth_date,
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
    fetch(EndPoint.root + EndPoint.employee_add_form)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((actualData) => {
        let fetchData: EmployeeAddForm = {
          job_types: actualData.jobTypes,
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

  async function submitData() {
    let endpoint = undefined;
    if (employee_id) {
      endpoint = EndPoint.root + EndPoint.employee_edit + "/" + employee_id;
    } else {
      endpoint = EndPoint.root + EndPoint.employee_add;
    }

    let t = dayjs.tz.guess();

    let submitData = {
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
      phone_number: data.phone_number,
      email: data.email,
      salary: data.salary,
      job_type_id: data.job_type_id,
      start_date: data.start_date,
      birth_date: data.birth_date,
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
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        console.log(response);
        setSnackMessage({
          message: "Updated employee data in database.",
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

  function handleFirstNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, first_name: event.target.value });
  }

  function handleLastNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, last_name: event.target.value });
  }

  function handlePhoneChange(event: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, phone_number: event.target.value });
  }

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, email: event.target.value });
  }

  function handleSalaryChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    let newSalary = Number(event.target.value);
    setData({
      ...data,
      salary: newSalary,
    });
  }

  function handleJobTypeChange(event: SelectChangeEvent) {
    let newId = Number(event.target.value);
    setData({
      ...data,
      job_type_id: newId,
    });
  }

  function handleBirthDateChange(newDate: Dayjs | null) {
    setData({ ...data, birth_date: newDate!.toDate() });
  }

  function handleStartDateChange(newDate: Dayjs | null) {
    setData({ ...data, start_date: newDate!.toDate() });
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

  if (formData) {
    return (
      <>
        {!loading && (
          <>
            <Typography>Add employee</Typography>
            <FormControl>
              <InputLabel htmlFor="animal-name">First name</InputLabel>
              <Input
                value={data.first_name}
                onChange={handleFirstNameChange}
                disabled={!isEdit}
              />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="animal-name">Last name</InputLabel>
              <Input
                value={data.last_name}
                onChange={handleLastNameChange}
                disabled={!isEdit}
              />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="animal-name">Phone number</InputLabel>
              <Input
                value={data.phone_number}
                onChange={handlePhoneChange}
                disabled={!isEdit}
              />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="animal-name">Email</InputLabel>
              <Input
                value={data.email}
                onChange={handleEmailChange}
                disabled={!isEdit}
              />
            </FormControl>
            <FormControl>
              <TextField
                id="outlined-number"
                label="Salary"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleSalaryChange}
                value={data.salary}
                disabled={!isEdit}
              />
            </FormControl>
            <FormControl>
              <InputLabel id="demo-simple-select-label">Job type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={data.job_type_id?.toString()}
                label="Job type"
                onChange={handleJobTypeChange}
                disabled={!isEdit}
              >
                {formData.job_types.map((x) => (
                  <MenuItem key={x.id} value={x.id}>
                    {x.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <DatePicker
                label="Birth date"
                value={dayjs(data.birth_date)}
                disableFuture
                onChange={handleBirthDateChange}
                format="DD/MM/YYYY"
                timezone="system"
                disabled={!isEdit}
              ></DatePicker>
            </FormControl>
            <FormControl>
              <DatePicker
                label="Start date"
                value={dayjs(data.start_date)}
                disableFuture
                onChange={handleStartDateChange}
                format="DD/MM/YYYY"
                timezone="system"
                disabled={!isEdit}
              ></DatePicker>
            </FormControl>
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
              <Button onClick={submitData}>Submit</Button>
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
}

export default EmployeeEdit;

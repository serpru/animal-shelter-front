import { EndPoint } from "../../models/EndPoint";
import { EmployeeAddForm } from "../../models/EmployeeAddForm";
import { EmployeeRequest } from "../../models/Employee/EmployeeRequest";
import dayjs, { Dayjs } from "dayjs";
import {
  AlertColor,
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { ChangeEvent, useEffect, useState } from "react";
import SimpleSnackbar from "../SimpleSnackbar";
import { Employee } from "../../models/Employee/Employee";

function EmployeeAdd() {
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<boolean>(false);

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

  useEffect(() => {
    getFormData();
  }, []);

  function getFormData() {
    fetch(EndPoint.root + EndPoint.employee_add_form, {
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
    let t = dayjs.tz.guess();

    let submitData = {
      first_name: data.first_name,
      last_name: data.last_name,
      phone_number: data.phone_number,
      email: data.email,
      salary: data.salary,
      job_type_id: data.job_type_id,
      start_date: data.start_date.toJSON(),
      birth_date: data.birth_date.toJSON(),
    };

    console.warn("Submit data");
    console.log(submitData);

    const response = await fetch(EndPoint.root + EndPoint.employee_add, {
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
          message: "Added employee to database.",
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
              <Input value={data.first_name} onChange={handleFirstNameChange} />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="animal-name">Last name</InputLabel>
              <Input value={data.last_name} onChange={handleLastNameChange} />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="animal-name">Phone number</InputLabel>
              <Input value={data.phone_number} onChange={handlePhoneChange} />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="animal-name">Email</InputLabel>
              <Input value={data.email} onChange={handleEmailChange} />
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
              ></DatePicker>
            </FormControl>
            <Button onClick={submitData}>Submit</Button>
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

export default EmployeeAdd;

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
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs, PluginFunc } from "dayjs";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EmployeeRequest } from "../../models/Employee/EmployeeRequest";
import { EmployeeAddForm } from "../../models/EmployeeAddForm";
import { EndPoint } from "../../models/EndPoint";
import SimpleSnackbar from "../SimpleSnackbar";
import { VisitForm } from "../../models/Visit/VisitForm";
import { VisitRequest } from "../../models/Visit/VisitRequest";
import { AdoptionShort } from "../../models/Adoption/AdoptionShort";

interface Props {
  mode: "edit" | "add";
  timezone: PluginFunc;
}

function VisitAdd({ mode, timezone }: Props) {
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<boolean>(false);

  const [isEdit, setIsEdit] = useState<boolean>(mode == "edit" ? false : true);

  const [formData, setFormData] = useState<VisitForm>();

  let today: Date = dayjs.utc(new Date()).toDate();

  const dataBlank: VisitRequest = {
    date: today,
    adoption_id: 1,
    visit_status_id: 1,
  };

  const [data, setData] = useState<VisitRequest>();

  const [dataOriginal, setDataOriginal] = useState<VisitRequest>(dataBlank);

  const { visit_id } = useParams();

  useEffect(() => {
    getFormData();
    if (visit_id) {
      getVisit();
    }
  }, []);

  function getVisit() {
    const tzOffset = new Date().getTimezoneOffset();

    fetch(EndPoint.root + EndPoint.visit + "/" + visit_id)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((actualData) => {
        const dt = dayjs(actualData.date).utcOffset(tzOffset, true);
        let fetchData: VisitRequest = {
          id: actualData.id,
          date: new Date(actualData.date + "Z"),
          adoption_id: actualData.adoption_event.id,
          visit_status_id: actualData.visit_status.id,
        };

        console.log("UTC from server");
        console.log(actualData.date);
        console.log("new Date from UTC");
        console.log(new Date(actualData.date + "Z").toLocaleTimeString());
        console.log("dayjs utc");
        console.log(dayjs(fetchData.date).utc().format());
        console.log("dayjs utc + offset");
        console.log(dayjs(fetchData.date).format());
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
    fetch(EndPoint.root + EndPoint.visit_form_data)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((actualData) => {
        let fetchData: VisitForm = {
          adoptions: actualData.adoptions,
          statuses: actualData.visit_statuses,
        };
        console.log(fetchData);
        setFormData(fetchData);
        if (!visit_id) {
          let mock: VisitRequest = {
            date: today,
            adoption_id: fetchData.adoptions[0].id,
            visit_status_id: fetchData.statuses[0].id,
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
    if (visit_id) {
      endpoint = EndPoint.root + EndPoint.visit_edit + "/" + visit_id;
    } else {
      endpoint = EndPoint.root + EndPoint.visit_add;
    }

    let t = dayjs.tz.guess();

    let submitData: VisitRequest = {
      id: data!.id,
      date: data!.date,
      adoption_id: data!.adoption_id,
      visit_status_id: data!.visit_status_id,
    };

    console.warn("Submit data");
    console.log(submitData);
    console.log(submitData.date.toISOString());
    console.log(JSON.stringify(submitData.date));

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
          message: "Updated visit data in database.",
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
    console.log("data");
    console.log(data);
  }, [data]);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  function handleAdoptionChange(event: SelectChangeEvent) {
    let newId = Number(event.target.value);
    setData({ ...data!, adoption_id: newId });
  }

  function handleDateChange(newDate: Dayjs | null) {
    setData({ ...data!, date: newDate!.toDate() });
  }

  function handleVisitStatusChange(event: SelectChangeEvent) {
    let newId = Number(event.target.value);
    setData({ ...data!, visit_status_id: newId });
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
            <Typography>
              {mode == "add" ? "Add visit" : "Visit info"}
            </Typography>
            <FormControl>
              <InputLabel id="demo-simple-select-label">Job type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={data.adoption_id.toString()}
                label="Adoption"
                onChange={handleAdoptionChange}
                disabled={mode == "edit" ? true : !isEdit}
              >
                {formData?.adoptions.map((x: AdoptionShort) => (
                  <MenuItem key={x.id} value={x.id}>
                    {`${x.animal_name} | ${x.adoptee_name} | ${new Date(
                      x.start_date
                    ).toLocaleDateString()}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <DateTimePicker
                label="Date of visit"
                value={dayjs(data.date)}
                disablePast
                onChange={handleDateChange}
                format="DD/MM/YYYY HH:mm"
                timezone="system"
                disabled={!isEdit}
                ampm={false}
              ></DateTimePicker>
            </FormControl>
            <FormControl>
              <InputLabel id="demo-simple-select-label">
                Visit status
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={data.visit_status_id.toString()}
                label="Visit status"
                onChange={handleVisitStatusChange}
                disabled={mode == "add" ? true : !isEdit}
              >
                {formData?.statuses.map((x) => (
                  <MenuItem key={x.id} value={x.id}>
                    {x.description}
                  </MenuItem>
                ))}
              </Select>
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

export default VisitAdd;

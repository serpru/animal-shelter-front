import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { VisitResponse } from "../../models/Visit/VisitResponse";
import { VisitStatusDb } from "../../models/Db/VisitStatusDb";
import dayjs, { Dayjs } from "dayjs";
import { EndPoint } from "../../models/EndPoint";
import { VisitDb } from "../../models/Db/VisitDb";
import {
  AlertColor,
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdoptionShort } from "../../models/Adoption/AdoptionShort";
import SimpleSnackbar from "../SimpleSnackbar";
import { VisitRequest } from "../../models/Visit/VisitRequest";

function VisitView() {
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<boolean>(false);

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [statuses, setStatuses] = useState<VisitStatusDb[]>();

  let today: Date = dayjs.utc(new Date()).toDate();

  const [data, setData] = useState<VisitRequest>();

  const [dataOriginal, setDataOriginal] = useState<VisitRequest>();

  const [isDataChanged, setIsDataChanged] = useState(false);

  const { visit_id } = useParams();

  useEffect(() => {
    getVisitStatuses();
    getVisit();
  }, []);

  useEffect(() => {
    console.log("Data");
    console.log(data);
    console.log(dataOriginal);
    setIsDataChanged(hasDataChanged());
  }, [data]);

  function getVisit() {
    fetch(EndPoint.root + EndPoint.visit + "/" + visit_id)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((actualData: VisitResponse) => {
        let newData: VisitRequest = {
          id: actualData.id,
          date: new Date(actualData.date + "Z"),
          adoption_id: actualData.adoption_id,
          visit_status_id: actualData.visit_status.id,
          note: actualData.note,
        };
        setData(newData);
        setDataOriginal(newData);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        console.log(err.message);
      });
  }
  function getVisitStatuses() {
    fetch(EndPoint.root + EndPoint.visit_status)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((actualData) => {
        let fetchData: VisitStatusDb[] = actualData;
        console.log(fetchData);
        setStatuses(fetchData);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        console.log(err.message);
      })
      .finally(() => {});
  }
  function handleDateChange(newDate: Dayjs | null) {
    setData({ ...data!, date: newDate!.toDate() });
  }

  function handleVisitStatusChange(event: SelectChangeEvent) {
    let newId = Number(event.target.value);
    setData({ ...data!, visit_status_id: newId });
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
      note: data!.note,
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
        setData(submitData);
        setDataOriginal(submitData);
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
  function hasDataChanged() {
    if (data?.date != dataOriginal?.date) {
      return true;
    }
    if (data?.visit_status_id != dataOriginal?.visit_status_id) {
      return true;
    }
    if (data?.note != dataOriginal?.note) {
      return true;
    }
    return false;
  }
  if (loading) {
    return <Typography>Loading...</Typography>;
  }
  return (
    <>
      {!loading && (
        <>
          <Typography>Visit info</Typography>
          <FormControl>
            <DateTimePicker
              label="Date of visit"
              value={dayjs(data!.date)}
              disablePast
              onChange={handleDateChange}
              format="DD/MM/YYYY HH:mm"
              timezone="system"
              disabled={!isEdit}
              ampm={false}
            ></DateTimePicker>
          </FormControl>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Visit status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={data!.visit_status_id.toString()}
              label="Visit status"
              onChange={handleVisitStatusChange}
              disabled={!isEdit}
            >
              {statuses?.map((x) => (
                <MenuItem key={x.id} value={x.id}>
                  {x.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Note</InputLabel>
            <Input
              multiline
              onChange={handleNoteChange}
              value={data?.note ? data?.note : ""}
              disabled={!isEdit}
            ></Input>
          </FormControl>

          {
            <>
              {isEdit && (
                <>
                  <Button
                    onClick={() => {
                      setIsEdit(false);
                      submitData();
                    }}
                    disabled={!isDataChanged}
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
              )}
              {!isEdit && <Button onClick={() => setIsEdit(true)}>Edit</Button>}
            </>
          }
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

export default VisitView;

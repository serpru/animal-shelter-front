import dayjs, { Dayjs } from "dayjs";
import React, { ChangeEvent, useEffect, useState } from "react";
import { AdopteeRequest } from "../../models/Adoptee/AdopteeRequest";
import {
  AlertColor,
  Button,
  Card,
  FormControl,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { EndPoint } from "../../models/EndPoint";
import SimpleSnackbar from "../SimpleSnackbar";
import { SnackMessage } from "../../models/Alerts/SnackMessage";

function AdopteeAdd() {
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<boolean>(false);

  const [isEdit, setIsEdit] = useState<boolean>(true);

  const [isValid, setIsValid] = useState(false);

  let today: Date = dayjs.utc(new Date()).toDate();

  const dataBlank: AdopteeRequest = {
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    address: "",
    city: "",
    zipcode: "",
    country: "",
  };

  const [data, setData] = useState<AdopteeRequest>(dataBlank);

  async function submitData() {
    let endpoint: string = EndPoint.root + EndPoint.adoptee_add;

    let t = dayjs.tz.guess();

    let submitData: AdopteeRequest = {
      first_name: data.first_name,
      last_name: data.last_name,
      phone_number: data.phone_number,
      email: data.email,
      address: data.address,
      city: data.city,
      zipcode: data.zipcode,
      country: data.country,
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
          return response.text().then((text) => {
            throw new Error(text.slice(1, text.length - 1));
          });
        }
        console.log(response);
        response.text().then((text) => {
          setSnackMessage({
            message: text.slice(1, text.length - 1),
            severity: "success",
          });
        });

        return response.json();
      })
      .catch((err) => {
        console.log(err.message);
        setSnackMessage({
          message: err.message,
          severity: "error",
        });
      })
      .finally(() => {
        setIsEdit(true);
        setOpenSnack(true);
      });
  }

  useEffect(() => {
    console.log(data);
    console.log(validateForm());
  }, [data]);

  function validateForm() {
    if (data.first_name == dataBlank.first_name) {
      return setIsValid(false);
    }
    if (data.last_name == dataBlank.last_name) {
      return setIsValid(false);
    }
    if (data.address == dataBlank.address) {
      return setIsValid(false);
    }
    if (data.city == dataBlank.city) {
      return setIsValid(false);
    }
    if (data.country == dataBlank.country) {
      return setIsValid(false);
    }
    if (data.email == dataBlank.email) {
      return setIsValid(false);
    }
    if (data.phone_number == dataBlank.phone_number) {
      return setIsValid(false);
    }
    if (data.zipcode == dataBlank.zipcode) {
      return setIsValid(false);
    }
    return setIsValid(true);
  }

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

  function handleAddressChange(event: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, address: event.target.value });
  }

  function handleCityChange(event: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, city: event.target.value });
  }

  function handleZipcodeChange(event: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, zipcode: event.target.value });
  }

  function handleCountryChange(event: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, country: event.target.value });
  }

  const [openSnack, setOpenSnack] = useState(false);

  const [snackMessage, setSnackMessage] = useState<SnackMessage>({
    message: "Blank",
    severity: "warning",
  });

  return (
    <>
      {!loading && (
        <>
          <Card>
            <Typography>Add adoptee</Typography>
            <Grid container>
              <Grid item xs={3}>
                <FormControl>
                  <InputLabel htmlFor="adoptee_first_name">
                    First name
                  </InputLabel>
                  <Input
                    value={data.first_name}
                    onChange={handleFirstNameChange}
                    disabled={!isEdit}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl>
                  <InputLabel htmlFor="adoptee_last_name">Last name</InputLabel>
                  <Input
                    value={data.last_name}
                    onChange={handleLastNameChange}
                    disabled={!isEdit}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl>
                  <InputLabel htmlFor="adoptee_phone_number">
                    Phone number
                  </InputLabel>
                  <Input
                    value={data.phone_number}
                    onChange={handlePhoneChange}
                    disabled={!isEdit}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl>
                  <InputLabel htmlFor="adoptee_email">Email</InputLabel>
                  <Input
                    value={data.email}
                    onChange={handleEmailChange}
                    disabled={!isEdit}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl>
                  <InputLabel htmlFor="adoptee_address">Address</InputLabel>
                  <Input
                    value={data.address}
                    onChange={handleAddressChange}
                    disabled={!isEdit}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl>
                  <InputLabel htmlFor="adoptee_city">City</InputLabel>
                  <Input
                    value={data.city}
                    onChange={handleCityChange}
                    disabled={!isEdit}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl>
                  <InputLabel htmlFor="adoptee_zipcode">Zip-code</InputLabel>
                  <Input
                    value={data.zipcode}
                    onChange={handleZipcodeChange}
                    disabled={!isEdit}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl>
                  <InputLabel htmlFor="adoptee_country">Country</InputLabel>
                  <Input
                    value={data.country}
                    onChange={handleCountryChange}
                    disabled={!isEdit}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Button
              onClick={() => {
                setIsEdit(false);
                submitData();
              }}
              disabled={!isValid || !isEdit}
              variant="contained"
            >
              Submit
            </Button>
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

export default AdopteeAdd;

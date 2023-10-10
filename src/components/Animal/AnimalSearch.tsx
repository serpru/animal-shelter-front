import {
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { AnimalsResponse } from "../../models/AnimalsResponse";
import { EndPoint } from "../../models/EndPoint";
import { Pagination, defaultPagination } from "../../models/Pagination";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

function AnimalSearch() {
  const [data, setData] = useState<AnimalsResponse | undefined>();

  const [text, setText] = useState("");

  const [sortBy, setSortBy] = useState("Name");

  const [loading, setLoading] = useState(false);

  const [buttons, setButtons] = useState({ prev: false, next: false });

  let pages: Pagination =
    data === undefined
      ? {
          pageCount: defaultPagination.pageCount,
          pageNumber: defaultPagination.pageNumber,
          pageSize: defaultPagination.pageSize,
        }
      : {
          pageCount: Math.ceil(data!.totalElements / data!.size),
          pageNumber: data!.page,
          pageSize: data!.size,
        };

  function getData() {
    console.log("From api call");
    console.log(pages);
    fetch(
      EndPoint.root +
        EndPoint.animals +
        "?page=" +
        pages.pageNumber +
        "&size=" +
        pages.pageSize +
        "&sort=" +
        sortBy +
        "&qp=" +
        text
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((actualData: AnimalsResponse) => {
        console.log(actualData);
        setData(actualData);
        checkButtons(
          actualData.page,
          Math.ceil(actualData.totalElements / actualData.size)
        );
        console.log(buttons);
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function checkButtons(pageNum: number, pageCount: number) {
    let buttons = {
      prev: false,
      next: false,
    };
    if (pageNum > 0) {
      buttons.prev = true;
    }
    if (pageNum + 1 < pageCount) {
      buttons.next = true;
    }
    setButtons(buttons);
  }

  const handlePageNumber = (page: number) => {
    // let newPageNumber = pagination.pageNumber + page;
    // setPagination({ ...pagination, pageNumber: newPageNumber });
    pages.pageNumber = pages.pageNumber + page;
  };

  const handlePageSize = (event: SelectChangeEvent) => {
    // let totalElements = data ? data.totalElements : 1;
    // setPagination({
    //   pageNumber: 0,
    //   pageSize: +event.target.value,
    //   pageCount: Math.ceil(totalElements / +event.target.value),
    // });
    pages.pageSize = +event.target.value;
    pages.pageNumber = 0;
  };

  function handleSearchChange(event: SelectChangeEvent) {
    setText(event.target.value as string);
  }

  function handleSortChange(event: SelectChangeEvent) {
    setSortBy(event.target.value as string);
  }

  function calculateAge(birthday: Date) {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  function calculateMonths(birthday: Date) {
    var today: Date = new Date();
    var monthDif = today.getMonth() - birthday.getMonth();
    return monthDif;
  }

  //   useEffect(() => {
  //     console.log("Pages");
  //     console.log(pages);
  //   }, [data]);
  return (
    <>
      <div>Animal search</div>
      <Grid container rowGap={2} spacing={0}>
        <Grid item xs={6}>
          {" "}
          <FormControl>
            <TextField
              id="outlined-basic"
              label="Search"
              variant="outlined"
              value={text}
              fullWidth
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleSearchChange(event)
              }
            />
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl>
            <InputLabel>Sort by</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Sort"
              defaultValue={"Name"}
              fullWidth
              onChange={handleSortChange}
            >
              <MenuItem value={"Name"}>Name</MenuItem>
              <MenuItem value={"Age"}>Age</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl style={{ minWidth: 120 }}>
            {" "}
            <InputLabel>Items per page</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Items per page"
              fullWidth
              defaultValue={defaultPagination.pageSize.toString()}
              onChange={handlePageSize}
            >
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={() => {
              setLoading(true);
              getData();
            }}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      {data && (
        <>
          <Typography>
            {pages.pageNumber + 1} out of {pages.pageCount}
          </Typography>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button
              disabled={!buttons.prev}
              onClick={() => {
                handlePageNumber(-1);
                getData();
              }}
            >
              <ArrowLeftIcon />
            </Button>
            <Button
              disabled={!buttons.next}
              onClick={() => {
                handlePageNumber(1);
                getData();
              }}
            >
              <ArrowRightIcon />
            </Button>
          </ButtonGroup>
        </>
      )}

      {loading && <Typography>Loading...</Typography>}
      {!loading && data && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Age</TableCell>
                <TableCell align="right">Species</TableCell>
                <TableCell align="right">Weight&nbsp;(kg)</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            {data && (
              <TableBody>
                {data?.data.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">
                      {`${calculateAge(
                        new Date(row.birth_date)
                      )} years ${calculateMonths(
                        new Date(row.birth_date)
                      )} months`}
                    </TableCell>
                    <TableCell align="right">
                      {row.breed.animalSpecies.species}
                    </TableCell>
                    <TableCell align="right">{row.weight_kg}</TableCell>
                    <TableCell align="right">{row.status.name}</TableCell>
                    <TableCell align="right">
                      <Button variant="contained" href={"/animal/" + row.id}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      )}
    </>
  );
}

export default AnimalSearch;

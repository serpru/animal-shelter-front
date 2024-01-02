import {
  Button,
  ButtonGroup,
  FormControl,
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
import { EndPoint } from "../../models/EndPoint";
import { Pagination, defaultPagination } from "../../models/Pagination";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { EmployeesResponse } from "../../models/EmployeesResponse";

function AnimalSearch() {
  const [data, setData] = useState<EmployeesResponse | undefined>();

  const [text, setText] = useState("");

  const [sortBy, setSortBy] = useState("First name");

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
        EndPoint.employees +
        "?page=" +
        pages.pageNumber +
        "&size=" +
        pages.pageSize +
        "&sort=" +
        sortBy +
        "&qp=" +
        text,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((actualData: EmployeesResponse) => {
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

  //   useEffect(() => {
  //     console.log("Pages");
  //     console.log(pages);
  //   }, [data]);
  return (
    <>
      <div>Employees database</div>
      <FormControl>
        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          value={text}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleSearchChange(event)
          }
        />
      </FormControl>
      <FormControl>
        <InputLabel>Sort by</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Sort by"
          defaultValue={"First name"}
          onChange={handleSortChange}
        >
          <MenuItem value={"First name"}>First name</MenuItem>
          <MenuItem value={"Last name"}>Last name</MenuItem>
          <MenuItem value={"Job type"}>Job type</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        {" "}
        <InputLabel>Items per page</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Items per page"
          defaultValue={defaultPagination.pageSize.toString()}
          onChange={handlePageSize}
        >
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        onClick={() => {
          setLoading(true);
          getData();
        }}
      >
        Search
      </Button>
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

      {loading && <Typography>Ładowanie wyników wyszukiwania...</Typography>}
      {!loading && data && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">First name</TableCell>
                <TableCell align="left">Last name</TableCell>
                <TableCell align="left">Job type</TableCell>
              </TableRow>
            </TableHead>
            {data && (
              <TableBody>
                {data?.data.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.first_name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.last_name}
                    </TableCell>
                    <TableCell align="left">
                      {row.job_type.description}
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

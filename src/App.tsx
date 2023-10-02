import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { theme } from "./Theme";
import { ThemeProvider } from "@mui/material";
import AnimalSearch from "./components/Animal/AnimalSearch";
import AnimalAdd from "./components/Animal/AnimalAdd";

import { LocalizationProvider, plPL } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import EmployeeEdit from "./components/Employee/EmployeeEdit";
import VisitAdd from "./components/Visit/VisitAdd";
import AdoptionAdd from "./components/Adoption/AdoptionAdd";
import AdoptionView from "./components/Adoption/AdoptionView";
import AnimalView from "./components/Animal/AnimalView";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("pl");

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <LocalizationProvider
          localeText={
            plPL.components.MuiLocalizationProvider.defaultProps.localeText
          }
          dateAdapter={AdapterDayjs}
        >
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <div>Test</div>
                  </>
                }
              />
              <Route
                path="/adoption-add"
                element={
                  <>
                    <AdoptionAdd mode="add" timezone={timezone}></AdoptionAdd>
                  </>
                }
              />
              <Route
                path="/adoption/:adoption_id"
                element={
                  <>
                    <AdoptionView></AdoptionView>
                  </>
                }
              />
              <Route
                path="/animal-add"
                element={
                  <>
                    <AnimalAdd mode="add"></AnimalAdd>
                  </>
                }
              />
              <Route
                path="/animal/:animal_id"
                element={
                  <>
                    <AnimalView></AnimalView>
                  </>
                }
              />
              <Route
                path="/animal-search"
                element={
                  <>
                    <AnimalSearch></AnimalSearch>
                  </>
                }
              />
              <Route
                path="/employee-add"
                element={
                  <>
                    <EmployeeEdit mode="add"></EmployeeEdit>
                  </>
                }
              />
              <Route
                path="/employee/:employee_id"
                element={
                  <>
                    <EmployeeEdit mode="edit"></EmployeeEdit>
                  </>
                }
              />
              <Route
                path="/visit-add"
                element={
                  <>
                    <VisitAdd mode={"add"} timezone={timezone}></VisitAdd>
                  </>
                }
              />
              <Route
                path="/visit/:visit_id"
                element={
                  <>
                    <VisitAdd mode={"edit"} timezone={timezone}></VisitAdd>
                  </>
                }
              />
            </Routes>
          </BrowserRouter>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  );
}

export default App;

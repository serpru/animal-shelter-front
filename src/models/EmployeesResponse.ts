import { Employee } from "./Employee/Employee";

export type EmployeesResponse = {
    page: number,
    size: number,
    totalElements: number,
    data: Employee[],
}
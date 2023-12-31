export type EmployeeRequest = {
    id?: number,
    first_name: string,
    last_name: string,
    phone_number: string,
    email: string,
    salary: number,
    job_type_id: number,
    start_date: Date,
    birth_date: Date
}
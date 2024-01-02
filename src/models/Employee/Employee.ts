import { JobType } from "./JobType";

export type Employee = {
    first_name: string,
    last_name: string,
    phone_number: string,
    email: string,
    job_type: JobType,
    start_date: Date,
    birth_date: Date,
    id: number,
}
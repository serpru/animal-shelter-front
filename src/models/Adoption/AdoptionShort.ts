import { AdoptionStatus } from "./AdoptionStatus"

export type AdoptionShort = {
    id: number,
    adoptee_name: string,
    status: AdoptionStatus,
    start_date: Date,
    end_date: Date,
    animal_name: string,
    note: string
}
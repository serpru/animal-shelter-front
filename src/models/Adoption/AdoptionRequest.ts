export type AdoptionRequest = {
    id?: number,
    adoptee_id: number,
    employee_id: number,
    adoption_status_id: number,
    start_date: Date,
    end_date?: Date,
    animal_id: number,
    note?: string,
}
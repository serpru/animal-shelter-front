import { Dayjs } from "dayjs"

export type AnimalRequest = {
    name?: string,
    birth_date?: Date,
    aggression_animals_id?: number
    aggression_humans_id?: number,
    note?: string,
    breed_id?: number,
    weight_kg?: number,
    need_medication?: boolean,
    status_id?: number,
    origin_id?: number,
    arrive_date: Date | null,
    adoption_date?: Date,
    id?: number,
}
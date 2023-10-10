import { VisitStatusDb } from "./VisitStatusDb";

export type VisitDb = {
    id: number,
    date: Date,
    adoption_id: number,
    visit_status: VisitStatusDb,
    note: string
}
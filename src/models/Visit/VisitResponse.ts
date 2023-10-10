import { VisitStatusDb } from "../Db/VisitStatusDb"

export type VisitResponse = {
    id: number,
    date: Date,
    adoption_id: number,
    visit_status: VisitStatusDb,
    note: string
}
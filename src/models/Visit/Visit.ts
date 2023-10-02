import { VisitStatus } from "./VisitStatus";

export type Visit = {
    id: number,
    date: Date,
    adoption_id: number,
    visit_status: VisitStatus,
}
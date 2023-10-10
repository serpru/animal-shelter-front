import { AdoptionShort } from "../Adoption/AdoptionShort";
import { VisitStatus } from "../Db/VisitStatusDb";

export type VisitForm = {
    adoptions: AdoptionShort[],
    statuses: VisitStatus[]
}
import { AdoptionShort } from "../Adoption/AdoptionShort";
import { VisitStatus } from "./VisitStatus";

export type VisitForm = {
    adoptions: AdoptionShort[],
    statuses: VisitStatus[]
}
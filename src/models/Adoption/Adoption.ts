import { Adoptee } from "../Adoptee/Adoptee";
import { AnimalDb } from "../Db/AnimalDb";
import { Employee } from "../Employee/Employee";
import { VisitDb } from "../Db/VisitDb";
import { AdoptionStatus } from "./AdoptionStatus";

export type Adoption = {
    id: number,
    adoptee: Adoptee,
    employee: Employee,
    adoption_status: AdoptionStatus,
    start_date: Date,
    end_date?: Date,
    animal: AnimalDb,
    note: string,
    visits: VisitDb[]
}
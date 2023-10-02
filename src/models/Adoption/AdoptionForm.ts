import { Adoptee } from "../Adoptee/Adoptee"
import { AnimalDb } from "../Db/AnimalDb"
import { Employee } from "../Employee/Employee"
import { AdoptionStatus } from "./AdoptionStatus"

export type AdoptionForm = {
    adoptees: Adoptee[],
    employees: Employee[],
    statuses: AdoptionStatus[]
    animals: AnimalDb[],
}
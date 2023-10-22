import { AggressionDb } from "./AggressionDb"
import { AnimalSpeciesDb } from "./AnimalSpeciesDb"
import { BreedDb } from "./BreedDb"
import { AnimalStatusDb } from "./AnimalStatusDb"
import { OriginDb } from "./OriginDb"


export type AnimalDb = {
    name: string,
    birth_date: Date,
    aggression_animals: AggressionDb
    aggression_humans: AggressionDb,
    note: string,
    breed: BreedDb,
    weight_kg: number,
    need_medication: boolean,
    origin: OriginDb,
    status: AnimalStatusDb,
    arrive_date: Date,
    adoption_date?: Date,
    id: number,
}
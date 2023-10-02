import { AnimalSpeciesDb } from "./AnimalSpeciesDb"

export type BreedDb = {
    name: string,
    animalSpecies: AnimalSpeciesDb,
    id: number
}
import { AdoptionShort } from "../Adoption/AdoptionShort"
import { AnimalDb } from "../Db/AnimalDb"

export type AnimalResponse = {
    animal: AnimalDb,
    adoptions: AdoptionShort[],
}
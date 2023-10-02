import { AggressionDb } from "./Db/AggressionDb"
import { BreedDb } from "./Db/BreedDb"
import { OriginDb } from "./Db/OriginDb"
import { AnimalStatusDb } from "./Db/AnimalStatusDb"

export type AnimalAddForm = {
    aggressions: AggressionDb[],
    breeds: BreedDb[],
    origins: OriginDb[],
    statuses: AnimalStatusDb[]
}
import { AnimalDb } from "./Db/AnimalDb";

export type AnimalsResponse = {
    page: number,
    size: number,
    totalElements: number,
    data: AnimalDb[],
}
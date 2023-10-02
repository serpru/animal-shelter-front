import { Animal } from "./Db/AnimalDb";

export type AnimalsResponse = {
    page: number,
    size: number,
    totalElements: number,
    data: Animal[],
}
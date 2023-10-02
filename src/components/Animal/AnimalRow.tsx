import React from "react";
import { Animal } from "../../models/Db/AnimalDb";

interface Props {
  animal: Animal;
}

function AnimalRow({ animal }: Props) {
  return <div>Piesek!</div>;
}

export default AnimalRow;

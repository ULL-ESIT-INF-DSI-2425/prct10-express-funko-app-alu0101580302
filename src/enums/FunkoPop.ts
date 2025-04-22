import { FunkoTypes } from "./FunkoTypes.js";
import { Genre } from "./Genre.js";

export type FunkoPop = {
    id: number;
    name: string;
    description: string;
    type: FunkoTypes;
    genre: Genre;
    franchise: string;
    number: number;
    exclusive: boolean;
    properties: string;
    price: number
}
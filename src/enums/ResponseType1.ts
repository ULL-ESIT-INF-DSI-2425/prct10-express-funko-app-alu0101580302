import { Funko } from "../classes/Funko.js";

/**
 * Tipo ResponseType. Representa los tipos de respuestas al cliente
 */
export type ResponseType = {
    success: boolean,
    funkos?: Funko[],
    message?: string
}
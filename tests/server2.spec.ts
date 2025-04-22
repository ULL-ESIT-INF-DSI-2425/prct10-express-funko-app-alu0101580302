import { describe, test, expect } from 'vitest';
import { addFunko, updateFunko, removeFunko, listFunko, readFunko } from '../src/server2';
import { FunkoTypes } from '../src/enums/FunkoTypes';
import { Genre } from '../src/enums/Genre';
import { FunkoPop } from '../src/enums/FunkoPop';

describe('Pruebas de addFunko', () => {
    const funko: FunkoPop = {
        id: 1,
        name: "Sonic",
        description: "Figura",
        type: "Pop!" as FunkoTypes,
        genre: "Videojuegos" as Genre,
        franchise: "Sonic",
        number: 1,
        exclusive: false,
        properties: "",
        price: 10
      };

    test('Se añade correctamente', () => {
        return addFunko('maya', funko).then((data) => {
            expect(data).toStrictEqual({success: true, message: `¡Nuevo Funko añadido a la colección de maya!`});
        })
    });

    test('Se produce un error', () => {
        return addFunko('maya', funko).catch((err) => {
            expect(err).toStrictEqual({success: false, message: `Ya existe un Funko con el ID 1 en la colección de maya.`});
        })
    });
});
import { describe, test, expect } from 'vitest';
import { findSpells } from '../src/mod/spells';

describe('Pruebas de findSpells', () => {
    test('Prueba correcta con name', () => {
        return findSpells({ name: 'Opening Charm' }).then((spells) => {
            expect(spells).to.deep.equal(
                [
                    {
                        "id": "fbd3cb46-c174-4843-a07e-fd83545dce58",
                        "name": "Opening Charm",
                        "incantation": "Aberto",
                        "effect": "Opens doors",
                        "canBeVerbal": true,
                        "type": "Charm",
                        "light": "Blue",
                        "creator": null
                    }
                ]
            );
        });
    });

    test('Prueba correcta con type', () => {
        return findSpells({ type: 'None' }).then((spells) => {
            expect(spells).to.deep.equal(
                [
                    {
                        "id": "c44068e0-b379-4448-bc19-2d69818e3357",
                        "name": "Placement Charm",
                        "incantation": null,
                        "effect": "Places object on target",
                        "canBeVerbal": null,
                        "type": "None",
                        "light": "None",
                        "creator": null
                    }
                ]
            );
        });
    });

    test('Prueba correcta con incantation', () => {
        return findSpells({ incantation: 'Aberto' }).then((spells) => {
            expect(spells).to.deep.equal(
                [
                    {
                        "id": "fbd3cb46-c174-4843-a07e-fd83545dce58",
                        "name": "Opening Charm",
                        "incantation": "Aberto",
                        "effect": "Opens doors",
                        "canBeVerbal": true,
                        "type": "Charm",
                        "light": "Blue",
                        "creator": null
                    }
                ]
            );
        });
    });

    test('Prueba correcta con name y type', () => {
        return findSpells({ name: 'Opening Charm', type: 'Charm' }).then((spells) => {
            expect(spells).to.deep.equal(
                [
                    {
                        "id": "fbd3cb46-c174-4843-a07e-fd83545dce58",
                        "name": "Opening Charm",
                        "incantation": "Aberto",
                        "effect": "Opens doors",
                        "canBeVerbal": true,
                        "type": "Charm",
                        "light": "Blue",
                        "creator": null
                    }
                ]
            );
        });
    });

    test('Prueba correcta con name e incatation', () => {
        return findSpells({ name: 'Opening Charm', incantation: 'Aberto' }).then((spells) => {
            expect(spells).to.deep.equal(
                [
                    {
                        "id": "fbd3cb46-c174-4843-a07e-fd83545dce58",
                        "name": "Opening Charm",
                        "incantation": "Aberto",
                        "effect": "Opens doors",
                        "canBeVerbal": true,
                        "type": "Charm",
                        "light": "Blue",
                        "creator": null
                    }
                ]
            );
        });
    });

    test('Prueba correcta con type e incantation', () => {
        return findSpells({ type: 'Charm', incantation: 'Alarte Ascendare' }).then((spells) => {
            expect(spells).to.deep.equal(
                [
                    {
                        "id": "ab3a8dfe-1e56-4706-a20d-26afee011ed7",
                        "name": "Alarte Ascendare",
                        "incantation": "Alarte Ascendare",
                        "effect": "Rockets target upward",
                        "canBeVerbal": true,
                        "type": "Charm",
                        "light": "Red",
                        "creator": null
                      }
                ]
            );
        });
    });

    test('Prueba correcta con todos los campos', () => {
        return findSpells({ name: 'Alarte Ascendare', type: 'Charm', incantation: 'Alarte Ascendare' }).then((spells) => {
            expect(spells).to.deep.equal(
                [
                    {
                        "id": "ab3a8dfe-1e56-4706-a20d-26afee011ed7",
                        "name": "Alarte Ascendare",
                        "incantation": "Alarte Ascendare",
                        "effect": "Rockets target upward",
                        "canBeVerbal": true,
                        "type": "Charm",
                        "light": "Red",
                        "creator": null
                      }
                ]
            );
        });
    });

    test('No devuelve nada', () => {
        return findSpells({ name: 'Alarte Ascendare', type: 'AAA', incantation: 'Alarte Ascendare' }).catch((error) => {
            expect(error).to.deep.equal('No hay ningún hechizo con ese campo.');
        });
    })
});
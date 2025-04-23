import request from 'request';

type RequestType = {
    name?: string,
    type?: string,
    incantation?: string
}

type SpellType = {
    id: string,
    name: string,
    incantation: string,
    effect: string,
    canBeVerbal: boolean,
    type: string,
    light: string,
    creator: string
}

export const findSpells = (filter: RequestType) => {
    return new Promise<SpellType[]> ((resolve, reject) => {
        let url: string = 'https://wizard-world-api.herokuapp.com/Spells';
        
        let query: string = '';
        let name: boolean = false;
        let type: boolean = false;

        if (filter.name) {
            query += `?name=${filter.name}`;
            name = true;
        }
        if (filter.type) {
            if (name) {
                query += `&type=${filter.type}`
            } else {
                query += `?type=${filter.type}`
            }

            type = true;
        }
        if (filter.incantation) {
            if (name || type) {
                query += `&incantation=${filter.incantation}`
            } else {
                query += `?incantation=${filter.incantation}`
            }
        }

        url += query;

        console.log(query)

        request({ url: url, json: true }, (error: Error, response) => {
            if (error) {
                reject('Hubo un problema al enviar la petición.');
            } else {
                if (response.body.length === 0) {
                    reject('No hay ningún hechizo con ese campo.');
                }

                resolve(response.body as unknown as SpellType[]);
            }
        });
    });
        
};

findSpells({ incantation: 'Aberto' })
    .then((rslt) => {
        console.log(rslt);
    })
    .catch((error) => {
        console.log(error);
    })

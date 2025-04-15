import chalk from 'chalk';
import net, { createConnection } from 'net';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Funko } from './classes/Funko.js';
import { FunkoTypes } from './enums/FunkoTypes.js';
import { Genre } from './enums/Genre.js';
import { RequestType } from './enums/RequestType.js';

const client: any = net.connect({port: 60300});

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs(hideBin(process.argv))
    .command('add', 'Añade un Funko', {
        user: {
            description: 'Usuario',
            type: 'string',
            demandOption: true
        },
        id: {
            description: 'ID del Funko',
            type: 'number',
            demandOption: true
        },
        name: {
            description: 'Nombre del Funko',
            type: 'string',
            demandOption: true
        },
        description: {
            description: 'Descripción del Funko',
            type: 'string',
            demandOption: true
        },
        type: {
            description: 'Tipo de Funko',
            type: 'string',
            demandOption: true
        },
        genre: {
            description: 'Género del medio de origen del personaje del Funko',
            type: 'string',
            demandOption: true
        },
        franchise: {
            description: 'Franquicia del personaje del Funko',
            type: 'string',
            demandOption: true
        },
        number: {
            description: 'Número del Funko',
            type: 'number',
            demandOption: true
        },
        exclusive: {
            description: 'Exclusividad del Funko',
            type: 'boolean',
            demandOption: true
        },
        properties: {
            description: 'Características especiales del Funko',
            type: 'string',
            demandOption: true
        },
        price: {
            description: 'Precio del Funko',
            type: 'number',
            demandOption: true
        }
    }, (argv) => {
        const funko: Funko = new Funko(argv.id, argv.name, argv.description, argv.type as FunkoTypes, argv.genre as Genre, argv.franchise, argv.number, argv.exclusive, argv.properties, argv.price);
        const request: RequestType = { type: 'add', user: argv.user, funkos: [funko] };
        client.write(JSON.stringify(request));
    })
    .help()
    .argv;

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs(hideBin(process.argv))
    .command('update', 'Modifica un Funko', {
        user: {
            description: 'Usuario',
            type: 'string',
            demandOption: true
        },
        id: {
            description: 'ID del Funko',
            type: 'number',
            demandOption: true
        },
        name: {
            description: 'Nombre del Funko',
            type: 'string',
            demandOption: false
        },
        description: {
            description: 'Descripción del Funko',
            type: 'string',
            demandOption: false
        },
        type: {
            description: 'Tipo de Funko',
            type: 'string',
            demandOption: false
        },
        genre: {
            description: 'Género del medio de origen del personaje del Funko',
            type: 'string',
            demandOption: false
        },
        franchise: {
            description: 'Franquicia del personaje del Funko',
            type: 'string',
            demandOption: false
        },
        number: {
            description: 'Número del Funko',
            type: 'number',
            demandOption: false
        },
        exclusive: {
            description: 'Exclusividad del Funko',
            type: 'boolean',
            demandOption: false
        },
        properties: {
            description: 'Características especiales del Funko',
            type: 'string',
            demandOption: false
        },
        price: {
            description: 'Precio del Funko',
            type: 'number',
            demandOption: false
        }
    }, (argv) => {
        const request: RequestType = { type: 'update', user: argv.user, args: argv };
        client.write(JSON.stringify(request));
    })
    .help()
    .argv;

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs(hideBin(process.argv))
    .command('remove', 'Elimina un Funko', {
        user: {
            description: 'Usuario',
            type: 'string',
            demandOption: true
        },
        id: {
            description: 'ID del Funko',
            type: 'number',
            demandOption: true
        }
    }, (argv) => {
        const request: RequestType = { type: 'remove', user: argv.user, args: argv };
        client.write(JSON.stringify(request));
    })
    .help()
    .argv;

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs(hideBin(process.argv))
    .command('list', 'Muestra la colección de Funkos', {
        user: {
            description: 'Usuario',
            type: 'string',
            demandOption: true
        }
    }, (argv) => {
        const request: RequestType = { type: 'list', user: argv.user};
        client.write(JSON.stringify(request));
    })
    .help()
    .argv;

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs(hideBin(process.argv))
    .command('read', 'Muestra la información de un Funko', {
        user: {
            description: 'Usuario',
            type: 'string',
            demandOption: true
        },
        id: {
            description: 'ID del Funko',
            type: 'number',
            demandOption: true
        }
    }, (argv) => {
        const request: RequestType = { type: 'read', user: argv.user, args: argv };
        client.write(JSON.stringify(request));
    })
    .help()
    .argv;

let wholeData = '';

client.on('data', (chunk: any) => {
  wholeData += chunk;
});

client.on('end', () => {
  const message = JSON.parse(wholeData);

  if (message.type === 'error') {
    console.log(chalk.red(message.message));
  } else {
    console.log(chalk.green(message.message));
  }

  client.end();
})
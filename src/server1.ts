import net from 'net';
import fs from 'fs';
import { Funko } from './classes/Funko.js';
import { FunkoTypes } from './enums/FunkoTypes.js';
import { Genre } from './enums/Genre.js';
import chalk from 'chalk';
import { RequestType } from './enums/RequestType.js';
import { ResponseType } from './enums/ResponseType.js';

  net.createServer({ allowHalfOpen: true }, (connection) => {
    console.log('A client has connected.');

    let wholeData = '';
    let message;

    connection.on('data', (chunk) => {
        wholeData += chunk;

            try {
                message = JSON.parse(wholeData);
                wholeData = '';
                connection.emit('request', message);
            } catch {
                const error: ResponseType = { type: 'error', success: false, message: 'Error al leer la petición.' }
                connection.write(JSON.stringify(error));
            }
    });

    connection.on('request', (message: RequestType) => {
        try {
            if (message.type === 'add') {
                addFunko(message, (err, rslt) => {
                    if (err) {
                        connection.write(JSON.stringify(err));
                    } else if (rslt) {
                        connection.write(JSON.stringify(rslt));
                    }

                    connection.end();
                });
            } else if (message.type === 'update') {
                updateFunko(message, (err, rslt) => {
                    if (err) {
                        connection.write(JSON.stringify(err));
                    } else if (rslt) {
                        connection.write(JSON.stringify(rslt));
                    }

                    connection.end();
                });
            } else if (message.type === 'remove') {
                removeFunko(message, (err, rslt) => {
                    if (err) {
                        connection.write(JSON.stringify(err));
                    } else if (rslt) {
                        connection.write(JSON.stringify(rslt));
                    }

                    connection.end();
                });
            } else if (message.type === 'list') {
                listFunko(message, (err, rslt) => {
                    if (err) {
                        connection.write(JSON.stringify(err));
                    } else if (rslt) {
                        connection.write(JSON.stringify(rslt));
                    }

                    connection.end();
                });
            } else if (message.type === 'read') {
                readFunko(message, (err, rslt) => {
                    if (err) {
                        connection.write(JSON.stringify(err));
                    } else if (rslt) {
                        connection.write(JSON.stringify(rslt));
                    }

                    connection.end();
                });
            }
        } catch {
            console.log(chalk.red("El Funko introducido no es correcto."));
            return;
        }
    });

    connection.on('end', () => {

    });

    connection.on('close', () => {
      console.log('A client has disconnected.');
    });
  }).listen(60300, () => {
    console.log('Waiting for clients to connect.');
  });

export const openFile = (
    user: string,
    callback: (
        err: ResponseType | undefined,
        data: any
    ) => void
) => {
    fs.mkdir(`src/users/${user}`, { recursive: true }, (err) => {
        let error: ResponseType;
        if (err) { 
            error = { type: 'error', success: false, message: err.message };
            callback(error, undefined);
        } else {
            fs.open(`src/users/${user}/funkos.json`, (err) => {
                if (err) {
                    error = { type: 'error', success: false, message: err.message };
                    callback(error, undefined);
                }
            });
            
            fs.readFile(`src/users/${user}/funkos.json`, 'utf8', (err, data) => {
                let funkos = [];
        
                if (!err && data.trim()) {
                    try {
                        funkos = JSON.parse(data);
                        if (!Array.isArray(funkos)) funkos = [];
                        callback(undefined, funkos);
                    } catch (parseError) {
                        error = { type: 'error', success: false, message: 'Error al leer el JSON.' }
                        callback(error, undefined);
                    }
                }
            });
        }
    });
}

export const addFunko = (
    request: RequestType, 
    callback: (
        err: ResponseType | undefined, 
        data: ResponseType | undefined,
    ) => void
) => {
    openFile(request.user, (error, funkos) => {
        if (error) {
            callback(error, undefined);
        } else if (funkos) {
            const idExists = funkos.some((funk: any) => funk._id === request.funkos![0].id);
                
            if (idExists) {
                callback({type: 'error', success: false, message: `Ya existe un Funko con el ID ${request.funkos![0].id} en la colección de ${request.user}.`}, undefined);
            }
                    
            funkos.push(request.funkos![0]);
                    
            fs.writeFile(`src/users/${request.user}/funkos.json`, JSON.stringify(funkos, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    callback({type: 'error', success: false, message: "Error al escribir en el archivo."}, undefined);
                } else {
                    callback(undefined, {type: 'add', success: true, message: `¡Nuevo Funko añadido a la colección de ${request.user}!`});
                }
            });
        }
    });
}

export const updateFunko = (
    request: RequestType,
    callback: (
        error: ResponseType | undefined,
        data: ResponseType | undefined
    ) => void
) => {
    openFile(request.user, (error, funkos) => {
        if (error) {
            callback(error, undefined);
        } else if (funkos) {
            const index = funkos.findIndex((funk: any) => funk._id === request.args.id);
                
            if (index === -1) {
                callback({type: 'error', success: false, message: `No existe un Funko con el ID ${request.args.id} en la colección de ${request.args.user}.`}, undefined);
            } else {
                try {
                    if (request.args.name) {
                        if (request.args.name === "") {
                            throw new Error("Nombre no válido.");
                        }
        
                        funkos[index]._name = request.args.name;
                    }
                    if (request.args.description) {
                        if (request.args.description === "") {
                            throw new Error("Descripción no válida.");
                        }
        
                        funkos[index]._description = request.args.description;
                    }
                    if (request.args.type) {
                        if (request.args.type !== FunkoTypes.Pop && request.args.type !== FunkoTypes.PopRides && 
                            request.args.type !== FunkoTypes.VynilGold && request.args.type !== FunkoTypes.VynilSoda) {
                            throw new Error("Tipo no válido.");
                        }
                                        
                        funkos[index]._type = request.args.type as FunkoTypes;
                    }
                    if (request.args.genre) {
                        if (request.args.genre !== Genre.Animation && request.args.genre !== Genre.Videogames && request.args.genre !== Genre.Music &&
                            request.args.genre !== Genre.Sports && request.args.genre !== Genre.Anime && request.args.genre !== Genre.MoviesTV) {
                            throw new Error("Género no válido.");
                        }
        
                        funkos[index]._genre = request.args.genre as Genre;
                    }
                    if (request.args.franchise) {
                        if (request.args.franchise === "") {
                            throw new Error("Franquicia no válido.");
                        }
        
                        funkos[index]._franchise = request.args.franchise;
                    }
                    if (request.args.number) {
                        if (request.args.number <= 0) {
                            throw new Error("Número no válido.");
                        }
        
                        funkos[index]._number = request.args.number;
                    }
                    if (request.args.exclusive) {
                        funkos[index]._exclusive = request.args.exclusive;
                    }
                    if (request.args.properties) {
                        funkos[index]._properties = request.args.properties;
                    }
                    if (request.args.price) {
                        if (request.args.price <= 0) {
                            throw new Error("Precio no válido.");
                        }
        
                        funkos[index]._price = request.args.price;
                    }
                } catch {
                    callback({type: 'error', success: false, message: 'Error en uno de los argumentos.'}, undefined);
                }

                fs.writeFile(`src/users/${request.user}/funkos.json`, JSON.stringify(funkos, null, 2), 'utf8', (writeErr) => {
                    if (writeErr) {
                        callback({type: 'error', success: false, message: "Error al escribir en el archivo."}, undefined);
                    } else {
                        callback(undefined, {type: 'update', success: false, message: `¡Modificado el Funko de id ${request.args.id} a la colección de ${request.args.user}!`});
                    }
                });
            }    
        }
    });
}

export const removeFunko = (
    request: RequestType,
    callback: (
        error: ResponseType | undefined,
        data: ResponseType | undefined
    ) => void
) => {
    openFile(request.user, (error, funkos) => {
        if (error) {
            callback(error, undefined);
        } else if (funkos) {
            const index = funkos.findIndex((funk: any) => funk._id === request.funkos![0].id);
            
            if (index === -1) {
                callback({type: 'error', success: false, message: `No existe un Funko con el ID ${request.funkos![0].id} en la colección de ${request.funkos![0].id}.`}, undefined);
                
            } else {
                funkos.splice(index, 1);

                fs.writeFile(`src/users/${request.user}/funkos.json`, JSON.stringify(funkos, null, 2), 'utf8', (writeErr) => {
                    if (writeErr) {
                        callback({type: 'error', success: false, message: "Error al escribir en el archivo."}, undefined);
                    } else {
                        callback(undefined, {type: 'remove', success: false, message: `¡Eliminado el Funko de ID ${request.funkos![0].id} de la colección de ${request.user}!`});
                    }
                });
            }
        }
    });
}

export const listFunko = (
    request: RequestType,
    callback: (
        error: ResponseType | undefined,
        data: ResponseType | undefined
    ) => void
) => {
    openFile(request.user, (error, funkos) => {
        if (error) {
            callback(error, undefined);
        } else if (funkos) {
            let str: string = '';
            str += "-------------------------------------------------------\n";
            funkos.forEach((funko: any) => {
                str += printFunkos(funko);
            });
            callback(undefined, {type: 'list', success: true, message: str});
        }
    });
}

export const readFunko = (
    request: RequestType,
    callback: (
        error: ResponseType | undefined,
        data: ResponseType | undefined
    ) => void
) => {
    openFile(request.user, (error, funkos) => {
        if (error) {
            callback(error, undefined);
        } else if (funkos) {
            const index = funkos.findIndex((funk: any) => funk._id === request.funkos![0].id);
            
            if (index === -1) {
                callback({type: 'error', success: false, message: `No existe un Funko con el ID ${request.funkos![0].id} en la colección de ${request.user}.`}, undefined);
            } else {
                let str: string = '';
                str += "-------------------------------------------------------\n";
                str += printFunkos(funkos[index]);
                callback(undefined, {type: 'read', success: true, message: str});
            }
        }
    });
}

/**
 * Imprime la información de un Funko
 * @param funko - Funko a imprimir
 * @returns La información del Funko
 */
function printFunkos(funko: any): string {
    let rslt: string = `ID: ${funko._id}\n`;
    rslt += `Nombre: ${funko._name}\n`;
    rslt += `Descripción: ${funko._description}\n`;
    rslt += `Tipo: ${funko._type}\n`;
    rslt += `Género: ${funko._genre}\n`;
    rslt += `Franquicia: ${funko._franchise}\n`;
    rslt += `Número: ${funko._number}\n`;
    rslt += `Exclusividad: ${funko._exclusive}\n`;
    rslt += `Características: ${funko._properties}\n`;
    rslt += `Precio: ${funko._price}\n`;
    rslt += '-------------------------------------------------------\n';

    return rslt;
}

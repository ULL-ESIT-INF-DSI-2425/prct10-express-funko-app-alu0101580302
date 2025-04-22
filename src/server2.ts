import fs from 'fs';
import { FunkoTypes } from './enums/FunkoTypes.js';
import { Genre } from './enums/Genre.js';
import { ResponseType } from './enums/ResponseType1.js';
import  express  from 'express';
import { FunkoPop } from './enums/FunkoPop.js';
import _ from 'lodash';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

app.get('/funkos', (req, res) => {
    if (req.query.user) {
        listFunko(req.query.user as string)
            .then((result) => {
                res.send(result.message);
            })
            .catch((error) => {
                res.send(error);
            })
    } else {
        const error: ResponseType = {success: false, message: 'No se introdujo usuario'};
        res.send(error);
    }
});

app.get('/funkos/read', (req, res) => {
    if (req.query.user && req.query.id) {
        readFunko(req.query.user as string, req.query.id as unknown as number)
            .then((result) => {
                res.send(result.message);
            })
            .catch((error) => {
                res.send(error);
            })
    } else {
        const error: ResponseType = {success: false, message: 'No se introdujo usuario'};
        res.send(error);
    }
});

app.post('/funkos', (req, res) => {
    if (req.query.user) {
        if (req.body) {
            addFunko(req.query.user as string, req.body)
                .then((result) => {
                    res.send(result);
                })
                .catch((error) => {
                    res.send(error);
                });
        } else {
            const error: ResponseType = {success: false, message: 'No se introdujo el Funko'};
            res.send(error);
        }
    } else {
        const error: ResponseType = {success: false, message: 'No se introdujo usuario'};
        res.send(error);
    }
});

app.delete('/funkos', (req, res) => {
    if (req.query.user && req.query.id) {
        removeFunko(req.query.user as string, req.query.id as unknown as number)
            .then((result) => {
                res.send(result.message);
            })
            .catch((error) => {
                res.send(error);
            })
    } else {
        const error: ResponseType = {success: false, message: 'No se introdujo usuario o ID del Funko'};
        res.send(error);
    }
});

app.patch('/funkos', (req, res) => {
    if (req.query.user) {
        if (req.body) {
            updateFunko(req.query.user as string, req.body)
                .then((result) => {
                    res.send(result);
                })
                .catch((error) => {
                    res.send(error);
                });
        } else {
            const error: ResponseType = {success: false, message: 'No se introdujo el Funko'};
            res.send(error);
        }
    } else {
        const error: ResponseType = {success: false, message: 'No se introdujo usuario'};
        res.send(error);
    }
});

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});

export const openFile = (user: string) => {
    return new Promise<any>((resolve, reject) => {
        fs.mkdir(`src/users/${user}`, { recursive: true }, (err) => {
            let error: ResponseType;
            if (err) { 
                error = { success: false, message: err.message };
                reject(error);
            } else {
                fs.open(`src/users/${user}/funkos.json`, (err) => {
                    if (err) {
                        error = { success: false, message: err.message };
                        reject(error);
                    }
                });
                
                fs.readFile(`src/users/${user}/funkos.json`, 'utf8', (err, data) => {
                    let funkos = [];
            
                    if (!err && data.trim()) {
                        console.log('a')
                        try {
                            funkos = JSON.parse(data);
                            if (!Array.isArray(funkos)) funkos = [];
                            
                            resolve(funkos);
                        } catch (parseError) {
                            error = { success: false, message: 'Error al leer el JSON.' }
                            reject(error);
                        }
                    }
                });
            }
        });
    })
}

export const addFunko = (user: string, funko: FunkoPop) => {
    return new Promise<ResponseType> ((resolve, reject) => {
        openFile(user)
            .then((funkos) => {
                const idExists = funkos.some((funk: any) => Number(funk.id) === Number(funko.id));
                    
                if (idExists) {
                    reject({success: false, message: `Ya existe un Funko con el ID ${funko.id} en la colección de ${user}.`});
                    return;
                }
                
                        
                funkos.push(funko);
                        
                fs.writeFile(`src/users/${user}/funkos.json`, JSON.stringify(funkos, null, 2), 'utf8', (writeErr) => {
                    if (writeErr) {
                        reject({type: 'error', success: false, message: "Error al escribir en el archivo."});
                    } else {
                        resolve({success: true, message: `¡Nuevo Funko añadido a la colección de ${user}!`});
                    }
                });
            })
            .catch((error) => {
                reject(error);
            })
        });
    }

export const updateFunko = (user: string, args: any) => {
    return new Promise<ResponseType> ((resolve, reject) => {
        openFile(user)
            .then((funkos) => {
                const index = funkos.findIndex((funk: any) => Number(funk.id) === Number(args.id));
                    
                if (index === -1) {
                    reject({success: false, message: `No existe un Funko con el ID ${args.id} en la colección de ${args.user}.`});
                } else {
                    try {
                        if (args.name) {
                            if (args.name === "") {
                                throw new Error("Nombre no válido.");
                            }
            
                            funkos[index].name = args.name;
                        }
                        if (args.description) {
                            if (args.description === "") {
                                throw new Error("Descripción no válida.");
                            }
            
                            funkos[index].description = args.description;
                        }
                        if (args.type) {
                            if (args.type !== FunkoTypes.Pop && args.type !== FunkoTypes.PopRides && 
                                args.type !== FunkoTypes.VynilGold && args.type !== FunkoTypes.VynilSoda) {
                                throw new Error("Tipo no válido.");
                            }
                                            
                            funkos[index].type = args.type as FunkoTypes;
                        }
                        if (args.genre) {
                            if (args.genre !== Genre.Animation && args.genre !== Genre.Videogames && args.genre !== Genre.Music &&
                                args.genre !== Genre.Sports && args.genre !== Genre.Anime && args.genre !== Genre.MoviesTV) {
                                throw new Error("Género no válido.");
                            }
            
                            funkos[index].genre = args.genre as Genre;
                        }
                        if (args.franchise) {
                            if (args.franchise === "") {
                                throw new Error("Franquicia no válido.");
                            }
            
                            funkos[index].franchise = args.franchise;
                        }
                        if (args.number) {
                            if (args.number <= 0) {
                                throw new Error("Número no válido.");
                            }
            
                            funkos[index].number = args.number;
                        }
                        if (args.exclusive) {
                            funkos[index].exclusive = args.exclusive;
                        }
                        if (args.properties) {
                            funkos[index].properties = args.properties;
                        }
                        if (args.price) {
                            if (args.price <= 0) {
                                throw new Error("Precio no válido.");
                            }
            
                            funkos[index].price = args.price;
                        }
                    } catch {
                        reject({success: false, message: 'Error en uno de los argumentos.'});
                    }

                    fs.writeFile(`src/users/${user}/funkos.json`, JSON.stringify(funkos, null, 2), 'utf8', (writeErr) => {
                        if (writeErr) {
                            reject({success: false, message: "Error al escribir en el archivo."});
                        } else {
                            resolve({success: true, message: `¡Modificado el Funko de id ${args.id} a la colección de ${args.user}!`});
                        }
                    });
                }
            })

            .catch((error) => {
                reject(error);
            });
        });
}

export const removeFunko = (user: string, id: number) => {
    return new Promise<ResponseType> ((resolve, reject) => {
        openFile(user)
        .then((funkos) => {
            const index = funkos.findIndex((funk: any) => Number(funk.id) === Number(id));
            
            if (index === -1) {
                reject({success: false, message: `No existe un Funko con el ID ${id} en la colección de ${user}.`});
                
            } else {
                funkos.splice(index, 1);

                fs.writeFile(`src/users/${user}/funkos.json`, JSON.stringify(funkos, null, 2), 'utf8', (writeErr) => {
                    if (writeErr) {
                        reject({success: false, message: "Error al escribir en el archivo."});
                    } else {
                        resolve({success: true, message: `¡Eliminado el Funko de ID ${id} de la colección de ${user}!`});
                    }
                });
            }
        })

        .catch((error) => {
            reject(error);
        });
    });
}


export const listFunko = (user: string) => {
    return new Promise<ResponseType> ((resolve, reject) => {
        openFile(user)
            .then((funkos) => {
                let str: string = '';
                str += "-------------------------------------------------------\n";
                funkos.forEach((funko: any) => {
                    str += printFunkos(funko);
                });
                resolve({success: true, message: str});
            })

            .catch((error) => {
                reject(error);
            });
    });
}


export const readFunko = (user: string, id: number) => {
    return new Promise<ResponseType> ((resolve, reject) => {
        openFile(user)
            .then((funkos) => {
                const index = funkos.findIndex((funk: any) => Number(funk.id) === Number(id));
                
                if (index === -1) {
                    reject({success: false, message: `No existe un Funko con el ID ${id} en la colección de ${user}.`});
                } else {
                    let str: string = '';
                    str += "-------------------------------------------------------\n";
                    str += printFunkos(funkos[index]);
                    resolve({success: true, message: str});
                }
            })

            .catch((error) => {
                reject(error);
            });
    });
}

/**
 * Imprime la información de un Funko
 * @param funko - Funko a imprimir
 * @returns La información del Funko
 */
function printFunkos(funko: any): string {
    let rslt: string = `ID: ${funko.id}\n`;
    rslt += `Nombre: ${funko.name}\n`;
    rslt += `Descripción: ${funko.description}\n`;
    rslt += `Tipo: ${funko.type}\n`;
    rslt += `Género: ${funko.genre}\n`;
    rslt += `Franquicia: ${funko.franchise}\n`;
    rslt += `Número: ${funko.number}\n`;
    rslt += `Exclusividad: ${funko.exclusive}\n`;
    rslt += `Características: ${funko.properties}\n`;
    rslt += `Precio: ${funko.price}\n`;
    rslt += '-------------------------------------------------------\n';

    return rslt;
}

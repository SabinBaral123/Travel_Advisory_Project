import * as db from "./db.js";
import express from "express";

const app = express();
app.use(express.json());

const configure = (client, vars) => {
    const { DB_NAME } = vars;

    app.get('/api/users', async (request, response) => {
        try {
            let criteria = {};
            for (let [key, value] of Object.entries(request.query)) {
                criteria[key] = {
                    $regex: value,
                    $options: 'i' // Case-insensitive search
                };
            }
    
            let result = await db.findDocuments(client, DB_NAME, 'users', criteria);
            response.status(200).send(result);
        }
        catch (e) {
            console.error(e); // print on the server
            response.status(500).send(`${e}`); // send to the client
        }
    });

    app.post('/api/users', async (request, response) => {
        try {
            let result = await db.insertDocument(client, DB_NAME, 'users', request.body);
            response.status(200).send(result);
        }
        catch (e) {
            console.error(e);
            response.status(500).send(`${e}`);
        }
    });
    app.delete('/api/users/:email', async (request, response) => {
        try {
            let result = await db.deleteDocument(client, DB_NAME, 'users', {
                email: {
                    $regex: request.params.email,
                    $options: 'i'
                }
            });
            response.status(200).send(result);
        }
        catch(e) {
            console.error(e);
            response.status(500).send(`${e}`);
        }
    });

    app.put('/api/users', async (request, response) => {
        let { filter, update } = request.body;

        try{
            let result = await db.updateDocument(client, DB_NAME, 'users',filter, update);
            response.status(200).send(result);

        }
        catch(e) {
            console.error(e);
            response.status(500).send(`${e}`);
        }
    });
}

const startServer = (PORT) => app.listen(PORT, console.warn(`Listening on port ${PORT}`));

export {
    configure,
    startServer
}
import * as db from "./db.js";
import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Approves requests from anywhere 
app.use(cors()); 

app.use((req, _res, next) => {
    const timestamp = new Date(Date.now());
    console.log(`[${timestamp.toDateString()} ${timestamp.toTimeString()}] / ${timestamp.toISOString()}`);
    console.log(req.method, req.hostname, req.path);
    console.log('headers:', req.headers);
    console.log('body:', req.body);
    next();
});

const configure = (client, vars) => {
    const { DB_NAME } = vars;

    app.get('/api/users', async (request, response) => {
        try {
            if (!client) {
                return response.status(500).send({ error: "Database connection not established" });
            }
    
            let criteria = {};
            for (let [key, value] of Object.entries(request.query)) {
                criteria[key] = {
                    $regex: value,
                    $options: 'i'
                };
            }
    
            console.log("Criteria used for query:", criteria);
    
            let result = await db.findDocuments(client, DB_NAME, 'users', criteria);
    
            console.log("Query Result:", result);
    
            if (result.length === 0) {
                return response.status(404).send({ message: "No users found" });
            }
    
            response.status(200).send(result);
        }
        catch (e) {
            console.error("Error in /api/users:", e);
            response.status(500).send({ error: "Internal Server Error", details: e.message });
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
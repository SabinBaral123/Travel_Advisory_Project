import * as db from "./db.js";
import express from "express";
import cors from "cors";
import { refreshDatabase } from "./setup.js";
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

    app.put('/api/refresh', async (request, response) => {
        try {
            await refreshDatabase(client, vars);  
            response.status(200).send({ message: "Database refreshed successfully" });
        } catch (error) {
            console.error("Error refreshing database:", error);
            response.status(500).send({ error: "Failed to refresh database", details: error.message });
        }
    });

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
    

    //API for the alert feature 
    app.get('/api/alerts', async (request, response) => {
        let projection = {
            _id: 0,  // mongodb automatically assume to include id so we are explicitly askin to not include it
                       // , 1 means include and 0 means not
            country_code: 1,
            country_name: 1
        };

        try {
            let result = await db.findDocuments(client, DB_NAME, 'alerts', {}, projection);
            response.send(result);
        }
        catch (e) {
            console.error(e);
            console.log(`${e}`);
            response.send([]);
        }

    });
    app.get('/api/alerts/:country_code', async (request, response) => {
        const { country_code } = request.params;
        try {
            let result = await db.findDocument(client, DB_NAME, 'alerts', { country_code });
            response.send(result);
        }
        catch (e) {
            console.error(e);
            console.log(`${e}`);
            response.send([]);
        }
    });
}

const startServer = (PORT) => app.listen(PORT, console.warn(`Listening on port ${PORT}`));

export {
    configure,
    startServer
}
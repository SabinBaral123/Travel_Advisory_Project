import vars from "./modules/vars.js";
import * as db from "./modules/db.js";

let client = null;

try {

    client = await db.initDatabase(vars);
    console.log(vars);
    let result = await db.insertDocument(client, 'test_db', 'test_collection', { 'test': 'field'});
    console.log(result);
    result = await db.deleteDocument(client, 'test_db', 'test_collection', { 'test': 'field'});
    console.log(result);
    result = await db.deleteCollection(client, 'test_db', 'test_collection');
    console.log(result);
    result = await db.deleteDatabase(client, 'test_db');
    console.log(result);
}
catch (e) {
    console.error(`${e}`);
}
finally {
    await client?.close();
}
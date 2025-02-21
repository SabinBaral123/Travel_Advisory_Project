import vars from "./modules/vars.js";
import * as db from "./modules/db.js";
import * as api from "./modules/api.js"
import * as cli from "./modules/cli.js"

try {
    let client = await db.initDatabase(vars);
    await cli.processArgs(client, vars);
    api.configure(client,vars);
    api.startServer(vars.PORT);
    //console.warn("!");
    
}
catch (e) {
    console.error(`${e}`);
}

import * as db from "./db.js";
import * as setup from "./setup.js";
import vars from "./vars.js";

const args = process.argv;


const processArgs = async (client,vars) => {
    

try {
    if (process.argv[2] == '-r' || process.argv[2] == '--refresh') {
        await setup.refreshDatabase(client, vars);
    }
    // let criteria = { 'email': { '$regex': 'abc' } };
    // let allEmailsWithABC = await db.findDocuments(client, vars.DB_NAME, 'users', criteria);
    // console.log(allEmailsWithABC);

     if (process.argv[2] == '-f' ||process.argv[2] == '--find') 
    {
        const collection = args[3];
        const field = args[4];
        const value = args[5];

        if (!collection || !field || !value) {
            console.error("Error: Not enough arguments");
            console.error("--find <collection> <field> <value-match>");
            process.exit(1);
        }

        const criteria = { [field]: { $regex: value } };
        const projection = { [field]: 1, _id: 0 };
        const results = await db.findDocuments(client, vars.DB_NAME, collection, criteria, projection);
        console.log(results);

    }
    //this is closing the databse connection and I am unable to connect to port turning it on
    //process.exit(); // exit to Cli 

    
} catch (error) {
    console.error("Error processing the Cli ARGUMENTS", error );
} 
    
}
export
{
processArgs
};

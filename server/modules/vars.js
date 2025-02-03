import { config } from "dotenv";
config();
 

const {
    DB_USER,
    DB_PASSWORD,
    DB_ADDRESS,
    DB_CLUSTER
} = process.env;

export default {
    DB_USER,
    DB_PASSWORD,
    DB_ADDRESS,
    DB_CLUSTER
};
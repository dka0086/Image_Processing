import dotenv from "dotenv"
import type { Knex } from "knex"

dotenv.config()
const config: {[key: string]: Knex.Config} = {
  development: {
    client: "pg",
    connection: {
       //connectionString: config.DATABASE_URL,
       host: process.env.DB_HOST || "localhost",
       port: Number(process.env.DB_PORT) || 5432,
       database: process.env.DB_HOST || "imgservice",
       user: process.env.DB_USER || "getulio",
       password: process.env.DB_PASSWORD || "12345",
       ssl: false,
    },
    pool: { //pool de conexoes onde ja possui conexoes prontas e abertas para uso
        min: 2,
        max: 10
    },
    useNullAsDefault: true,
    migrations: {
        extension: "ts",
        directory: "./src/database/migrations"
    },
    seeds: {
        extension: "ts",
        directory: "./src/database/seeds",
    },
  },   
}
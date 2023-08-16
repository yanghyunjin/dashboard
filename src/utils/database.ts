import { Pool } from "pg";

let conn: any;

if (!conn) {
  conn = new Pool({
    user: "postres",
    password: "postres",
    host: "localhost",
    port: 5432,
    database: "postres",
  });
}

export { conn };

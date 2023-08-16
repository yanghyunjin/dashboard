import { Pool } from "pg";

let conn: any;

if (!conn) {
  conn = new Pool({
    user: "postres",
    password: "mysecretpassword",
    host: "localhost",
    port: 5432,
    database: "postres",
  });
}

export { conn };

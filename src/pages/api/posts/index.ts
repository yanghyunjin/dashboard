// pages/api/savePost.ts

import { NextApiRequest, NextApiResponse } from "next";
import { conn } from "src/utils/database";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  switch (method) {
    case "GET":
      try {
        const query = "SELECT * FROM TB_EEC_posts";
        const response = await conn.query(query);
        return res.json(response.rows);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case "POST":
      try {
        const { title, content, type } = body;

        const query =
          "INSERT INTO TB_EEC_posts(title, content, type) VALUES ($1, $2, $3) RETURNING *";
        const values = [title, content, type];

        const response = await conn.query(query, values);

        return res.json(response.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    default:
      return res.status(400).json({ message: "Method are not supported" });
  }
}

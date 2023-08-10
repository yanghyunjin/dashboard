// pages/api/savePost.ts

import { NextApiRequest, NextApiResponse } from "next";
import { conn } from "src/utils/database";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  switch (method) {
    case "GET":
      try {
        const count_query = "SELECT COUNT(*) FROM TB_EEC_users";
        const count_response = await conn.query(count_query);
        const count = count_response.rows[0].count;

        const sum_query = "SELECT SUM(playtime) FROM TB_EEC_users";
        const sum_response = await conn.query(sum_query);
        const sum = sum_response.rows[0].sum;

        const avg_query = "SELECT AVG(playtime) FROM TB_EEC_users";
        const avg_response = await conn.query(avg_query);
        const avg = avg_response.rows[0].avg;

        return res.json({
          count: Number(count),
          sum: Number(sum),
          avg: Number(avg),
        });
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    case "POST":
      try {
        const { user, playingTime } = body;

        const query =
          "INSERT INTO TB_EEC_users(nickname, playtime) VALUES ($1, $2) RETURNING *";
        const values = [user, playingTime];

        const response = await conn.query(query, values);

        return res.json(response.rows[0]);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    default:
      return res.status(400).json({ message: "Method are not supported" });
  }
}

import { savingPlanDatabaseService } from "lib/saving-plan-database-service";
import { NextApiRequest, NextApiResponse } from "next";
import { get } from "src/saving-plan/api/get";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data: any }>
) {
  switch (req.method) {
    case "GET":
      const doc = await get(req.query.id as string, savingPlanDatabaseService);

      if (!doc) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Not Found" }));
        break;
      }

      res.writeHead(200);
      res.end(JSON.stringify(doc));
      break;

    default:
      res.writeHead(400, "Not supported HTTP method.");
  }
}

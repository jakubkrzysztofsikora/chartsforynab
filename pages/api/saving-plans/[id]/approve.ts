import { savingPlanDatabaseService } from "lib/saving-plan-database-service";
import { NextApiRequest, NextApiResponse } from "next";
import { approve } from "../../../../src/saving-plan/api/approve";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data: any }>
) {
  switch (req.method) {
    case "PUT":
      res.writeHead(200);
      res.end(
        JSON.stringify({
          id: await approve(JSON.parse(req.body), savingPlanDatabaseService),
        })
      );
      break;

    default:
      res.writeHead(400, "Not supported HTTP method.");
  }
}

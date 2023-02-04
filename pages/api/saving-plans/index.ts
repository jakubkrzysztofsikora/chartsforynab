import { savingPlanDatabaseService } from "lib/saving-plan-database-service";
import { NextApiRequest, NextApiResponse } from "next";
import { list } from "src/saving-plan/api/list";
import { create } from "../../../src/saving-plan/api/create";
import { update } from "../../../src/saving-plan/api/update";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data: any }>
) {
  switch (req.method) {
    case "POST":
      res.writeHead(201);
      res.end(
        JSON.stringify({
          data: {
            createdId: await create(
              JSON.parse(req.body),
              savingPlanDatabaseService
            ),
          },
        })
      );
      break;
    case "PUT":
      res.writeHead(200);
      res.end(
        JSON.stringify({
          data: {
            updatedId: await update(
              JSON.parse(req.body),
              savingPlanDatabaseService
            ),
          },
        })
      );

    case "GET":
      res.writeHead(200);
      res.end(
        JSON.stringify({
          data: await list(
            parseInt(req.query.page as string),
            parseInt(req.query.limit as string),
            savingPlanDatabaseService
          ),
        })
      );

    default:
      res.writeHead(400, "Not supported HTTP method.");
  }
}

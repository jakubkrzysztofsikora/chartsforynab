import { NextApiRequest, NextApiResponse } from "next";
import { create } from "../../src/saving-plan/api/create";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data: any }>
) {
  switch (req.method) {
    case "POST":
      res.writeHead(201);
      res.end(
        JSON.stringify({
          data: { createdId: await create(JSON.parse(req.body)) },
        })
      );
      break;

    default:
      res.writeHead(400, "Not supported HTTP method.");
  }
}

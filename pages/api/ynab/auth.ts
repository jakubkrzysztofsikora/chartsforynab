// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  auth_url: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({
    auth_url: `https://app.youneedabudget.com/oauth/authorize?client_id=9SN_T-R4SjO3U0wGHhA7HAyJ6cEOwOIyvlx6ERArBJk&redirect_uri=http:\/\/localhost:3000\/redirect\/ynab&response_type=token`,
  });
}

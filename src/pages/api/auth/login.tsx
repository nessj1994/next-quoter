// pages/api/auth/login.tsx
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const Login = async (req: NextApiRequest, res: NextApiResponse) => {
  const { headers, body } = req;

  try {
    const { data, headers: returnedHeaders } = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/inferno/v1/auth/`,
      body,
      {
        headers,
      },
    );

    Object.entries(returnedHeaders).forEach((keys) => {
      res.setHeader(keys[0], keys[1] as string);
    });

    res.send(data);
  } catch ({ response: { status, data } }) {
    res.status(status).json(data);
  }
};

export default Login;

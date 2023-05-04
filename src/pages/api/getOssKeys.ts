import {
  accessKeyId,
  accessKeySecret,
  bucketName,
  endpoint,
} from '@/utils/ossClient';
import type { NextApiRequest, NextApiResponse } from 'next';
const CryptoJS = require('crypto-js');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;
  switch (method) {
    case 'GET':
      const secretKey = process.env.AES_KEY;
      const data = JSON.stringify({
        accessKeyId,
        accessKeySecret,
        bucketName,
        endpoint,
      });
      console.log(secretKey);
      res.status(200).json({
        data: CryptoJS.AES.encrypt(data, secretKey).toString(),
      });
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}

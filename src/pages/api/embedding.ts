import type { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';
import { getBase64FromUrlServer } from '@/utils/tools';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { query, method, body } = req;
  switch (method) {
    case 'GET':
      // Get data from your database
      res.status(200).json({ name: 'ok' });
      break;
    case 'POST':
      const { img, fileName } = body;
      if (!fileName) {
        res.status(400).json({ message: 'fileName is missing' });
        return;
      }
      const base64str = await getBase64FromUrlServer(img);
      const python = spawn(
        'python3',
        ['src/scripts/embedding.py', base64str, 'False', fileName],
        {
          env: process.env,
        }
      );
      python.stdout.on('data', (data) => {
        console.log('AI解析图片中，请稍后...');
      });
      python.stderr.on('data', (data) => {
        res
          .status(500)
          .json({ message: 'AI学习图片失败, 由于' + data.toString() });
      });
      python.on('close', (code) => {
        res.status(200).json({ name: 'ok', code });
        console.log(`child process exited with code ${code}`);
      });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}

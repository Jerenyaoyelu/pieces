import type { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';
import { getBase64FromUrlServer, uploadFileToOss } from '@/utils/serverUtil';
import path from 'path';
const fs = require('fs');

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

      const scriptPath = path.join(
        process.cwd(),
        'public',
        'scripts',
        'embedding.py'
      );

      console.log('path', scriptPath);

      if (!fs.existsSync(scriptPath)) {
        res.status(500).json({ message: 'cannot find python script' });
        return;
      }

      const python = spawn('python3', [scriptPath, img, 'False', fileName], {
        env: process.env,
      });
      python.stdout.on('data', (data) => {
        console.log('AI解析图片中，请稍后...');
      });
      python.stderr.on('data', (data) => {
        res
          .status(500)
          .json({ message: 'AI学习图片失败, 由于' + data.toString() });
      });
      python.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        // console.log('开始上传文件到云端');
        const filePath = path.join('/static/npy/', fileName + '.npy');
        res.status(200).json({ msg: 'ok', code, data: { url: filePath } });
      });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}

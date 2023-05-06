import type { NextApiRequest, NextApiResponse } from 'next';
import { getBase64FromUrlServer, uploadFileToOss } from '@/utils/serverUtil';
import axios from 'axios';

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8888/'
    : 'https://pieces-sam.netlify.app/';
const pythonUrl = baseUrl + '.netlify/functions/runScripts/';

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
      const { img, fileName, type } = body;
      if (!fileName) {
        res.status(400).json({ message: 'fileName is missing' });
        return;
      }
      let base64str = img;
      if (type === 'link') {
        base64str = await getBase64FromUrlServer(img);
      }

      const response = await axios.post(pythonUrl, {
        base64str,
        fileName,
      });

      const data = response.data;

      console.log('ppp', response, data);

      res.status(200).json({ msg: 'ok', data });

      // const scriptPath = path.join(
      //   process.cwd(),
      //   'public',
      //   'scripts',
      //   'embedding.py'
      // );
      // const python = spawn(
      //   'python3',
      //   [scriptPath, base64str, 'False', fileName],
      //   {
      //     env: process.env,
      //   }
      // );
      // python.stdout?.on('data', (data) => {
      //   console.log('AI解析图片中，请稍后...');
      // });
      // python.stderr?.on('data', (data) => {
      //   res
      //     .status(500)
      //     .json({ message: 'AI学习图片失败, 由于' + data.toString() });
      // });
      // python.on('close', (code) => {
      //   console.log(`child process exited with code ${code}`);
      //   // console.log('开始上传文件到云端');
      //   const filePath = path.join('/static/npy/', fileName + '.npy');
      //   res.status(200).json({ msg: 'ok', code, data: { url: filePath } });
      // });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}

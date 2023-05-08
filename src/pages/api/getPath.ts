import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
const fs = require('fs');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { query, method, body } = req;
  const scriptPath = path.join(
    process.cwd(),
    'public',
    'scripts',
    'embedding.py'
  );

  console.log('path', scriptPath);

  const can = fs.existsSync(scriptPath);

  res.status(200).json({ message: 'can find file', path: scriptPath, can });
}

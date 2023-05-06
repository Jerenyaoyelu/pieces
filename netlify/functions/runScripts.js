const { spawn } = require('child_process');

exports.handler = async (event, context) => {
  const { base64str, fileName } = JSON.parse(event.body);

  return new Promise((resolve, reject) => {
    const pythonProcess = spawn(
      'python3',
      ['embedding.py', base64str, 'False', fileName],
      {
        env: process.env,
      }
    );

    let result = '';
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject({
          statusCode: 500,
          body: JSON.stringify({ error: 'Python script execution failed.' }),
        });
      } else {
        console.log(`child process exited with code ${code}`);
        // console.log('开始上传文件到云端');
        const filePath = path.join('/static/npy/', fileName + '.npy');
        resolve({
          statusCode: 200,
          body: JSON.stringify({ url: filePath }),
        });
      }
    });
  });
};

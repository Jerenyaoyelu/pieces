const fs = require('fs');
const path = require('path');
const axios = require('axios');

const url =
  'https://dl.fbaipublicfiles.com/segment_anything/sam_vit_h_4b8939.pth';
const filePath = path.join(
  process.cwd(),
  'src/scripts',
  'sam_vit_h_4b8939.pth'
);

const config = {
  url,
  responseType: 'stream',
  timeout: 1000 * 60 * 10,
};

if (!fs.existsSync(filePath)) {
  console.log('Downloading file...');
  axios(config)
    .then(function (response) {
      const file = fs.createWriteStream(filePath);
      // 计算总进度（总字节数）
      const totalLength = parseInt(response.headers['content-length'], 10);
      let bytesDownloaded = 0;
      let currentProgress = '0';
      // 监听'data'事件，计算每次写入的字节数并累加
      response.data.on('data', function (chunk) {
        bytesDownloaded += chunk.length;
        // 计算当前下载进度百分比
        const percentage = ((bytesDownloaded * 100) / totalLength).toFixed(1);
        if (percentage !== currentProgress) {
          console.log(`File downloading... ${percentage}% complete.`);
          currentProgress = percentage;
        }
      });
      response.data.pipe(file);
      // 监听response的end事件，确保所有数据已经写入到文件中
      response.data.on('end', function () {
        console.log('File download complete.');
        process.exit(); // 手动终止脚本的执行
      });
    })
    .catch(function (error) {
      console.error(error);
      process.exit(1); // 发生错误时终止脚本
    });
} else {
  console.log('File already exists.');
  process.exit();
}

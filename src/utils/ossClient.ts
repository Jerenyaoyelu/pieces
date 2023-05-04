const OSS = require('ali-oss');
// 注意这里的环境变量仅在服务端暴露，并没有暴露给客户端
// 因此客户端调用这里ossclient会报错
const accessKeyId = process.env.ALIOSS_KEY;
const accessKeySecret = process.env.ALIOSS_SECRET;
const bucketName = process.env.ALIOSS_BUCKET_NAME;
const endpoint = process.env.ALIOSS_ENDPOINT;

const client = new OSS({
  accessKeyId,
  accessKeySecret,
  bucket: bucketName,
  endpoint,
});

export default client;

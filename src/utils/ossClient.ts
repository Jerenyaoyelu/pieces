const OSS = require('ali-oss');

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

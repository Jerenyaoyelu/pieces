#!/bin/bash

trap 'kill 0' SIGINT

# 检查登录状态
login_status=$(netlify api getCurrentUser --silent)
if [[ $login_status == *"Failed"* ]]; then
  echo "Please log in to Netlify using 'netlify login'"
  exit 1
fi
# netlify dev 会启动edge functions, 因为需要下载raw.githubusercontent.com的内容，但无法连接会导致报错
netlify functions:serve&yarn dev
wait

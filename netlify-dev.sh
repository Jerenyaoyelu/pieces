#!/bin/bash

trap 'kill 0' SIGINT

# 检查登录状态
login_status=$(netlify api getCurrentUser --silent)
if [[ $login_status == *"Failed"* ]]; then
  echo "Please log in to Netlify using 'netlify login'"
  exit 1
fi

netlify dev --functions=netlify/functions
wait

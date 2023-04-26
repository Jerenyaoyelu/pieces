/** @type {import('next').NextConfig} */
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  ...nextConfig,
  webpack: (config, { isServer }) => {
    // 只在客户端构建时启用
    // onnx运行后端
    if (!isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: 'node_modules/onnxruntime-web/dist/*.wasm',
              to: path.join(__dirname, '.next/static/chunks/[name][ext]'),
            },
            {
              from: './src/scripts/npy',
              to: './npy',
            },
          ],
        })
      );
    }

    return config;
  },
};

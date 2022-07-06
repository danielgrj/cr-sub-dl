import path from 'path'
import { fileURLToPath } from 'url'

import WebExtPlugin from 'web-ext-plugin'
import CopyPlugin from 'copy-webpack-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  entry: './src/background.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'background_script.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  target: 'web',
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, './manifest.json'),
          to: path.join(__dirname, './dist'),
        },
        {
          from: path.join(__dirname, './public'),
          to: path.join(__dirname, './dist'),
        },
      ],
    }),
    new WebExtPlugin({
      sourceDir: path.join(__dirname, './dist'),
      startUrl: 'https://crunchyroll.com',
      browserConsole: true,
    }),
  ],
}

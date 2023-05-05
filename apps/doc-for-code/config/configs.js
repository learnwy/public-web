const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const isNoProduction = !isProduction;
const isAnalyze = process.env.NODE_ANALYZE === 'true';

function resolveProject(...paths) {
  return path.resolve(__dirname, '..', ...paths);
}

const webpackConfig = {
  htmlTitle: 'Doc For Code',
  publicPath: isProduction ? '/' : '/',
  devtool: isProduction ? false : 'inline-source-map',
  devPort: 3000,
  mode: isProduction ? 'production' : 'development',
};

const toolsConfig = {
  toolsPort: 4000,
}

module.exports.webpackConfig = webpackConfig;
module.exports.toolsConfig = toolsConfig;
module.exports.resolveProject = resolveProject;
module.exports.isProduction = isProduction;
module.exports.isNoProduction = isNoProduction;
module.exports.isAnalyze = isAnalyze;

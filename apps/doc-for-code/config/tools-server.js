const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const {toolsConfig} = require('./configs');
const {resolveProject} = require('./configs');

app.get('/icons', (req, res) => {
  const svgContent = fs.readdirSync(resolveProject('src/icons/assets')).filter(f => f.endsWith('.svg'))
    .map(f => ({
      name: path.basename(f, '.svg'),
      svgContent: fs.readFileSync(path.join(resolveProject('src/icons/assets', f)), {encoding: 'utf-8'})
    }));


  res.send(fs.readFileSync(resolveProject('config/tools-server.html'), {encoding: 'utf-8'})
    .replace(/%%TOOLS_SERVER%%/g, "Tools Icon")
    .replace(/%%TOOLS_SERVER_DATA%%/g, encodeURI(JSON.stringify({
      icons: svgContent
    }, undefined, 2)))
  )
  res.end();
})

app.listen(toolsConfig.toolsPort, () => {
  console.log('Tools Server listening on port %s', toolsConfig.toolsPort);
})
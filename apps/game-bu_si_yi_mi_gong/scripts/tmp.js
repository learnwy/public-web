const fs = require('fs');
const path = require('path');

const mgd = path.resolve(__dirname, 'minggong-gonglve-data');

const od = fs.readdirSync(mgd).filter(f => f.endsWith('.json'));

function format_group_info_yml(group_infos, internal) {
  const lines = [];

  for (const groupInfo of group_infos) {
    switch (groupInfo.type) {
      case 'text':
        lines.push(`- type: ${groupInfo}`);
        break;
      case 'group':
        break;
      case 'image':
        break;
      default:
        break;
    }
  }
  if (internal) {
    return lines;
  } else {
    return lines.join('\n');
  }
}

for (const f of od) {
  const af = path.resolve(mgd, f);
  const j = JSON.parse(fs.readFileSync(af, { encoding: 'utf-8' }));
  fs.readFileSync(path.resolve(mgd, `${f.substring(0, f.length - 4)}.yaml`), format_group_info_yml(j));
}

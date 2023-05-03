const fs = require('fs');
const path = require('path');

const mgd = path.resolve(__dirname, 'minggong-gonglve-data');

const od = fs.readdirSync(mgd).filter(f => f.endsWith('.json'));

/**
 *
 * @param {GroupInfo[] | GroupInfo[][]} group_infos
 * @param {{keep_array: boolean}|undefined} internal_config
 * @returns {string|*[]}
 */
function format_group_info_yml(group_infos, internal_config) {
  const lines = [];

  for (let group of group_infos) {
    if (group instanceof Array) {
      const group_lines = format_group_info_yml(group, { keep_array: true });
      lines.push(...group_lines.map(l => `  ${l}`));
    } else {
      switch (group.type) {
        case 'text':
          lines.push(`  - type: ${group.type}`);
          lines.push(`    value: ${JSON.stringify(group.value)}`);
          break;
        case 'group':
          lines.push(`  - type: ${group.type}`);
          lines.push(`  - value:`)
          const group_lines = format_group_info_yml(group.value, { keep_array: true });
          lines.push(...group_lines.map(l => `  ${l}`));
          break;
        case 'image':
          lines.push(`  - type: ${group.type}`);
          lines.push(`    value: ${group.value}`);
          break;
        default:
          break;
      }
    }
  }

  if (internal_config?.keep_array) {
    return lines;
  } else {
    return lines.join('\n');
  }
}

/**
 *
 * @param {GroupInfo[][] | GroupInfo[]} group_infos
 */
function reduce_object_deep(group_infos) {
  // group_infos is [GroupInfo[]]
  /**
   * @type {GroupInfo[]}
   */
  const process_group = [];
  for (let realGroupValueElement of group_infos) {
    if (realGroupValueElement instanceof Array) {
      const g_r = reduce_object_deep(realGroupValueElement);
      if (g_r.length === 1) {
        process_group.push(g_r[0]);
      } else {
        process_group.push({ type: 'group', value: g_r });
      }
      continue;
    }
    switch (realGroupValueElement.type) {
      case 'group':
        const g_r = reduce_object_deep(realGroupValueElement.value);
        if (g_r.length === 1) {
          process_group.push(g_r[0]);
        } else {
          process_group.push({ type: 'group', value: [g_r] });
        }
        break;
      case 'text':
        process_group.push(realGroupValueElement);
        break;
      case 'image':
        process_group.push(realGroupValueElement);
        break;
    }
  }
  return process_group;
}

function reduce_main() {
  for (const f of od) {
    const af = path.resolve(mgd, f);
    const j = JSON.parse(fs.readFileSync(af, { encoding: 'utf-8' }));
    const j_r = reduce_object_deep(j);
    fs.writeFileSync(path.resolve(mgd, `${f.substring(0, f.length - 5)}.json`), JSON.stringify(j_r, undefined, 2));
  }
}

function yaml_main() {
  for (const f of od) {
    const af = path.resolve(mgd, f);
    const j = JSON.parse(fs.readFileSync(af, { encoding: 'utf-8' }));
    const content = format_group_info_yml(j);
    fs.writeFileSync(path.resolve(mgd, `${f.substring(0, f.length - 5)}.yaml`), content);
  }
}

// reduce_main();
yaml_main();

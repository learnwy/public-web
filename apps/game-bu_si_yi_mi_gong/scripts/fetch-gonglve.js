// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-undef,no-console,no-unused-vars */
/**
 * @template T
 * @param {string} key
 * @param {T} value
 */
function set_in_local_storage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * @template T
 * @param {string} key
 * @returns {T | undefined}
 */
function get_in_local_storage(key) {
  const v = localStorage.getItem(key);
  if (v) {
    return JSON.parse(v);
  }
  return undefined;
}

function image_to_data_url(image) {
  image.crossOrigin = 'Anonymous';
  const canvas = document.createElement('CANVAS');
  const ctx = canvas.getContext('2d');
  canvas.height = image.naturalHeight;
  canvas.width = image.naturalWidth;
  ctx.drawImage(image, 0, 0);
  return canvas.toDataURL();
}

async function to_data_url(src) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  return new Promise((resolve, reject) => {
    img.onload = function () {
      resolve(image_to_data_url(img));
    };
    img.onerror = function (e) {
      reject(e);
    };
    img.src = src;
  });
}

/**
 * @template T
 * @param {string} key
 * @param {() => Promise<T>} fallback
 * @returns {Promise<T | undefined>}
 */
async function cache(key, fallback) {
  const cache_prefix = 'l_cache_';
  const cache_key = `${cache_prefix}/${key}`;
  const cache_data = get_in_local_storage(cache_key);
  if (cache_data) {
    return cache_data;
  }
  try {
    const data = await fallback();
    if (data) {
      set_in_local_storage(cache_key, cache_data);
    }
    return data;
  } catch {}
  return undefined;
}

const handle_migongziliao = {
  async steps() {
    let deal = await this.step_main();
    if (!deal) {
      deal = await this.step_list();
    }
    if (!deal) {
      deal = await this.step_detail();
    }
  },
  async step_main() {
    if (location.pathname === '/utility/contentCollection.html') {
      const main_page_content_ele = document.querySelector(
        'body > div > div._flex-1.contentCollection-main.contentCollection-content.flex-column',
      );
      const next = main_page_content_ele?.nextSibling;
      if (next?.nodeType === 8) {
        // in main page, not open dialog
        const migong_entrance_ele = document.querySelector(
          'body > div > div._flex-1.contentCollection-main.contentCollection-content.flex-column > div._flex-1 > div.list._flex-row > div:nth-child(5)',
        );
        // second page not route in page
        migong_entrance_ele?.click();
        return true;
      }
    }
    return false;
  },
  async step_list() {
    const items = Array.from(
      document.querySelectorAll('body > div > div.tagList._flex-1 > div.tagList-content > div > div'),
    );
    for (const item of items) {
      const migong_name = item.textContent.trim();
      const dealed = get_in_local_storage(this.build_key('detail_process', migong_name));
      if (!dealed) {
        item.click();
        return true;
      }
    }
    return false;
  },
  async step_detail() {
    if (location.pathname === '/wechat/share.html') {
      const title_ele = document.querySelector(
        'body > div > div.post-detail-main.scroll-container > div.post-detail-content.ltc-bg-b > div.post-detail-title',
      );
      const [type, migong_name] = title_ele?.textContent?.trim().split('丨') || [];
      if (type === '迷宫资料') {
        if (migong_name) {
          const detail_process_key = this.build_key('detail_process', migong_name);
          const dealed = get_in_local_storage(detail_process_key);
          if (!dealed) {
            const content_ele = document.querySelector(
              'body > div > div.post-detail-main.scroll-container > div.post-detail-content.ltc-bg-b > div:nth-child(4) > div.detail-dinner-detail',
            );
            if (content_ele) {
              const nodes = Array.from(content_ele.childNodes);

              function filter_empty_node(nodes) {
                return nodes.filter(n => {
                  const c_children = Array.from(n.childNodes);
                  if (c_children.length) {
                    return filter_empty_node(c_children).length !== 0;
                  }
                  if (n.nodeName === '#text') {
                    // text
                    return n.data.trim();
                  } else if (n.nodeName === 'H1' || n.nodeName === 'P') {
                    return n.textContent.trim();
                  } else if (n.nodeName === 'BR') {
                    return false;
                  } else {
                    return true;
                  }
                });
              }

              const filter_nodes = filter_empty_node(nodes);

              /**
               * @typedef GroupInfo
               * @field {'text' | 'image' | 'group'} type
               * @field {string | GroupInfo} value
               */

              /**
               * @type {GroupInfo[]}
               */
              const cur_group = [];
              /**
               * @type {GroupInfo[][]}
               */
              const groups = [cur_group];
              const context = {
                groups,
                cur_group,
              };

              /**
               * @param {Node} node
               * @param {{
               *   groups: GroupInfo[][],
               *   cur_group: GroupInfo[],
               * }} context
               */
              function process_node(node, context) {
                const nodeText = node.textContent.trim();
                const c_children = filter_empty_node(Array.from(node.childNodes));
                if (c_children.length > 0) {
                  const cur_group_info = {
                    type: 'group',
                    value: [[]],
                  };
                  context.cur_group.push(cur_group_info);
                  for (const cChild of c_children) {
                    process_node(cChild, {
                      groups: cur_group_info.value,
                      cur_group: cur_group_info.value[0],
                    });
                  }
                } else if (node.nodeName === 'H1' && nodeText) {
                  // header
                  context.cur_group = [{ type: 'text', value: nodeText }];
                  context.groups.push(context.cur_group);
                } else if (node.nodeName === 'IMAGE' || node.nodeName === 'IMG') {
                  context.cur_group.push({ type: 'image', value: image_to_data_url(node) });
                } else if (node.nodeName === 'H1' && !nodeText) {
                  // do nothing, only print error info
                  console.error(new Error('there is an empty h1'), node);
                } else if (node.nodeName === '#text') {
                  context.cur_group.push({ type: 'text', value: node.data.trim() });
                } else if (node.nodeName === 'P') {
                  context.cur_group.push({ type: 'text', value: node.textContent.trim() });
                } else {
                  throw new Error("can't process this node");
                }
              }

              for (const filterNode of filter_nodes) {
                process_node(filterNode, context);
              }
              set_in_local_storage(detail_process_key, context);
              history.back();
            }
          }
          return true;
        } else {
          throw new Error("it's migongziliao, but not migong_name");
        }
      }
    }
    return false;
  },

  async log_processed_data() {
    await this.step_list();
    if (location.pathname === '/utility/contentCollection.html') {
      const items = Array.from(
        document.querySelectorAll('body > div > div.tagList._flex-1 > div.tagList-content > div > div'),
      );
      const log_result = [];
      for (const item of items) {
        const migong_name = item.textContent.trim();
        const dealed = get_in_local_storage(this.build_key('detail_process', migong_name));
        log_result.push({ migong_name, data: dealed });
      }
      console.log(log_result);
    }
  },

  /**
   * @param {'detail_process'} type
   * @param {string} name
   */
  build_key(type, name) {
    return `migongziliao_${type}/${name}`;
  },
};

const features = {
  handle_migongziliao,
};

async function main() {
  await features.handle_migongziliao.log_processed_data();
}

main();

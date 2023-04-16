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
      document.querySelectorAll(
        'body > div > div.tagList._flex-1 > div.tagList-content > div > div',
      ),
    );
    for (const item of items) {
      const migong_name = item.textContent.trim();
      const dealed = get_in_local_storage(
        `migongziliao_list_dealed/${migong_name}`,
      );
      if (!dealed) {
        item.click();
        return true;
      }
      console.log(item.textContent);
    }
    return false;
  },
  async step_detail() {
    if (location.pathname === '/wechat/share.html') {
      const title_ele = document.querySelector(
        'body > div > div.post-detail-main.scroll-container > div.post-detail-content.ltc-bg-b > div.post-detail-title',
      );
      const [type, migong_name] =
        title_ele?.textContent?.trim().split('丨') || [];
      if (type === '迷宫资料') {
        if (migong_name) {
          const dealed = get_in_local_storage(
            `migongziliao_detail_dealed/${migong_name}`,
          );
          if (!dealed) {
            const content_ele = document.querySelector(
              'body > div > div.post-detail-main.scroll-container > div.post-detail-content.ltc-bg-b > div:nth-child(4) > div.detail-dinner-detail',
            );
            if (content_ele) {
              const nodes = Array.from(content_ele.childNodes);
              const filter_nodes = nodes.filter(n => {
                if (n.nodeName === '#text') {
                  // text
                  return n.textContent.trim();
                } else if (n.nodeName === 'H1') {
                  return Array.from(n.childNodes).some(
                    e => e.nodeName !== 'BR',
                  );
                } else {
                  return true;
                }
              });
              console.log(filter_nodes);
              const groups = [];
              const cur_group = [];
              const context = {
                groups,
                cur_group,
              };

              function process_node(node, context) {
                if (node.nodeName === 'H1' && node.textContent.trim()) {
                  context.cur_group = [];
                  context.groups.push(cur_group);
                } else {
                }
              }

              for (const filterNode of filter_nodes) {
                process_node(filterNode, context);
              }
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
};

const features = {
  handle_migongziliao,
};

async function main() {
  await features.handle_migongziliao.steps();
}

main();

import fs from 'node:fs';
import { resolve, extname, relative, dirname } from 'node:path';
import { pipeline } from 'node:stream';
import Debug from 'debug';
import MagicString from 'magic-string';
import { fetch } from 'node-fetch-native';
import { hash } from 'ohash';
import { DevEnvironment } from 'vite';

function slash(str) {
  return str.replace(/\\/g, "/");
}

const DefaultRules = [
  {
    match: /\b(https?:\/\/[\w#&?./-]*?\.(?:png|jpe?g|svg|ico|webp))(?=[`'")\]])/gi
  }
];
function isValidHttpUrl(str) {
  let url;
  try {
    url = new URL(str);
  } catch {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}
function sleep(seconds) {
  return new Promise((resolve2) => setTimeout(resolve2, seconds * 1e3));
}
const debug = Debug("vite-plugin-remote-assets");
function VitePluginRemoteAssets(options = {}) {
  const {
    assetsDir = "node_modules/.remote-assets",
    rules = DefaultRules,
    resolveMode = "relative",
    awaitDownload = true,
    retryTooManyRequests = false
  } = options;
  let dir = void 0;
  let config;
  const envs = [];
  async function downloadTo(url, filepath, { retryTooManyRequests: retryTooManyRequests2 }) {
    const writer = fs.createWriteStream(filepath);
    const response = await fetch(url);
    if (response.status === 429) {
      const retryAfter = +(response.headers.get("retry-after") || 0);
      if (!retryAfter) {
        throw new Error(`${url}: 429 without retry-after header`);
      } else {
        debug(`${url}: 429, retry after ${retryAfter} seconds`);
        await sleep(retryAfter);
        return await downloadTo(url, filepath, { retryTooManyRequests: retryTooManyRequests2 });
      }
    }
    return new Promise((resolve2, reject) => {
      pipeline(response.body, writer, (err) => {
        if (err)
          reject(err);
        else
          resolve2();
      });
    });
  }
  const tasksMap = {};
  async function transform(code, id) {
    const tasks = [];
    const s = new MagicString(code);
    let hasReplaced = false;
    let match;
    for (const rule of rules) {
      rule.match.lastIndex = 0;
      while (match = rule.match.exec(code)) {
        const start = match.index;
        const end = start + match[0].length;
        const url = match[0];
        if (!url || !isValidHttpUrl(url))
          continue;
        const hash$1 = hash(url) + (rule.ext || extname(url));
        const filepath = slash(resolve(dir, hash$1));
        debug("detected", url, hash$1);
        if (!fs.existsSync(filepath) || tasksMap[filepath]) {
          if (!tasksMap[filepath]) {
            tasksMap[filepath] = (async () => {
              try {
                debug("downloading", url);
                await downloadTo(url, filepath, { retryTooManyRequests });
                debug("downloaded", url);
              } catch (e) {
                if (fs.existsSync(filepath))
                  await fs.promises.unlink(filepath);
                throw e;
              } finally {
                delete tasksMap[filepath];
              }
            })();
          }
          tasks.push(tasksMap[filepath]);
          if (!awaitDownload)
            continue;
        }
        hasReplaced = true;
        const mode = typeof resolveMode === "function" ? resolveMode(id, url) : resolveMode;
        let newUrl;
        if (mode === "relative") {
          newUrl = slash(relative(dirname(id), `${dir}/${hash$1}`));
          if (newUrl[0] !== ".")
            newUrl = `./${newUrl}`;
        } else {
          let path = `${dir}/${hash$1}`;
          if (!path.startsWith("/"))
            path = `/${path}`;
          newUrl = `/@fs${path}`;
        }
        s.overwrite(start, end, newUrl);
      }
    }
    if (tasks.length) {
      if (awaitDownload) {
        await Promise.all(tasks);
      } else {
        Promise.all(tasks).then(() => {
          envs.forEach((env) => {
            if (env instanceof DevEnvironment) {
              const module2 = env.moduleGraph.getModuleById(id);
              if (module2)
                env.moduleGraph.invalidateModule(module2);
              return;
            }
            const module = env.moduleGraph.getModuleById(id);
            if (module)
              env.moduleGraph.invalidateModule(module);
          });
        });
      }
    }
    if (!hasReplaced)
      return null;
    return {
      code: s.toString(),
      map: config.build.sourcemap ? s.generateMap({ hires: true }) : null
    };
  }
  return {
    name: "vite-plugin-remote-assets",
    enforce: "pre",
    async configResolved(_config) {
      config = _config;
      dir = slash(resolve(config.root, assetsDir));
      if ("force" in config.server && config.server.force || config.optimizeDeps.force)
        await fs.promises.rm(dir, { recursive: true, force: true });
      await fs.promises.mkdir(dir, { recursive: true });
    },
    configureServer(server) {
      if ("environments" in server && typeof server.environments === "object" && server.environments != null) {
        Object.values(server.environments).forEach((env) => envs.push(env));
      } else {
        envs.push(server);
      }
    },
    async transform(code, id) {
      return await transform(code, id);
    },
    transformIndexHtml: {
      order: "pre",
      async handler(code, ctx) {
        return (await transform(code, ctx.filename))?.code;
      }
    }
  };
}

export { DefaultRules, VitePluginRemoteAssets, VitePluginRemoteAssets as default };

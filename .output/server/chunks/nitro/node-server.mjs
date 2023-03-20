globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'node:http';
import { Server } from 'node:https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, getRequestHeaders, setResponseHeader, createError, createApp, createRouter as createRouter$1, toNodeListener, fetchWithEvent, lazyEventHandler } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ofetch';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { hash } from 'ohash';
import { parseURL, withoutBase, joinURL, withQuery, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage } from 'unstorage';
import defu from 'defu';
import { toRouteMatcher, createRouter } from 'radix3';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"envPrefix":"NUXT_","routeRules":{"/__nuxt_error":{"cache":false},"/_nuxt/**":{"headers":{"cache-control":"public, max-age=2592000, immutable"}}}},"public":{}};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _runtimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const getEnv = (key) => {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]
  );
};
function isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function overrideConfig(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey);
    if (isObject(obj[key])) {
      if (isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      overrideConfig(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
}
overrideConfig(_runtimeConfig);
const config$1 = deepFreeze(_runtimeConfig);
const useRuntimeConfig = () => config$1;
function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

const useStorage = () => storage;

storage.mount('/assets', assets$1);

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  const validate = opts.validate || (() => true);
  async function get(key, resolver, shouldInvalidateCache) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || !validate(entry);
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      entry.value = await pending[key];
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry)) {
          useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = opts.shouldInvalidateCache?.(...args);
    const entry = await get(key, () => fn(...args), shouldInvalidateCache);
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return key.replace(/[^\dA-Za-z]/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const key = await opts.getKey?.(event);
      if (key) {
        return escapeKey(key);
      }
      const url = event.node.req.originalUrl || event.node.req.url;
      const friendlyName = escapeKey(decodeURI(parseURL(url).pathname)).slice(
        0,
        16
      );
      const urlHash = hash(url);
      return `${friendlyName}.${urlHash}`;
    },
    validate: (entry) => {
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: [opts.integrity, handler]
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const reqProxy = cloneWithProxy(incomingEvent.node.req, { headers: {} });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            for (const header in headers2) {
              this.setHeader(header, headers2[header]);
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.context = incomingEvent.context;
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = headers.Etag || headers.etag || `W/"${hash(body)}"`;
      headers["last-modified"] = headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString();
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      event.node.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler() {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(
        event,
        routeRules.redirect.to,
        routeRules.redirect.statusCode
      );
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      }
      return proxyRequest(event, target, {
        fetch: $fetch.raw,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    const path = new URL(event.node.req.url, "http://localhost").pathname;
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(path, useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

const plugins = [
  
];

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || event.node.req.url?.endsWith(".json") || event.node.req.url?.includes("/api/");
}
function normalizeError(error) {
  const cwd = typeof process.cwd === "function" ? process.cwd() : "/";
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.node.req.url,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  event.node.res.statusCode = errorObject.statusCode !== 200 && errorObject.statusCode || 500;
  if (errorObject.statusMessage) {
    event.node.res.statusMessage = errorObject.statusMessage;
  }
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (isJsonRequest(event)) {
    event.node.res.setHeader("Content-Type", "application/json");
    event.node.res.end(JSON.stringify(errorObject));
    return;
  }
  const isErrorPage = event.node.req.url?.startsWith("/__nuxt_error");
  const res = !isErrorPage ? await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig().app.baseURL, "/__nuxt_error"), errorObject), {
    headers: getRequestHeaders(event),
    redirect: "manual"
  }).catch(() => null) : null;
  if (!res) {
    const { template } = await import('../error-500.mjs');
    event.node.res.setHeader("Content-Type", "text/html;charset=UTF-8");
    event.node.res.end(template(errorObject));
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  if (res.status && res.status !== 200) {
    event.node.res.statusCode = res.status;
  }
  if (res.statusText) {
    event.node.res.statusMessage = res.statusText;
  }
  event.node.res.end(await res.text());
});

const assets = {
  "/bootstrap.svg": {
    "type": "image/svg+xml",
    "etag": "\"7fe-vIBPMcVqqpOyIVp5gAYa2sN13G4\"",
    "mtime": "2023-03-20T01:17:09.041Z",
    "size": 2046,
    "path": "../public/bootstrap.svg"
  },
  "/codeplatoon.svg": {
    "type": "image/svg+xml",
    "etag": "\"22a-WaAKJp38imeF3gaqbNA3avMD2ho\"",
    "mtime": "2023-03-20T01:17:09.041Z",
    "size": 554,
    "path": "../public/codeplatoon.svg"
  },
  "/django.svg": {
    "type": "image/svg+xml",
    "etag": "\"d93-OPbedmXvogukwESYdowyAFZyFls\"",
    "mtime": "2023-03-20T01:17:09.041Z",
    "size": 3475,
    "path": "../public/django.svg"
  },
  "/drip.svg": {
    "type": "image/svg+xml",
    "etag": "\"42b-I4le3mzD528IFGmjKai2end5A9c\"",
    "mtime": "2023-03-20T01:17:09.041Z",
    "size": 1067,
    "path": "../public/drip.svg"
  },
  "/favicon.svg": {
    "type": "image/svg+xml",
    "etag": "\"23b-mmlCeSeIRJS2fBhDIA3YPN2iHC4\"",
    "mtime": "2023-03-20T01:17:09.041Z",
    "size": 571,
    "path": "../public/favicon.svg"
  },
  "/github.svg": {
    "type": "image/svg+xml",
    "etag": "\"1117-G2GKlV6Mvd2y3avaSFtgG7mdmic\"",
    "mtime": "2023-03-20T01:17:09.041Z",
    "size": 4375,
    "path": "../public/github.svg"
  },
  "/grid.svg": {
    "type": "image/svg+xml",
    "etag": "\"121b-YMCUP07HtW8x/m22hCyIJMINZhE\"",
    "mtime": "2023-03-20T01:17:09.041Z",
    "size": 4635,
    "path": "../public/grid.svg"
  },
  "/heroku.svg": {
    "type": "image/svg+xml",
    "etag": "\"88e-VMMNFkvjSpkKd4h2+VEeAZ5gotU\"",
    "mtime": "2023-03-20T01:17:09.041Z",
    "size": 2190,
    "path": "../public/heroku.svg"
  },
  "/javascript.svg": {
    "type": "image/svg+xml",
    "etag": "\"376-Z99nAMlEN5cuL7wQtzRHlZIwzKU\"",
    "mtime": "2023-03-20T01:17:09.041Z",
    "size": 886,
    "path": "../public/javascript.svg"
  },
  "/linkedin.svg": {
    "type": "image/svg+xml",
    "etag": "\"78f-ft/A7rOoRc4QHiJusrSmKn0hmU0\"",
    "mtime": "2023-03-20T01:17:09.041Z",
    "size": 1935,
    "path": "../public/linkedin.svg"
  },
  "/materialUI.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b2-6vSJg3I1Tx19KsycXwlZXf0shUw\"",
    "mtime": "2023-03-20T01:17:09.041Z",
    "size": 434,
    "path": "../public/materialUI.svg"
  },
  "/mysql.svg": {
    "type": "image/svg+xml",
    "etag": "\"118d-b3h7pIZmaoTO4+13iWCVF8Nabmk\"",
    "mtime": "2023-03-20T01:17:09.041Z",
    "size": 4493,
    "path": "../public/mysql.svg"
  },
  "/netlify.svg": {
    "type": "image/svg+xml",
    "etag": "\"2530-RQCA589edzjaXWTy5ggJKn3TE1Y\"",
    "mtime": "2023-03-20T01:17:09.041Z",
    "size": 9520,
    "path": "../public/netlify.svg"
  },
  "/nuxt.svg": {
    "type": "image/svg+xml",
    "etag": "\"eaf-y/fuqm1FC6s3H50AQzGTLU0tirY\"",
    "mtime": "2023-03-20T01:17:09.037Z",
    "size": 3759,
    "path": "../public/nuxt.svg"
  },
  "/parents-n-parks.svg": {
    "type": "image/svg+xml",
    "etag": "\"5b49-XnjWfy+s4YIp7/IUqwRw9ABvUqo\"",
    "mtime": "2023-03-20T01:17:09.037Z",
    "size": 23369,
    "path": "../public/parents-n-parks.svg"
  },
  "/postgresql.svg": {
    "type": "image/svg+xml",
    "etag": "\"116d-oSs6rYgs1MEtCZkLkjwJsRR4flE\"",
    "mtime": "2023-03-20T01:17:09.037Z",
    "size": 4461,
    "path": "../public/postgresql.svg"
  },
  "/primevue.svg": {
    "type": "image/svg+xml",
    "etag": "\"836-3i0yRpAXDylfepVr4e2N6Y1hjUc\"",
    "mtime": "2023-03-20T01:17:09.037Z",
    "size": 2102,
    "path": "../public/primevue.svg"
  },
  "/python.svg": {
    "type": "image/svg+xml",
    "etag": "\"649-mOc+ykJBbeuwSfi2gEZg92BqTQU\"",
    "mtime": "2023-03-20T01:17:09.037Z",
    "size": 1609,
    "path": "../public/python.svg"
  },
  "/react.svg": {
    "type": "image/svg+xml",
    "etag": "\"16e-rJ57/ok8gn2W86b49QD00UZIEcc\"",
    "mtime": "2023-03-20T01:17:09.037Z",
    "size": 366,
    "path": "../public/react.svg"
  },
  "/resume-link.svg": {
    "type": "image/svg+xml",
    "etag": "\"bb7-q59inFj3Kcav0iuF1MJ3ysyb/sQ\"",
    "mtime": "2023-03-20T01:17:09.033Z",
    "size": 2999,
    "path": "../public/resume-link.svg"
  },
  "/serverless.svg": {
    "type": "image/svg+xml",
    "etag": "\"116-FCdpZxlLUAAgoIizwpsI/KqOTzw\"",
    "mtime": "2023-03-20T01:17:09.033Z",
    "size": 278,
    "path": "../public/serverless.svg"
  },
  "/typescript.svg": {
    "type": "image/svg+xml",
    "etag": "\"401-FShHtdL0NBSIFkUYgXYRBpfY1fs\"",
    "mtime": "2023-03-20T01:17:09.033Z",
    "size": 1025,
    "path": "../public/typescript.svg"
  },
  "/usmc.svg": {
    "type": "image/svg+xml",
    "etag": "\"2ee73-HyBRM2Pt/y8Ej0C1/Or9KTMxSus\"",
    "mtime": "2023-03-20T01:17:09.033Z",
    "size": 192115,
    "path": "../public/usmc.svg"
  },
  "/vue.svg": {
    "type": "image/svg+xml",
    "etag": "\"790-glS8Q5hgsTfWujQ9G5y0wYPtR3Q\"",
    "mtime": "2023-03-20T01:17:09.033Z",
    "size": 1936,
    "path": "../public/vue.svg"
  },
  "/_nuxt/color.473bc8ca.png": {
    "type": "image/png",
    "etag": "\"2873-/0xLyyIHiRspL1RO202p0t9dRc8\"",
    "mtime": "2023-03-20T01:17:09.029Z",
    "size": 10355,
    "path": "../public/_nuxt/color.473bc8ca.png"
  },
  "/_nuxt/composables.655f43d6.js": {
    "type": "application/javascript",
    "etag": "\"61-7cJsdU17Fp0lCty/Xva/YWIbKJM\"",
    "mtime": "2023-03-20T01:17:09.029Z",
    "size": 97,
    "path": "../public/_nuxt/composables.655f43d6.js"
  },
  "/_nuxt/entry.6446eb69.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7a7fc-DBp7mA/XJH8aSW7XmnHCXp1tTmg\"",
    "mtime": "2023-03-20T01:17:09.029Z",
    "size": 501756,
    "path": "../public/_nuxt/entry.6446eb69.css"
  },
  "/_nuxt/entry.df5bc71a.js": {
    "type": "application/javascript",
    "etag": "\"38f10-/BaHkiWUME0aMRL3SamxpRU1fic\"",
    "mtime": "2023-03-20T01:17:09.029Z",
    "size": 233232,
    "path": "../public/_nuxt/entry.df5bc71a.js"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-03-20T01:17:09.029Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.360dd33f.js": {
    "type": "application/javascript",
    "etag": "\"8ca-yZLE2ssdSr53hOlD2k+8a8gsp20\"",
    "mtime": "2023-03-20T01:17:09.029Z",
    "size": 2250,
    "path": "../public/_nuxt/error-404.360dd33f.js"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-03-20T01:17:09.029Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.b29290b2.js": {
    "type": "application/javascript",
    "etag": "\"778-72sNKtIdZDw4tu9mdNy3PkbVwKQ\"",
    "mtime": "2023-03-20T01:17:09.029Z",
    "size": 1912,
    "path": "../public/_nuxt/error-500.b29290b2.js"
  },
  "/_nuxt/error-component.5515d007.js": {
    "type": "application/javascript",
    "etag": "\"49e-PrbFCKMA+Anpp047lCKVzXm32es\"",
    "mtime": "2023-03-20T01:17:09.029Z",
    "size": 1182,
    "path": "../public/_nuxt/error-component.5515d007.js"
  },
  "/_nuxt/primeicons.131bc3bf.ttf": {
    "type": "font/ttf",
    "etag": "\"11a0c-zutG1ZT95cxQfN+LcOOOeP5HZTw\"",
    "mtime": "2023-03-20T01:17:09.029Z",
    "size": 72204,
    "path": "../public/_nuxt/primeicons.131bc3bf.ttf"
  },
  "/_nuxt/primeicons.3824be50.woff2": {
    "type": "font/woff2",
    "etag": "\"75e4-VaSypfAuNiQF2Nh0kDrwtfamwV0\"",
    "mtime": "2023-03-20T01:17:09.029Z",
    "size": 30180,
    "path": "../public/_nuxt/primeicons.3824be50.woff2"
  },
  "/_nuxt/primeicons.5e10f102.svg": {
    "type": "image/svg+xml",
    "etag": "\"4727e-0zMqRSQrj27b8/PHF2ooDn7c2WE\"",
    "mtime": "2023-03-20T01:17:09.025Z",
    "size": 291454,
    "path": "../public/_nuxt/primeicons.5e10f102.svg"
  },
  "/_nuxt/primeicons.90a58d3a.woff": {
    "type": "font/woff",
    "etag": "\"11a58-sWSLUL4TNQ/ei12ab+eDVN3MQ+Q\"",
    "mtime": "2023-03-20T01:17:09.025Z",
    "size": 72280,
    "path": "../public/_nuxt/primeicons.90a58d3a.woff"
  },
  "/_nuxt/primeicons.ce852338.eot": {
    "type": "application/vnd.ms-fontobject",
    "etag": "\"11abc-5N8jVcQFzTiq2jbtqQFagQ/quUw\"",
    "mtime": "2023-03-20T01:17:09.025Z",
    "size": 72380,
    "path": "../public/_nuxt/primeicons.ce852338.eot"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt":{"maxAge":2592000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler((event) => {
  if (event.node.req.method && !METHODS.has(event.node.req.method)) {
    return;
  }
  let id = decodeURIComponent(
    withLeadingSlash(
      withoutTrailingSlash(parseURL(event.node.req.url).pathname)
    )
  );
  let asset;
  const encodingHeader = String(
    event.node.req.headers["accept-encoding"] || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    event.node.res.setHeader("Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.node.res.removeHeader("cache-control");
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.node.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.node.res.statusCode = 304;
    event.node.res.end();
    return;
  }
  const ifModifiedSinceH = event.node.req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
    event.node.res.statusCode = 304;
    event.node.res.end();
    return;
  }
  if (asset.type && !event.node.res.getHeader("Content-Type")) {
    event.node.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag && !event.node.res.getHeader("ETag")) {
    event.node.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime && !event.node.res.getHeader("Last-Modified")) {
    event.node.res.setHeader("Last-Modified", asset.mtime);
  }
  if (asset.encoding && !event.node.res.getHeader("Content-Encoding")) {
    event.node.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.node.res.getHeader("Content-Length")) {
    event.node.res.setHeader("Content-Length", asset.size);
  }
  return readAsset(id);
});

const _lazy_yHHE30 = () => import('../handlers/renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_yHHE30, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_yHHE30, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  const router = createRouter$1();
  h3App.use(createRouteRulesHandler());
  const localCall = createCall(toNodeListener(h3App));
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(
    eventHandler((event) => {
      const envContext = event.node.req.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: $fetch });
    })
  );
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const s = server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const i = s.address();
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${i.family === "IPv6" ? `[${i.address}]` : i.address}:${i.port}${baseURL}`;
  console.log(`Listening ${url}`);
});
{
  process.on(
    "unhandledRejection",
    (err) => console.error("[nitro] [dev] [unhandledRejection] " + err)
  );
  process.on(
    "uncaughtException",
    (err) => console.error("[nitro] [dev] [uncaughtException] " + err)
  );
}
const nodeServer = {};

export { useRuntimeConfig as a, getRouteRules as g, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map

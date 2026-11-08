/* eslint-disable */

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    const url = new URL(request.url);

    // 如果访问根目录，返回HTML
    if (url.pathname === '/') {
      return new Response(getRootHtml(), {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    // 从请求中提取目标 URL，支持两种写法：
    // 1) /?url=<目标>（直播页在用）
    // 2) /<目标>（旧写法，兼容保留）
    const queryUrl = url.searchParams.get('url');
    let actualUrlStr = queryUrl
      ? queryUrl
      : decodeURIComponent(url.pathname.replace('/', ''));

    // 判断用户输入的 URL 是否带有协议
    actualUrlStr = ensureProtocol(actualUrlStr, url.protocol);

    // 只有 /<目标> 写法才需要把原查询参数拼回去；
    // ?url= 写法里目标 URL 自身的查询参数已包含在 url 参数值中
    if (!queryUrl) actualUrlStr += url.search;

    // 分片/清单按类型定缓存策略（免费版可用 cf.cacheTtl）：
    // .ts 分片内容不变，可长期缓存；.m3u8 清单直播时会变，只短暂缓存
    const isTs = /\.ts(\?|$)/i.test(actualUrlStr);
    const isM3u8 = /\.m3u8(\?|$)/i.test(actualUrlStr);
    const fetchOptions = {};
    if (isTs) {
      fetchOptions.cf = { cacheTtl: 86400, cacheEverything: true };
    } else if (isM3u8) {
      fetchOptions.cf = { cacheTtl: 10, cacheEverything: true };
    }

    // 创建新 Headers 对象，排除以 'cf-' 开头的请求头
    const newHeaders = filterHeaders(
      request.headers,
      (name) => !name.startsWith('cf-')
    );

    // 创建一个新的请求以访问目标 URL
    const modifiedRequest = new Request(actualUrlStr, {
      headers: newHeaders,
      method: request.method,
      body: request.body,
      redirect: 'manual',
    });

    // 发起对目标 URL 的请求（带上按类型定的边缘缓存参数）
    const response = await fetch(modifiedRequest, fetchOptions);
    let body = response.body;

    // 处理重定向
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      body = response.body;
      // 创建新的 Response 对象以修改 Location 头部
      return handleRedirect(response, body);
    } else if (response.headers.get('Content-Type')?.includes('text/html')) {
      body = await handleHtmlContent(
        response,
        url.protocol,
        url.host,
        actualUrlStr
      );
    }

    // 创建修改后的响应对象
    const modifiedResponse = new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

    // 缓存头：分片/清单按上面策略缓存，其余内容仍禁用缓存
    if (isTs) {
      modifiedResponse.headers.set('Cache-Control', 'public, max-age=86400');
    } else if (isM3u8) {
      modifiedResponse.headers.set('Cache-Control', 'public, max-age=10');
    } else {
      setNoCacheHeaders(modifiedResponse.headers);
    }

    // 添加 CORS 头部，允许跨域访问
    setCorsHeaders(modifiedResponse.headers);

    return modifiedResponse;
  } catch (error) {
    // 如果请求目标地址时出现错误，返回带有错误消息的响应和状态码 500（服务器错误）
    return jsonResponse(
      {
        error: error.message,
      },
      500
    );
  }
}

// 确保 URL 带有协议
function ensureProtocol(url, defaultProtocol) {
  return url.startsWith('http://') || url.startsWith('https://')
    ? url
    : defaultProtocol + '//' + url;
}

// 处理重定向
function handleRedirect(response, body) {
  const location = new URL(response.headers.get('location'));
  const modifiedLocation = `/${encodeURIComponent(location.toString())}`;
  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...response.headers,
      Location: modifiedLocation,
    },
  });
}

// 处理 HTML 内容中的相对路径
async function handleHtmlContent(response, protocol, host, actualUrlStr) {
  const originalText = await response.text();
  const regex = new RegExp('((href|src|action)=["\'])/(?!/)', 'g');
  let modifiedText = replaceRelativePaths(
    originalText,
    protocol,
    host,
    new URL(actualUrlStr).origin
  );

  return modifiedText;
}

// 替换 HTML 内容中的相对路径
function replaceRelativePaths(text, protocol, host, origin) {
  const regex = new RegExp('((href|src|action)=["\'])/(?!/)', 'g');
  return text.replace(regex, `$1${protocol}//${host}/${origin}/`);
}

// 返回 JSON 格式的响应
function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

// 过滤请求头
function filterHeaders(headers, filterFunc) {
  return new Headers([...headers].filter(([name]) => filterFunc(name)));
}

// 设置禁用缓存的头部
function setNoCacheHeaders(headers) {
  headers.set('Cache-Control', 'no-store');
}

// 设置 CORS 头部
function setCorsHeaders(headers) {
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  headers.set('Access-Control-Allow-Headers', '*');
}

// 返回根目录的 HTML
function getRootHtml() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css" rel="stylesheet">
  <title>Proxy Everything</title>
  <link rel="icon" type="image/png" href="https://img.icons8.com/color/1000/kawaii-bread-1.png">
  <meta name="Description" content="Proxy Everything with CF Workers.">
  <meta property="og:description" content="Proxy Everything with CF Workers.">
  <meta property="og:image" content="https://img.icons8.com/color/1000/kawaii-bread-1.png">
  <meta name="robots" content="index, follow">
  <meta http-equiv="Content-Language" content="zh-CN">
  <meta name="copyright" content="Copyright © ymyuuu">
  <meta name="author" content="ymyuuu">
  <link rel="apple-touch-icon-precomposed" sizes="120x120" href="https://img.icons8.com/color/1000/kawaii-bread-1.png">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
  <style>
      body, html {
          height: 100%;
          margin: 0;
      }
      .background {
          background-image: url('https://imgapi.cn/bing.php');
          background-size: cover;
          background-position: center;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
      }
      .card {
          background-color: rgba(255, 255, 255, 0.8);
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
      }
      .card:hover {
          background-color: rgba(255, 255, 255, 1);
          box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
      }
      .input-field input[type=text] {
          color: #2c3e50;
      }
      .input-field input[type=text]:focus+label {
          color: #2c3e50 !important;
      }
      .input-field input[type=text]:focus {
          border-bottom: 1px solid #2c3e50 !important;
          box-shadow: 0 1px 0 0 #2c3e50 !important;
      }
  </style>
</head>
<body>
  <div class="background">
      <div class="container">
          <div class="row">
              <div class="col s12 m8 offset-m2 l6 offset-l3">
                  <div class="card">
                      <div class="card-content">
                          <span class="card-title center-align"><i class="material-icons left">link</i>Proxy Everything</span>
                          <form id="urlForm" onsubmit="redirectToProxy(event)">
                              <div class="input-field">
                                  <input type="text" id="targetUrl" placeholder="在此输入目标地址" required>
                                  <label for="targetUrl">目标地址</label>
                              </div>
                              <button type="submit" class="btn waves-effect waves-light teal darken-2 full-width">跳转</button>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
  <script>
      function redirectToProxy(event) {
          event.preventDefault();
          const targetUrl = document.getElementById('targetUrl').value.trim();
          const currentOrigin = window.location.origin;
          window.open(currentOrigin + '/' + encodeURIComponent(targetUrl), '_blank');
      }
  </script>
</body>
</html>`;
}

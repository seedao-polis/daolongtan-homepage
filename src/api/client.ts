/** 龙潭官网域名下公开接口前缀 */
const API_ORIGIN = "https://daolongtan.cn";
const API_PREFIX = "/daolongtan/openapi/homepage";

function baseUrl(): string {
  return API_ORIGIN;
}

function buildHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  const token = import.meta.env.VITE_API_BEARER_TOKEN?.trim();
  if (token) {
    headers.Authorization = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }
  return headers;
}

function assertBusinessOk(
  json: unknown,
  httpOk: boolean,
  httpStatus: number,
): void {
  if (!json || typeof json !== "object") {
    if (!httpOk) throw new Error(`请求失败 HTTP ${httpStatus}`);
    return;
  }
  const o = json as Record<string, unknown>;
  if (typeof o.code !== "number") {
    if (!httpOk) throw new Error(`请求失败 HTTP ${httpStatus}`);
    return;
  }
  const ok = o.code === 0 || o.code === 200;
  if (ok) return;

  const msg =
    (typeof o.msg === "string" && o.msg) ||
    (typeof o.message === "string" && o.message) ||
    `接口返回 code=${o.code}`;

  if (o.code === 401) {
    throw new Error(
      `${msg}。公开页如需拉数：在 .env 中配置 VITE_API_BEARER_TOKEN，或使用后台已开放的免登录 OpenAPI（若有）。`,
    );
  }
  throw new Error(msg);
}

export async function apiGet<T>(path: string): Promise<T> {
  const url = `${baseUrl()}${API_PREFIX}${path}`;
  const res = await fetch(url, { headers: buildHeaders() });
  const text = await res.text();
  const ct = res.headers.get("content-type") ?? "";

  if (!ct.includes("application/json")) {
    const t = text.trimStart();
    if (t.startsWith("<") || t.startsWith("<!")) {
      throw new Error(
        "接口返回了网页而非 JSON：路径应以 /daolongtan 开头；请确认已拉取最新前端并检查 Vite 代理。",
      );
    }
    throw new Error(
      `期望 JSON，实际为「${ct || "未知"}」（HTTP ${res.status}）`,
    );
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("响应不是合法 JSON");
  }

  assertBusinessOk(json, res.ok, res.status);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return unwrapPayload(json) as T;
}

function unwrapPayload(json: unknown): unknown {
  if (json && typeof json === "object") {
    const o = json as Record<string, unknown>;
    if ("data" in o && o.data !== undefined) return o.data;
    if ("result" in o && o.result !== undefined) return o.result;
  }
  return json;
}

import { getStore } from "@netlify/blobs";
import { createHash, timingSafeEqual } from "node:crypto";

const STORE_NAME = "rawexxelvix-content";
const defaults = {
  sections: [
    { id: "sızıntı", title: "SIZINTI", body: "Bu bölümün içeriğini ADMIN panelinden değiştirebilirsin." },
    { id: "tool", title: "TOOL", body: "Araçlar ve bağlantılar burada gösterilebilir." },
    { id: "hakkımda", title: "HAKKIMDA", body: "RAWEXxELVİX alanına hoş geldin." }
  ]
};

const noStore = { "Cache-Control": "no-store" };

// Compares two strings in constant time (hashing first so lengths always match).
function safeEqual(a, b) {
  const ha = createHash("sha256").update(a, "utf8").digest();
  const hb = createHash("sha256").update(b, "utf8").digest();
  return timingSafeEqual(ha, hb);
}

// The browser may send the password URI-encoded so that non-Latin characters
// (e.g. Turkish letters) can travel safely in an HTTP header.
function suppliedCandidates(raw) {
  const out = [raw.trim()];
  try {
    const decoded = decodeURIComponent(raw).trim();
    if (decoded !== out[0]) out.push(decoded);
  } catch {
    // not URI-encoded; use the raw value only
  }
  return out;
}

function isAuthorized(request) {
  const expected = (process.env.ADMIN_PASSWORD ?? "").trim();
  const supplied = request.headers.get("x-admin-password");
  if (!expected || !supplied) return false;
  return suppliedCandidates(supplied).some((candidate) => safeEqual(candidate, expected));
}

export default async (request) => {
  const store = getStore(STORE_NAME);
  const url = new URL(request.url);

  if (request.method === "GET") {
    const content = await store.get("site-content", { type: "json" });
    return Response.json(content ?? defaults, { headers: noStore });
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!process.env.ADMIN_PASSWORD) {
    console.error("ADMIN_PASSWORD environment variable is not set");
  }

  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  }

  // Login check only: verify the password without touching stored content.
  if (url.searchParams.get("action") === "login") {
    return Response.json({ ok: true }, { headers: noStore });
  }

  let content;
  try {
    content = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!content || !Array.isArray(content.sections) || content.sections.length > 100) {
    return Response.json({ error: "Invalid content" }, { status: 400 });
  }

  const clean = {
    sections: content.sections.map((item) => ({
      id: String(item.id ?? "").slice(0, 80),
      title: String(item.title ?? "").trim().slice(0, 50),
      body: String(item.body ?? "").slice(0, 3000)
    })).filter(item => item.id && item.title)
  };

  await store.setJSON("site-content", clean);
  return Response.json({ ok: true }, { headers: noStore });
};

import { getStore } from "@netlify/blobs";

const store = getStore("rawexxelvix-content");
const defaults = {
  sections: [
    { id: "sızıntı", title: "SIZINTI", body: "Bu bölümün içeriğini ADMIN panelinden değiştirebilirsin." },
    { id: "tool", title: "TOOL", body: "Araçlar ve bağlantılar burada gösterilebilir." },
    { id: "hakkımda", title: "HAKKIMDA", body: "RAWEXxELVİX alanına hoş geldin." }
  ]
};

export default async (request) => {
  if (request.method === "GET") {
    const content = await store.get("site-content", { type: "json" });
    return Response.json(content ?? defaults, {
      headers: { "Cache-Control": "no-store" }
    });
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const expected = process.env.ADMIN_PASSWORD;
  const supplied = request.headers.get("x-admin-password");
  if (!expected || !supplied || supplied !== expected) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
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
  return Response.json({ ok: true });
};
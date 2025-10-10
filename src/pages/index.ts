import type { APIContext } from "astro";

export const prerender = false; // asegúrate de que se ejecute en SSR

function getPreferredLang(header: string | null, supported = ["es", "en"], fallback = "es"): string {
  if (!header) return fallback;

  // Ejemplos header: "es-ES,es;q=0.9,en;q=0.8"
  const candidates = header.split(",").map(part => {
    const [tag] = part.trim().split(";");       // "es-ES" | "es"
    const base = tag.split("-")[0].toLowerCase(); // "es"
    return base;
  });

  // Devuelve el primer idioma soportado que aparezca
  for (const c of candidates) {
    if (supported.includes(c)) return c;
  }
  return fallback;
}

export function GET({ request, redirect, url }: APIContext) {
  // evita bucles si ya estás en /es o /en
  if (url.pathname.startsWith("/es/") || url.pathname.startsWith("/en/")) {
    return new Response(null, { status: 204 }); // no hacemos nada
  }

  const header = request.headers.get("accept-language");
  const lang = getPreferredLang(header);

  return lang === "en"
    ? redirect("/en/", 307)
    : redirect("/es/", 307);
}

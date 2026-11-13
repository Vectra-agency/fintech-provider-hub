/**
 * Cloudflare Pages Function for "/" only (PRD §5): 302 by Accept-Language.
 * ru* → /ru/, everything else → /en/. Static fallback without the function: `_redirects` → `/ /en/ 302`.
 */
export const onRequest: PagesFunction = ({ request }) => {
  const url = new URL(request.url);
  const lang = prefersRussian(request.headers.get('Accept-Language')) ? 'ru' : 'en';
  return new Response(null, {
    status: 302,
    headers: {
      Location: `${url.origin}/${lang}/${url.search}`,
      Vary: 'Accept-Language',
      'Cache-Control': 'private, max-age=0',
    },
  });
};

/** Highest-q language range wins; ties keep header order. "ru", "ru-RU", "ru-UA"… count as Russian. */
export function prefersRussian(header: string | null): boolean {
  if (!header) return false;
  const ranges = header
    .split(',')
    .map((part, i) => {
      const [tag = '', ...params] = part.trim().split(';');
      const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
      return { tag: tag.toLowerCase(), q: q ? Number(q.slice(2)) : 1, i };
    })
    .filter((r) => r.tag && r.tag !== '*' && !Number.isNaN(r.q) && r.q > 0)
    .sort((a, b) => b.q - a.q || a.i - b.i);
  return ranges[0]?.tag.startsWith('ru') ?? false;
}

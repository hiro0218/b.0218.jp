export default function escapeHTML(html: string) {
  if (typeof html !== 'string') {
    return html;
  }

  return html
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#x27;')
    .replaceAll('`', '&#x60;');
}

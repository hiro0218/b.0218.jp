const escapeMap: { [key: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
};

const escapeRegExp = /[&<>"'`]/g;

export default function escapeHTML(html: string) {
  if (typeof html !== 'string') {
    return html;
  }

  return html.replace(escapeRegExp, (match) => escapeMap[match]);
}

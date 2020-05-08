self.addEventListener('message', (event) => {
  importScripts('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.0.2/highlight.min.js');

  self.hljs.configure({
    tabReplace: '  ',
    classPrefix: '',
  });

  const { text, languageSubset } = JSON.parse(event.data);
  const { value } = self.hljs.highlightAuto(text, languageSubset);

  postMessage(value);
});

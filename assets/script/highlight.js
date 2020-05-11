import Highlightjs from '~/assets/script/highlightjs.worker.js';

export default (element) => {
  const elementCode = element.querySelectorAll('pre code');

  for (let i = 0; i < elementCode.length; i++) {
    const worker = new Highlightjs();
    const element = elementCode[i];
    const className = element.className.replace('language-', '');

    // 送信
    worker.postMessage(
      JSON.stringify({
        languageSubset: [className],
        text: element.textContent,
      }),
    );
    // 受信
    worker.onmessage = (event) => {
      requestAnimationFrame(() => {
        if (className) {
          element.dataset.language = className;
        }
        element.classList.add('hljs');
        element.innerHTML = event.data;
      });
    };
  }
};
